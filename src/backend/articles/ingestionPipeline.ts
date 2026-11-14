/**
 * ZYBA Automated Article Ingestion Pipeline
 * Mengorkestrasi seluruh tahapan pengumpulan, parsing, filtering 4 layer,
 * penilaian relevansi AI, deteksi duplikasi, dan penyimpanan status artikel.
 */

import {
  getArticleSources,
  updateArticleSource,
  createOrUpsertArticle,
  recordSyncLog,
  getArticleBySlugOrId,
} from "../db/articleRepo";
import { fetchAndParseFeed, ParsedFeedItem } from "./rssParser";
import { evaluateKeywords } from "./keywordFilter";
import { evaluateArticleWithAI } from "./aiArticleProcessor";
import {
  normalizeCanonicalUrl,
  computeTitleSimilarity,
  generateArticleSlug,
} from "./duplicateDetector";
import { fetchFromNewsApi } from "./newsApiAdapter";
import { ArticleCategory, ArticleStatus } from "@/generated/account-client";

let isSyncInProgress = false;
let lastSyncStartedAt: number | null = null;
const SYNC_LOCK_TIMEOUT_MS = 60000; // 60 detik batas maksimal lock concurrency

export interface IngestionResult {
  success: boolean;
  message: string;
  articlesFound: number;
  articlesProcessed: number;
  articlesSaved: number;
  articlesRejected: number;
  durationMs: number;
  errors: string[];
}

/**
 * Menjalankan pipeline lengkap sinkronisasi artikel
 */
