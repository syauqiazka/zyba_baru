import { accountDb } from "../src/backend/db/accountClient";
import { ArticleCategory, ArticleStatus } from "../src/generated/account-client";
import { SEED_RESOURCES } from "../src/backend/db/resourceRepo";

function cleanHtmlToText(html: string): string {
  if (!html) return "";

  let text = html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&bull;/g, "•")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—");

  text = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "• ");

  text = text.replace(/<[^>]+>/g, "");

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/[ \t]+/g, " ").trim())
    .filter((p) => p.length > 0);

  return paragraphs.join("\n\n");
}

async function run() {
  console.log("--- 1. Membersihkan artikel yang ada di database ---");
  const existingArticles = await accountDb.article.findMany();
  for (const art of existingArticles) {
    const cleanedTitle = cleanHtmlToText(art.title);
    const cleanedExcerpt = cleanHtmlToText(art.excerpt);
    const cleanedContent = art.content ? cleanHtmlToText(art.content) : null;

    await accountDb.article.update({
      where: { id: art.id },
      data: {
        title: cleanedTitle,
        excerpt: cleanedExcerpt,
        content: cleanedContent,
      },
    });
    console.log(`Updated article ${art.id}: "${cleanedTitle.slice(0, 40)}..."`);
  }

  console.log("\n--- 2. Upsert 6 Artikel Kurasi Inti ke Database Neon ---");
  for (let i = 0; i < SEED_RESOURCES.length; i++) {
    const r = SEED_RESOURCES[i];
    let cat: ArticleCategory = ArticleCategory.MENTAL_HEALTH;
    if (r.category === "stres") cat = ArticleCategory.EMOTIONAL_WELLNESS;
    else if (r.category === "tidur") cat = ArticleCategory.SLEEP_AND_REST;
    else if (r.category === "sosial") cat = ArticleCategory.RELATIONSHIPS;
    else if (r.category === "mindful") cat = ArticleCategory.MINDFULNESS;

    await accountDb.article.upsert({
      where: { canonicalUrl: "https://zyba.my.id/resources/" + r.id },
      create: {
        id: r.id,
        sourceName: "Tim Kurasi ZYBA Sanctuary",
        sourceUrl: "https://zyba.my.id/resources/" + r.id,
        canonicalUrl: "https://zyba.my.id/resources/" + r.id,
        externalId: "seed-" + r.id,
        title: r.title,
        slug: r.id,
        excerpt: r.snippet,
        content: r.body,
        category: cat,
        thumbnail: r.imageUrl,
        publishedAt: new Date(Date.now() - i * 86400000),
        status: ArticleStatus.PUBLISHED,
        relevanceScore: 99,
        relevanceReason: "Kurasi asli resmi tim psikolog ZYBA",
        language: "id",
        readingTime: r.readTimeMin,
      },
      update: {
        title: r.title,
        excerpt: r.snippet,
        content: r.body,
        status: ArticleStatus.PUBLISHED,
      },
    });
    console.log(`Upserted seed article: ${r.id} - ${r.title.slice(0, 30)}...`);
  }

  const finalCount = await accountDb.article.count();
  console.log(`\nSelesai! Total artikel di database Neon sekarang: ${finalCount}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
