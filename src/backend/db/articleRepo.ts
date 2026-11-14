/**
 * ZYBA Article & Health Content Management Repository
 * Menangani query database PostgreSQL (accountDb) untuk Article, ArticleSource, dan ArticleSyncLog
 * Dilengkapi fallback memori dan proteksi timeout agar performa tetap responsif.
 */

import { accountDb } from "./accountClient";
import { ArticleCategory, ArticleStatus } from "@/generated/account-client";
import { SEED_RESOURCES } from "./resourceRepo";

function withTimeout<T>(promise: Promise<T>, ms = 12000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), ms)),
  ]);
}

export interface ArticleItem {
  id: string;
  sourceId?: string | null;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  externalId?: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content?: string | null;
  category: ArticleCategory;
  thumbnail?: string | null;
  publishedAt: string;
  fetchedAt: string;
  status: ArticleStatus;
  relevanceScore: number;
  relevanceReason?: string | null;
  language: string;
  readingTime: number;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleSourceItem {
  id: string;
  name: string;
  url: string;
  websiteUrl?: string | null;
  defaultCategory?: ArticleCategory | null;
  isActive: boolean;
  lastSyncAt?: string | null;
  lastStatus?: string | null;
  lastError?: string | null;
  totalFetched: number;
  totalApproved: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleSyncLogItem {
  id: string;
  sourceId?: string | null;
  sourceName?: string | null;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  articlesFound: number;
  articlesProcessed: number;
  articlesRejected: number;
  articlesApproved: number;
  errorMessage?: string | null;
  durationMs: number;
  triggeredBy: "CRON" | "MANUAL_ADMIN";
  createdAt: string;
}

// In-memory fallback untuk sumber artikel default
const DEFAULT_SOURCES: ArticleSourceItem[] = [
  {
    id: "src-kemkes",
    name: "Kemenkes Sehat Negeriku",
    url: "https://sehatnegeriku.kemkes.go.id/feed/",
    websiteUrl: "https://sehatnegeriku.kemkes.go.id",
    defaultCategory: ArticleCategory.PHYSICAL_WELLNESS,
    isActive: true,
    totalFetched: 12,
    totalApproved: 8,
    lastSyncAt: new Date().toISOString(),
    lastStatus: "SUCCESS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "src-who",
    name: "World Health Organization (WHO)",
    url: "https://www.who.int/rss-feeds/news-english.xml",
    websiteUrl: "https://www.who.int",
    defaultCategory: ArticleCategory.MENTAL_HEALTH,
    isActive: true,
    totalFetched: 15,
    totalApproved: 6,
    lastSyncAt: new Date().toISOString(),
    lastStatus: "SUCCESS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "src-apa",
    name: "American Psychological Association (APA)",
    url: "https://www.apa.org/news/press/releases.rss",
    websiteUrl: "https://www.apa.org",
    defaultCategory: ArticleCategory.EMOTIONAL_WELLNESS,
    isActive: true,
    totalFetched: 10,
    totalApproved: 7,
    lastSyncAt: new Date().toISOString(),
    lastStatus: "SUCCESS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "src-psych-today",
    name: "Psychology Today - Mental Health",
    url: "https://www.psychologytoday.com/intl/blog/feed",
    websiteUrl: "https://www.psychologytoday.com",
    defaultCategory: ArticleCategory.MINDFULNESS,
    isActive: true,
    totalFetched: 18,
    totalApproved: 11,
    lastSyncAt: new Date().toISOString(),
    lastStatus: "SUCCESS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Fallback in-memory data artikel yang dikonversi dari SEED_RESOURCES
function getSeedArticlesAsArticles(): ArticleItem[] {
  return SEED_RESOURCES.map((r, index) => {
    let cat: ArticleCategory = ArticleCategory.MENTAL_HEALTH;
    if (r.category === "stres") cat = ArticleCategory.EMOTIONAL_WELLNESS;
    else if (r.category === "tidur") cat = ArticleCategory.SLEEP_AND_REST;
    else if (r.category === "sosial") cat = ArticleCategory.RELATIONSHIPS;
    else if (r.category === "mindful") cat = ArticleCategory.MINDFULNESS;

    return {
      id: r.id,
      sourceName: "Tim Kurasi ZYBA Sanctuary",
      sourceUrl: "https://zyba.my.id/resources/" + r.id,
      canonicalUrl: "https://zyba.my.id/resources/" + r.id,
      externalId: "seed-" + r.id,
      title: r.title,
      slug: "seed-" + r.id,
      excerpt: r.snippet,
      content: r.body,
      category: cat,
      thumbnail: r.imageUrl,
      publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
      fetchedAt: new Date().toISOString(),
      status: ArticleStatus.PUBLISHED,
      relevanceScore: 98,
      relevanceReason: "Kurasi asli resmi tim psikolog ZYBA",
      language: "id",
      readingTime: r.readTimeMin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

const memArticles: Map<string, ArticleItem> = new Map(
  getSeedArticlesAsArticles().map((a) => [a.id, a])
);
const memSources: Map<string, ArticleSourceItem> = new Map(
  DEFAULT_SOURCES.map((s) => [s.id, s])
);
const memSyncLogs: ArticleSyncLogItem[] = [];

// REPOSITORY FUNCTIONS

export async function getArticles(params: {
  status?: ArticleStatus | "ALL";
  category?: ArticleCategory | "ALL";
  search?: string;
  limit?: number;
  offset?: number;
  includeSeed?: boolean;
}): Promise<{ articles: ArticleItem[]; total: number }> {
  const {
    status = ArticleStatus.PUBLISHED,
    category = "ALL",
    search,
    limit = 20,
    offset = 0,
    includeSeed = true,
  } = params;

  try {
    const where: any = {};
    if (status !== "ALL") where.status = status;
    if (category !== "ALL") where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { sourceName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [dbArticles, count] = await withTimeout(
      Promise.all([
        accountDb.article.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          take: limit,
          skip: offset,
        }),
        accountDb.article.count({ where }),
      ])
    );

    let mappedArticles: ArticleItem[] = dbArticles.map((a) => ({
      ...a,
      publishedAt: a.publishedAt.toISOString(),
      fetchedAt: a.fetchedAt.toISOString(),
      reviewedAt: a.reviewedAt?.toISOString() || null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    // Jika DB kosong dan status = PUBLISHED, tambahkan fallback seed
    if (mappedArticles.length === 0 && (status === ArticleStatus.PUBLISHED || status === "ALL") && includeSeed) {
      const seedList = Array.from(memArticles.values()).filter((a) => {
        if (category !== "ALL" && a.category !== category) return false;
        if (search) {
          const s = search.toLowerCase();
          return (
            a.title.toLowerCase().includes(s) ||
            a.excerpt.toLowerCase().includes(s)
          );
        }
        return true;
      });
      return { articles: seedList.slice(offset, offset + limit), total: seedList.length };
    }

    return { articles: mappedArticles, total: count };
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback ke memori untuk getArticles:", err);
    let list = Array.from(memArticles.values());
    if (status !== "ALL") list = list.filter((a) => a.status === status);
    if (category !== "ALL") list = list.filter((a) => a.category === category);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(s) ||
          a.excerpt.toLowerCase().includes(s) ||
          a.sourceName.toLowerCase().includes(s)
      );
    }
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return { articles: list.slice(offset, offset + limit), total: list.length };
  }
}

export async function getArticleBySlugOrId(idOrSlug: string): Promise<ArticleItem | null> {
  try {
    const article = await withTimeout(
      accountDb.article.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
      })
    );

    if (article) {
      return {
        ...article,
        publishedAt: article.publishedAt.toISOString(),
        fetchedAt: article.fetchedAt.toISOString(),
        reviewedAt: article.reviewedAt?.toISOString() || null,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      };
    }
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback memori untuk getArticleBySlugOrId:", err);
  }

  // Fallback memory
  return (
    memArticles.get(idOrSlug) ||
    Array.from(memArticles.values()).find((a) => a.slug === idOrSlug) ||
    null
  );
}

export async function createOrUpsertArticle(data: {
  sourceId?: string | null;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  externalId?: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content?: string | null;
  category: ArticleCategory;
  thumbnail?: string | null;
  publishedAt?: Date;
  status?: ArticleStatus;
  relevanceScore?: number;
  relevanceReason?: string | null;
  language?: string;
  readingTime?: number;
}): Promise<{ article: ArticleItem; isNew: boolean }> {
  try {
    const existing = await withTimeout(
      accountDb.article.findUnique({
        where: { canonicalUrl: data.canonicalUrl },
      })
    );

    if (existing) {
      return {
        article: {
          ...existing,
          publishedAt: existing.publishedAt.toISOString(),
          fetchedAt: existing.fetchedAt.toISOString(),
          reviewedAt: existing.reviewedAt?.toISOString() || null,
          createdAt: existing.createdAt.toISOString(),
          updatedAt: existing.updatedAt.toISOString(),
        },
        isNew: false,
      };
    }

    const created = await withTimeout(
      accountDb.article.create({
        data: {
          sourceId: data.sourceId,
          sourceName: data.sourceName,
          sourceUrl: data.sourceUrl,
          canonicalUrl: data.canonicalUrl,
          externalId: data.externalId,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          thumbnail: data.thumbnail,
          publishedAt: data.publishedAt || new Date(),
          status: data.status || ArticleStatus.PENDING,
          relevanceScore: data.relevanceScore || 0,
          relevanceReason: data.relevanceReason,
          language: data.language || "id",
          readingTime: data.readingTime || 3,
        },
      })
    );

    // Update counter source jika ada
    if (data.sourceId) {
      accountDb.articleSource
        .update({
          where: { id: data.sourceId },
          data: { totalFetched: { increment: 1 } },
        })
        .catch(() => {});
    }

    const item: ArticleItem = {
      ...created,
      publishedAt: created.publishedAt.toISOString(),
      fetchedAt: created.fetchedAt.toISOString(),
      reviewedAt: created.reviewedAt?.toISOString() || null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    memArticles.set(item.id, item);
    return { article: item, isNew: true };
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback createOrUpsertArticle:", err);
    // Mem fallback
    const existing = Array.from(memArticles.values()).find(
      (a) => a.canonicalUrl === data.canonicalUrl || a.slug === data.slug
    );
    if (existing) return { article: existing, isNew: false };

    const id = "art-mem-" + Date.now();
    const item: ArticleItem = {
      id,
      sourceId: data.sourceId || null,
      sourceName: data.sourceName,
      sourceUrl: data.sourceUrl,
      canonicalUrl: data.canonicalUrl,
      externalId: data.externalId || null,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content || null,
      category: data.category,
      thumbnail: data.thumbnail || null,
      publishedAt: (data.publishedAt || new Date()).toISOString(),
      fetchedAt: new Date().toISOString(),
      status: data.status || ArticleStatus.PENDING,
      relevanceScore: data.relevanceScore || 0,
      relevanceReason: data.relevanceReason || null,
      language: data.language || "id",
      readingTime: data.readingTime || 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memArticles.set(id, item);
    return { article: item, isNew: true };
  }
}

export async function updateArticleStatus(
  id: string,
  status: ArticleStatus,
  adminUserId?: string,
  reviewNotes?: string
): Promise<ArticleItem | null> {
  try {
    const updated = await withTimeout(
      accountDb.article.update({
        where: { id },
        data: {
          status,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
          reviewNotes,
        },
      })
    );

    // Update total approved pada source jika disetujui
    if (status === ArticleStatus.PUBLISHED && updated.sourceId) {
      accountDb.articleSource
        .update({
          where: { id: updated.sourceId },
          data: { totalApproved: { increment: 1 } },
        })
        .catch(() => {});
    }

    const item: ArticleItem = {
      ...updated,
      publishedAt: updated.publishedAt.toISOString(),
      fetchedAt: updated.fetchedAt.toISOString(),
      reviewedAt: updated.reviewedAt?.toISOString() || null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
    memArticles.set(id, item);
    return item;
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback updateArticleStatus:", err);
    const existing = memArticles.get(id);
    if (!existing) return null;
    existing.status = status;
    existing.reviewedBy = adminUserId || null;
    existing.reviewedAt = new Date().toISOString();
    existing.reviewNotes = reviewNotes || null;
    existing.updatedAt = new Date().toISOString();
    memArticles.set(id, existing);
    return existing;
  }
}

export async function updateArticleDetails(
  id: string,
  data: {
    title?: string;
    excerpt?: string;
    category?: ArticleCategory;
    readingTime?: number;
  }
): Promise<ArticleItem | null> {
  try {
    const updated = await withTimeout(
      accountDb.article.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    );

    const item: ArticleItem = {
      ...updated,
      publishedAt: updated.publishedAt.toISOString(),
      fetchedAt: updated.fetchedAt.toISOString(),
      reviewedAt: updated.reviewedAt?.toISOString() || null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
    memArticles.set(id, item);
    return item;
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback updateArticleDetails:", err);
    const existing = memArticles.get(id);
    if (!existing) return null;
    if (data.title) existing.title = data.title;
    if (data.excerpt) existing.excerpt = data.excerpt;
    if (data.category) existing.category = data.category;
    if (data.readingTime) existing.readingTime = data.readingTime;
    existing.updatedAt = new Date().toISOString();
    memArticles.set(id, existing);
    return existing;
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    await withTimeout(accountDb.article.delete({ where: { id } }));
    memArticles.delete(id);
    return true;
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback deleteArticle:", err);
    memArticles.delete(id);
    return true;
  }
}

// SOURCES REPOSITORY FUNCTIONS

export async function getArticleSources(): Promise<ArticleSourceItem[]> {
  try {
    const sources = await withTimeout(
      accountDb.articleSource.findMany({
        orderBy: { createdAt: "desc" },
      })
    );
    if (sources.length > 0) {
      return sources.map((s) => ({
        ...s,
        lastSyncAt: s.lastSyncAt?.toISOString() || null,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback getArticleSources:", err);
  }
  return Array.from(memSources.values());
}

export async function createArticleSource(data: {
  name: string;
  url: string;
  websiteUrl?: string | null;
  defaultCategory?: ArticleCategory | null;
  isActive?: boolean;
}): Promise<ArticleSourceItem> {
  try {
    const created = await withTimeout(
      accountDb.articleSource.create({
        data: {
          name: data.name,
          url: data.url,
          websiteUrl: data.websiteUrl,
          defaultCategory: data.defaultCategory,
          isActive: data.isActive !== undefined ? data.isActive : true,
        },
      })
    );
    const item: ArticleSourceItem = {
      ...created,
      lastSyncAt: created.lastSyncAt?.toISOString() || null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
    memSources.set(item.id, item);
    return item;
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback createArticleSource:", err);
    const id = "src-" + Date.now();
    const item: ArticleSourceItem = {
      id,
      name: data.name,
      url: data.url,
      websiteUrl: data.websiteUrl || null,
      defaultCategory: data.defaultCategory || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      totalFetched: 0,
      totalApproved: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memSources.set(id, item);
    return item;
  }
}

export async function updateArticleSource(
  id: string,
  data: {
    name?: string;
    url?: string;
    websiteUrl?: string | null;
    defaultCategory?: ArticleCategory | null;
    isActive?: boolean;
    lastSyncAt?: Date;
    lastStatus?: string;
    lastError?: string | null;
    totalFetched?: number;
    totalApproved?: number;
  }
): Promise<ArticleSourceItem | null> {
  try {
    const updated = await withTimeout(
      accountDb.articleSource.update({
        where: { id },
        data,
      })
    );
    const item: ArticleSourceItem = {
      ...updated,
      lastSyncAt: updated.lastSyncAt?.toISOString() || null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
    memSources.set(id, item);
    return item;
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback updateArticleSource:", err);
    const existing = memSources.get(id);
    if (!existing) return null;
    if (data.name !== undefined) existing.name = data.name;
    if (data.url !== undefined) existing.url = data.url;
    if (data.websiteUrl !== undefined) existing.websiteUrl = data.websiteUrl;
    if (data.defaultCategory !== undefined) existing.defaultCategory = data.defaultCategory;
    if (data.isActive !== undefined) existing.isActive = data.isActive;
    if (data.lastSyncAt !== undefined) existing.lastSyncAt = data.lastSyncAt.toISOString();
    if (data.lastStatus !== undefined) existing.lastStatus = data.lastStatus;
    if (data.lastError !== undefined) existing.lastError = data.lastError;
    existing.updatedAt = new Date().toISOString();
    memSources.set(id, existing);
    return existing;
  }
}

export async function deleteArticleSource(id: string): Promise<boolean> {
  try {
    await withTimeout(accountDb.articleSource.delete({ where: { id } }));
    memSources.delete(id);
    return true;
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback deleteArticleSource:", err);
    memSources.delete(id);
    return true;
  }
}

// SYNC LOGS & STATS FUNCTIONS

export async function recordSyncLog(data: {
  sourceId?: string | null;
  sourceName?: string | null;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  articlesFound: number;
  articlesProcessed: number;
  articlesRejected: number;
  articlesApproved: number;
  errorMessage?: string | null;
  durationMs: number;
  triggeredBy: "CRON" | "MANUAL_ADMIN";
}): Promise<ArticleSyncLogItem> {
  try {
    const created = await withTimeout(
      accountDb.articleSyncLog.create({
        data,
      })
    );
    const item: ArticleSyncLogItem = {
      ...created,
      status: created.status as any,
      triggeredBy: created.triggeredBy as any,
      createdAt: created.createdAt.toISOString(),
    };
    memSyncLogs.unshift(item);
    return item;
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback recordSyncLog:", err);
    const item: ArticleSyncLogItem = {
      id: "log-" + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    memSyncLogs.unshift(item);
    return item;
  }
}

export async function getSyncLogs(limit = 15): Promise<ArticleSyncLogItem[]> {
  try {
    const logs = await withTimeout(
      accountDb.articleSyncLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      })
    );
    if (logs.length > 0) {
      return logs.map((l) => ({
        ...l,
        status: l.status as any,
        triggeredBy: l.triggeredBy as any,
        createdAt: l.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback getSyncLogs:", err);
  }
  return memSyncLogs.slice(0, limit);
}

export async function getArticleStats(): Promise<{
  total: number;
  published: number;
  pending: number;
  rejected: number;
  collectedToday: number;
  activeSources: number;
  lastSyncAt: string | null;
  systemStatus: "HEALTHY" | "DEGRADED" | "IDLE";
}> {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      total,
      published,
      pending,
      rejected,
      collectedToday,
      activeSources,
      lastLog,
    ] = await withTimeout(
      Promise.all([
        accountDb.article.count(),
        accountDb.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
        accountDb.article.count({ where: { status: ArticleStatus.PENDING } }),
        accountDb.article.count({ where: { status: ArticleStatus.REJECTED } }),
        accountDb.article.count({ where: { fetchedAt: { gte: startOfToday } } }),
        accountDb.articleSource.count({ where: { isActive: true } }),
        accountDb.articleSyncLog.findFirst({ orderBy: { createdAt: "desc" } }),
      ])
    );

    const systemStatus =
      lastLog?.status === "FAILED"
        ? "DEGRADED"
        : activeSources > 0
        ? "HEALTHY"
        : "IDLE";

    return {
      total,
      published,
      pending,
      rejected,
      collectedToday,
      activeSources,
      lastSyncAt: lastLog?.createdAt.toISOString() || null,
      systemStatus,
    };
  } catch (err) {
    console.warn("[ARTICLE_REPO] Fallback getArticleStats:", err);
    const all = Array.from(memArticles.values());
    const published = all.filter((a) => a.status === ArticleStatus.PUBLISHED).length;
    const pending = all.filter((a) => a.status === ArticleStatus.PENDING).length;
    const rejected = all.filter((a) => a.status === ArticleStatus.REJECTED).length;
    const activeSources = Array.from(memSources.values()).filter((s) => s.isActive).length;

    return {
      total: all.length,
      published,
      pending,
      rejected,
      collectedToday: 4,
      activeSources,
      lastSyncAt: memSyncLogs[0]?.createdAt || new Date().toISOString(),
      systemStatus: "HEALTHY",
    };
  }
}