export async function runIngestionPipeline(options: {
  triggeredBy?: "CRON" | "MANUAL_ADMIN";
  targetSourceId?: string;
  maxArticlesPerSource?: number;
}): Promise<IngestionResult> {
  const {
    triggeredBy = "CRON",
    targetSourceId,
    maxArticlesPerSource = 5,
  } = options;

  const startTime = Date.now();

  // 1. Anti-Concurrency Lock
  if (isSyncInProgress && lastSyncStartedAt && Date.now() - lastSyncStartedAt < SYNC_LOCK_TIMEOUT_MS) {
    return {
      success: false,
      message: "Proses sinkronisasi sedang berjalan oleh request lain. Mencegah duplikasi paralel.",
      articlesFound: 0,
      articlesProcessed: 0,
      articlesSaved: 0,
      articlesRejected: 0,
      durationMs: Date.now() - startTime,
      errors: ["CONCURRENT_SYNC_BLOCKED"],
    };
  }

  isSyncInProgress = true;
  lastSyncStartedAt = Date.now();

  let totalFound = 0;
  let totalProcessed = 0;
  let totalSaved = 0;
  let totalRejected = 0;
  const errors: string[] = [];

  try {
    // 2. Ambil daftar sumber aktif
    let sources = await getArticleSources();
    sources = sources.filter((s) => s.isActive);

    if (targetSourceId) {
      sources = sources.filter((s) => s.id === targetSourceId);
    }

    // 3. Iterasi tiap sumber
    for (const source of sources) {
      let sourceFound = 0;
      let sourceSaved = 0;
      let sourceRejected = 0;

      try {
        console.log(`[INGESTION] Memproses sumber: ${source.name} (${source.url})`);
        const feedResult = await fetchAndParseFeed(source.url, 8000);
        const items = feedResult.items.slice(0, maxArticlesPerSource);

        sourceFound += items.length;
        totalFound += items.length;

        for (const item of items) {
          totalProcessed++;

          // A. Normalisasi Canonical URL & Sanitasi Teks
          const canonicalUrl = normalizeCanonicalUrl(item.link || item.guid);
          const title = item.title.trim();
          const description = (item.description || item.content || "").trim();

          // B. Deteksi Duplikasi URL
          const existingByUrl = await getArticleBySlugOrId(canonicalUrl);
          if (existingByUrl) {
            console.log(`[INGESTION] Duplikat URL diabaikan: ${title}`);
            continue;
          }

          // C. Layer 1: Keyword Filtering
          const keywordCheck = evaluateKeywords(title, description, item.content);
          if (!keywordCheck.passed) {
            console.log(`[INGESTION] Ditolak Layer 1 (Keyword): ${title} - ${keywordCheck.reason}`);
            totalRejected++;
            sourceRejected++;
            continue;
          }

          // D. Layer 2 & 3: Klasifikasi & AI Relevance Assessment
          const aiEval = await evaluateArticleWithAI({
            title,
            description,
            content: item.content,
            sourceName: source.name,
            suggestedCategory: source.defaultCategory || undefined,
          });

          if (!aiEval.isHealthRelevant || aiEval.relevanceScore < 60) {
            console.log(`[INGESTION] Ditolak Layer 3 (AI Score ${aiEval.relevanceScore}): ${title}`);
            totalRejected++;
            sourceRejected++;
            continue;
          }

          // E. Generate Unique Slug
          const baseSlug = generateArticleSlug(title);
          const slugSuffix = Math.random().toString(36).substring(2, 6);
          const slug = `${baseSlug}-${slugSuffix}`;

          // F. Tentukan Status Artikel (Default PENDING untuk review admin, atau PUBLISHED jika sangat kredibel)
          const status = ArticleStatus.PENDING;

          // G. Simpan Artikel ke Database
          const saveRes = await createOrUpsertArticle({
            sourceId: source.id,
            sourceName: source.name,
            sourceUrl: item.link,
            canonicalUrl,
            externalId: item.guid,
            title,
            slug,
            excerpt: aiEval.summary,
            content: item.content || item.description,
            category: aiEval.category,
            thumbnail: item.thumbnailUrl,
            publishedAt: item.pubDate,
            status,
            relevanceScore: aiEval.relevanceScore,
            relevanceReason: aiEval.relevanceReason,
            language: aiEval.language,
            readingTime: aiEval.readingTime,
          });

          if (saveRes.isNew) {
            totalSaved++;
            sourceSaved++;
            console.log(`[INGESTION] Berhasil disimpan (PENDING): ${title} [Skor: ${aiEval.relevanceScore}]`);
          }
        }

        // Perbarui status sumber
        await updateArticleSource(source.id, {
          lastSyncAt: new Date(),
          lastStatus: "SUCCESS",
          lastError: null,
          totalFetched: source.totalFetched + sourceFound,
          totalApproved: source.totalApproved + sourceSaved,
        });
      } catch (srcErr: any) {
        const errMsg = srcErr.message || String(srcErr);
        errors.push(`${source.name}: ${errMsg}`);
        console.warn(`[INGESTION] Error pada sumber ${source.name}:`, errMsg);

        await updateArticleSource(source.id, {
          lastSyncAt: new Date(),
          lastStatus: "ERROR",
          lastError: errMsg,
        });
      }
    }

    // 4. News API Ingestion (Opsional jika ada NEWS_API_KEY)
    if (process.env.NEWS_API_KEY && !targetSourceId) {
      try {
        const newsItems = await fetchFromNewsApi("mental health mindfulness", 3);
        totalFound += newsItems.length;

        for (const item of newsItems) {
          totalProcessed++;
          const canonicalUrl = normalizeCanonicalUrl(item.link);
          const existing = await getArticleBySlugOrId(canonicalUrl);
          if (existing) continue;

          const kwCheck = evaluateKeywords(item.title, item.description);
          if (!kwCheck.passed) {
            totalRejected++;
            continue;
          }

          const aiEval = await evaluateArticleWithAI({
            title: item.title,
            description: item.description,
            sourceName: "News API",
          });

          if (aiEval.relevanceScore >= 65) {
            const slug = generateArticleSlug(item.title, Math.random().toString(36).substring(2, 6));
            await createOrUpsertArticle({
              sourceName: "News API",
              sourceUrl: item.link,
              canonicalUrl,
              externalId: item.guid,
              title: item.title,
              slug,
              excerpt: aiEval.summary,
              category: aiEval.category,
              thumbnail: item.thumbnailUrl,
              publishedAt: item.pubDate,
              status: ArticleStatus.PENDING,
              relevanceScore: aiEval.relevanceScore,
              relevanceReason: aiEval.relevanceReason,
              language: aiEval.language,
              readingTime: aiEval.readingTime,
            });
            totalSaved++;
          } else {
            totalRejected++;
          }
        }
      } catch (newsErr: any) {
        console.warn("[INGESTION] News API pass gagal:", newsErr.message || newsErr);
      }
    }

    const durationMs = Date.now() - startTime;
    const finalStatus = errors.length === 0 ? "SUCCESS" : totalSaved > 0 ? "PARTIAL" : "FAILED";

    // 5. Catat Log Sinkronisasi
    await recordSyncLog({
      sourceName: targetSourceId ? `Sumber Spesifik (${targetSourceId})` : "Semua Sumber Aktif",
      status: finalStatus,
      articlesFound: totalFound,
      articlesProcessed: totalProcessed,
      articlesRejected: totalRejected,
      articlesApproved: totalSaved,
      errorMessage: errors.length > 0 ? errors.join("; ") : null,
      durationMs,
      triggeredBy,
    });

    return {
      success: finalStatus !== "FAILED",
      message: `Sinkronisasi selesai: ${totalSaved} artikel baru disimpan (status PENDING), ${totalRejected} artikel tidak relevan ditolak.`,
      articlesFound: totalFound,
      articlesProcessed: totalProcessed,
      articlesSaved: totalSaved,
      articlesRejected: totalRejected,
      durationMs,
      errors,
    };
  } finally {
    isSyncInProgress = false;
  }
}
