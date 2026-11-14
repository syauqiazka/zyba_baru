import { accountDb } from "../src/backend/db/accountClient";
import { ArticleCategory } from "../src/generated/account-client";

const INITIAL_SOURCES = [
  {
    name: "Kemenkes RI Sehat Negeriku",
    url: "https://sehatnegeriku.kemkes.go.id/feed/",
    websiteUrl: "https://sehatnegeriku.kemkes.go.id",
    defaultCategory: ArticleCategory.PHYSICAL_WELLNESS,
  },
  {
    name: "World Health Organization (WHO) News",
    url: "https://www.who.int/rss-feeds/news-english.xml",
    websiteUrl: "https://www.who.int",
    defaultCategory: ArticleCategory.MENTAL_HEALTH,
  },
  {
    name: "American Psychological Association (APA)",
    url: "https://www.apa.org/news/press/releases.rss",
    websiteUrl: "https://www.apa.org",
    defaultCategory: ArticleCategory.EMOTIONAL_WELLNESS,
  },
  {
    name: "NHS UK Health & Wellbeing",
    url: "https://www.nhs.uk/conditions/stress-anxiety-depression/rss.xml",
    websiteUrl: "https://www.nhs.uk",
    defaultCategory: ArticleCategory.MENTAL_HEALTH,
  },
  {
    name: "Psychology Today - Mental Health Feed",
    url: "https://www.psychologytoday.com/intl/blog/feed",
    websiteUrl: "https://www.psychologytoday.com",
    defaultCategory: ArticleCategory.MINDFULNESS,
  },
];

async function main() {
  console.log("=== SEEDING ARTICLE RSS SOURCES ===");
  for (const src of INITIAL_SOURCES) {
    try {
      const existing = await accountDb.articleSource.findUnique({
        where: { url: src.url },
      });

      if (!existing) {
        const created = await accountDb.articleSource.create({
          data: {
            name: src.name,
            url: src.url,
            websiteUrl: src.websiteUrl,
            defaultCategory: src.defaultCategory,
            isActive: true,
          },
        });
        console.log(`[OK] Sumber ditambahkan: ${created.name} (${created.id})`);
      } else {
        console.log(`[SKIP] Sumber sudah ada: ${src.name}`);
      }
    } catch (err: any) {
      console.warn(`[WARN] Gagal menyemai ${src.name}:`, err.message || err);
    }
  }
  console.log("=== SEEDING SELESAI ===");
  await accountDb.$disconnect();
}

main().catch((err) => {
  console.error("Gagal menjalankan seeding sumber:", err);
  process.exit(1);
});
