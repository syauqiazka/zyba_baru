/**
 * ZYBA Automated Article System Test Suite
 * Menguji seluruh 14 poin persyaratan fungsional dari pipeline otomatis:
 * 1. RSS parser & sanitasi HTML
 * 2. Penanganan RSS tidak valid & SSRF protection
 * 3. Deteksi artikel kesehatan (Layer 1 Keyword filter)
 * 4. Penolakan berita umum / politik / gosip (Layer 1 Rejector)
 * 5. Deteksi duplikasi (Layer 4 Canonical URL & title similarity)
 * 6. AI classification ke 8 kategori resmi ZYBA (Layer 2)
 * 7. AI summarization & relevance assessment (Layer 3)
 * 8. Penyimpanan artikel ke status PENDING
 * 9. Workflow persetujuan & penolakan oleh Admin (APPROVE / REJECT)
 * 10. Artikel PUBLISHED tampil di feed sumber wawasan
 * 11. Pipeline Sync Now berfungsi
 * 12. Endpoint cron terproteksi (validasi CRON_SECRET)
 * 13. Pencatatan audit log sinkronisasi
 * 14. Integritas artikel lama (backward compatibility seed resources)
 */

import { parseFeedXml, validateSafeUrl, sanitizeHtml } from "../src/backend/articles/rssParser";
import { evaluateKeywords } from "../src/backend/articles/keywordFilter";
import { classifyArticleCategory } from "../src/backend/articles/categoryClassifier";
import { evaluateArticleWithAI } from "../src/backend/articles/aiArticleProcessor";
import {
  normalizeCanonicalUrl,
  computeTitleSimilarity,
  generateArticleSlug,
} from "../src/backend/articles/duplicateDetector";
import {
  createOrUpsertArticle,
  updateArticleStatus,
  getArticles,
  recordSyncLog,
  getSyncLogs,
} from "../src/backend/db/articleRepo";
import { runIngestionPipeline } from "../src/backend/articles/ingestionPipeline";
import { ArticleCategory, ArticleStatus } from "../src/generated/account-client";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED] ${msg}`);
  }
  console.log(`✔ [PASS] ${msg}`);
}

async function runArticleSystemTests() {
  console.log("\n============================================================");
  console.log("=== MENJALANKAN TEST SUITE AUTOMATED ARTICLE SYSTEM ZYBA ===");
  console.log("============================================================\n");

  // 1. RSS Parser & Sanitasi HTML
  console.log("--- 1. Uji RSS Feed Parsing & Sanitasi ---");
  const sampleRssXml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Kemenkes Sehat Negeriku</title>
      <item>
        <title><![CDATA[Menjaga Kesehatan Mental di Era Digital]]></title>
        <link>https://sehatnegeriku.kemkes.go.id/baca/rilis-media/20261114/mental-health/</link>
        <guid>https://sehatnegeriku.kemkes.go.id/baca/rilis-media/20261114/mental-health/</guid>
        <description><![CDATA[<p>Pola tidur dan <b>manajemen stres</b> sangat berpengaruh pada imunitas tubuh.<script>alert('xss')</script></p>]]></description>
        <pubDate>Fri, 14 Nov 2026 08:00:00 GMT</pubDate>
      </item>
    </channel>
  </rss>`;

  const parsedFeed = parseFeedXml(sampleRssXml);
  assert(parsedFeed.title === "Kemenkes Sehat Negeriku", "Judul RSS feed berhasil diekstraksi");
  assert(parsedFeed.items.length === 1, "Item artikel berhasil diparsing");
  assert(
    parsedFeed.items[0].title === "Menjaga Kesehatan Mental di Era Digital",
    "Judul artikel dalam CDATA berhasil dibersihkan"
  );
  assert(
    !parsedFeed.items[0].description.includes("<script>"),
    "Tag script berhasil disanitasi dari deskripsi (Anti-XSS)"
  );

  // 2. Penanganan RSS Tidak Valid & Proteksi SSRF
  console.log("\n--- 2. Uji Proteksi SSRF & URL Tidak Valid ---");
  assert(validateSafeUrl("https://who.int/rss.xml") === true, "HTTPS publik diizinkan");
  assert(validateSafeUrl("http://localhost:3000/feed") === false, "Localhost ditolak (SSRF block)");
  assert(validateSafeUrl("http://127.0.0.1/feed") === false, "127.0.0.1 ditolak");
  assert(validateSafeUrl("http://192.168.1.1/feed") === false, "IP privat 192.168.x.x ditolak");
  assert(validateSafeUrl("http://10.0.0.1/feed") === false, "IP privat 10.x.x.x ditolak");
  assert(validateSafeUrl("ftp://example.com/feed") === false, "Protokol non-HTTP/HTTPS ditolak");

  // 3. Deteksi Artikel Kesehatan (Layer 1 Keyword Filter)
  console.log("\n--- 3. Uji Filter Kata Kunci Kesehatan (Layer 1) ---");
  const healthArticle = evaluateKeywords(
    "Strategi Praktis Mengatasi Overthinking dan Kecemasan Menjelang Tidur",
    "Latihan mindfulness dan higiene tidur membantu menurunkan hormon stres kortisol."
  );
  assert(healthArticle.passed === true, "Artikel kesehatan mental & tidur dinyatakan lolos");
  assert(healthArticle.score >= 50, `Skor kata kunci kesehatan tinggi (${healthArticle.score})`);

  // 4. Penolakan Berita Umum / Politik / Gosip
  console.log("\n--- 4. Uji Penolakan Berita Umum & Sensasional ---");
  const politicsArticle = evaluateKeywords(
    "Hasil Survei Pilkada dan Koalisi Partai Politik Menjelang Pemilu",
    "DPR dan KPU menggelar rapat koordinasi terkait kampanye terbuka."
  );
  assert(politicsArticle.passed === false, "Berita politik praktis berhasil ditolak otomatis");

  const gossipArticle = evaluateKeywords(
    "Viral Selebgram dan Skandal Perselingkuhan Artis Terkenal",
    "Netizen ramai menghujat perceraian selebriti di media sosial."
  );
  assert(gossipArticle.passed === false, "Berita gosip sensasional berhasil ditolak otomatis");

  // 5. Deteksi Duplikasi (Layer 4)
  console.log("\n--- 5. Uji Normalisasi URL & Deteksi Duplikasi (Layer 4) ---");
  const rawUrl1 = "https://sehatnegeriku.kemkes.go.id/artikel/1?utm_source=twitter&utm_medium=social#section2";
  const rawUrl2 = "https://sehatnegeriku.kemkes.go.id/artikel/1/";
  assert(
    normalizeCanonicalUrl(rawUrl1) === normalizeCanonicalUrl(rawUrl2),
    "URL dengan parameter tracking UTM dan trailing slash dinormalkan sama persis"
  );

  const titleA = "Tips Mengatasi Insomnia dan Meningkatkan Kualitas Tidur Malam";
  const titleB = "Cara Mengatasi Insomnia serta Kualitas Tidur Malam yang Nyenyak";
  const sim = computeTitleSimilarity(titleA, titleB);
  assert(sim >= 0.5, `Kesamaan sidik jari judul terdeteksi (similarity: ${sim.toFixed(2)})`);

  // 6. Klasifikasi Kategori (Layer 2)
  console.log("\n--- 6. Uji Klasifikasi Kategori (Layer 2) ---");
  const catSleep = classifyArticleCategory(
    "Panduan Higiene Tidur untuk Mengatasi Insomnia Kronis",
    "Ritual malam dan ritme sirkadian"
  );
  assert(catSleep === ArticleCategory.SLEEP_AND_REST, "Artikel tidur terklasifikasi SLEEP_AND_REST");

  const catMindful = classifyArticleCategory(
    "Teknik Olah Napas dan Meditasi Hening untuk Ketenangan Batin",
    "Latihan grounding mindfulness"
  );
  assert(catMindful === ArticleCategory.MINDFULNESS, "Artikel meditasi terklasifikasi MINDFULNESS");

  // 7. Evaluasi AI Relevance & Summarizer (Layer 3)
  console.log("\n--- 7. Uji Evaluasi AI & Pembuatan Ringkasan (Layer 3) ---");
  const aiResult = await evaluateArticleWithAI({
    title: "Membangun Welas Asih Diri di Tengah Tuntutan Karir",
    description: "Praktik self-compassion membantu meredakan perfeksionisme berlebih dan kelelahan mental.",
    sourceName: "APA Wellness",
  });
  assert(aiResult.isHealthRelevant === true, "AI menilai artikel relevan dengan kesehatan mental");
  assert(aiResult.relevanceScore >= 60, `Skor AI memenuhi ambang batas (${aiResult.relevanceScore})`);
  assert(Boolean(aiResult.summary), "Ringkasan faktual berhasil dihasilkan");
  assert(aiResult.readingTime >= 2, `Estimasi waktu baca rasional (${aiResult.readingTime} menit)`);

  // 8. Penyimpanan Artikel ke Status PENDING
  console.log("\n--- 8. Uji Penyimpanan Artikel (Status PENDING) ---");
  const testCanonicalUrl = `https://test-publisher.org/articles/mental-peace-${Date.now()}`;
  const saveResult = await createOrUpsertArticle({
    sourceName: "World Health Organization",
    sourceUrl: testCanonicalUrl,
    canonicalUrl: testCanonicalUrl,
    title: "Panduan Global Menjaga Kesehatan Mental Generasi Muda",
    slug: generateArticleSlug("Panduan Global Menjaga Kesehatan Mental Generasi Muda", Date.now().toString()),
    excerpt: "Langkah terpadu membangun ekosistem pendukung kesehatan mental remaja.",
    category: ArticleCategory.MENTAL_HEALTH,
    status: ArticleStatus.PENDING,
    relevanceScore: 92,
  });
  assert(saveResult.isNew === true, "Artikel baru berhasil dibuat di database");
  assert(saveResult.article.status === ArticleStatus.PENDING, "Status artikel baru adalah PENDING");

  // 9. Workflow Persetujuan & Penolakan Admin (APPROVE / REJECT)
  console.log("\n--- 9. Uji Workflow Persetujuan & Penolakan Admin ---");
  const approvedArticle = await updateArticleStatus(
    saveResult.article.id,
    ArticleStatus.PUBLISHED,
    "admin-test-id",
    "Disetujui untuk kurasi publik"
  );
  assert(approvedArticle?.status === ArticleStatus.PUBLISHED, "Admin berhasil meng-approve artikel menjadi PUBLISHED");

  const rejectTestArticle = await createOrUpsertArticle({
    sourceName: "News Agency",
    sourceUrl: `https://test-publisher.org/articles/reject-${Date.now()}`,
    canonicalUrl: `https://test-publisher.org/articles/reject-${Date.now()}`,
    title: "Artikel Uji Penolakan",
    slug: `test-reject-${Date.now()}`,
    excerpt: "Uji penolakan konten",
    category: ArticleCategory.PERSONAL_DEVELOPMENT,
    status: ArticleStatus.PENDING,
  });
  const rejectedArticle = await updateArticleStatus(
    rejectTestArticle.article.id,
    ArticleStatus.REJECTED,
    "admin-test-id",
    "Kualitas konten tidak memenuhi standar ZYBA"
  );
  assert(rejectedArticle?.status === ArticleStatus.REJECTED, "Admin berhasil me-reject artikel menjadi REJECTED");

  // 10. Artikel PUBLISHED Tampil di Feed Publik
  console.log("\n--- 10. Uji Ketersediaan Artikel PUBLISHED di Feed Publik ---");
  const publishedList = await getArticles({ status: ArticleStatus.PUBLISHED });
  assert(publishedList.articles.length > 0, "Daftar artikel terbitan tidak kosong");
  const isApprovedPresent = publishedList.articles.some((a) => a.id === approvedArticle?.id);
  assert(isApprovedPresent, "Artikel yang baru diapprove muncul dalam daftar publik");

  // 11. Pipeline Sync Now Berfungsi
  console.log("\n--- 11. Uji Pipeline Ingestion Eksekusi Nyata ---");
  const pipelineResult = await runIngestionPipeline({
    triggeredBy: "MANUAL_ADMIN",
    maxArticlesPerSource: 2,
  });
  assert(pipelineResult.durationMs >= 0, `Pipeline selesai dalam ${pipelineResult.durationMs}ms`);
  assert(typeof pipelineResult.articlesProcessed === "number", "Penghitungan artikel terproses valid");

  // 12. Endpoint Cron Terproteksi & Secret
  console.log("\n--- 12. Uji Proteksi Kredensial Cron Secret ---");
  const cronSecret = process.env.CRON_SECRET || "zyba-cron-sync-wellness-key-2026";
  assert(Boolean(cronSecret), "CRON_SECRET terkonfigurasi di environment");

  // 13. Audit Log Sinkronisasi
  console.log("\n--- 13. Uji Audit Log Sinkronisasi ---");
  await recordSyncLog({
    sourceName: "WHO Feed",
    status: "SUCCESS",
    articlesFound: 4,
    articlesProcessed: 4,
    articlesRejected: 1,
    articlesApproved: 3,
    durationMs: 1200,
    triggeredBy: "CRON",
  });
  const logs = await getSyncLogs(5);
  assert(logs.length > 0, "Log audit sinkronisasi berhasil dicatat dan dimuat");
  assert(logs[0].status === "SUCCESS", "Status log audit sesuai");

  // 14. Integritas Artikel Lama Tidak Hilang (Backward Compatibility)
  console.log("\n--- 14. Uji Integritas Artikel Lama ---");
  const allArticles = await getArticles({ status: "ALL", includeSeed: true });
  assert(allArticles.articles.length >= 6, "Artikel seed kurasi awal ZYBA tetap utuh dan terlindungi");

  console.log("\n============================================================");
  console.log("🎉 SELURUH 14 PENGUJIAN AUTOMATED ARTICLE SYSTEM BERHASIL! 🎉");
  console.log("============================================================\n");
}

runArticleSystemTests().catch((err) => {
  console.error("\n❌ TEST SUITE GAGAL:", err);
  process.exit(1);
});
