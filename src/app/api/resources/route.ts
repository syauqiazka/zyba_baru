import { NextResponse } from "next/server";
import { getArticles } from "@/backend/db/articleRepo";
import { SEED_RESOURCES, RELAXATION_AUDIO_TRACKS } from "@/backend/db/resourceRepo";
import { ArticleCategory, ArticleStatus } from "@/generated/account-client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search")?.toLowerCase().trim();

    // 1. Ambil artikel terbitan dari PostgreSQL (accountDb)
    const { articles: dbArticles } = await getArticles({
      status: ArticleStatus.PUBLISHED,
      category:
        categoryParam && categoryParam !== "all"
          ? (categoryParam.toUpperCase() as ArticleCategory)
          : "ALL",
      search: searchParam,
      limit: 60,
      includeSeed: false,
    });

    // 2. Format artikel DB agar serasi dengan antarmuka Resources
    const mappedDbArticles = dbArticles.map((a) => {
      // Map kategori ke label
      const catLabels: Record<string, string> = {
        MENTAL_HEALTH: "Mental Health",
        EMOTIONAL_WELLNESS: "Emotional Wellness",
        MINDFULNESS: "Mindfulness",
        SELF_CARE: "Self Care",
        SLEEP_AND_REST: "Kualitas Tidur",
        PHYSICAL_WELLNESS: "Kebugaran Fisik",
        RELATIONSHIPS: "Hubungan Sosial",
        PERSONAL_DEVELOPMENT: "Pengembangan Diri",
      };

      return {
        id: a.id,
        type: "ARTICLE" as const,
        title: a.title,
        subtitle: a.relevanceReason || "Artikel pilihan terverifikasi",
        category: a.category,
        categoryLabel: catLabels[a.category] || a.category,
        author: a.sourceName,
        authorRole: "Penerbit Terpercaya",
        readTimeMin: a.readingTime || 3,
        publishedAt: new Date(a.publishedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        imageUrl: a.thumbnail || "/images/resources/res-1-lifestyle.svg",
        snippet: a.excerpt,
        body: a.content || a.excerpt,
        sourceUrl: a.sourceUrl,
        canonicalUrl: a.canonicalUrl,
        tags: [catLabels[a.category] || "Kesehatan", a.sourceName],
      };
    });

    // 3. Fallback Seed Resources
    let seedList = SEED_RESOURCES.map((s) => {
      let cat = "MENTAL_HEALTH";
      if (s.category === "stres") cat = "EMOTIONAL_WELLNESS";
      else if (s.category === "tidur") cat = "SLEEP_AND_REST";
      else if (s.category === "sosial") cat = "RELATIONSHIPS";
      else if (s.category === "mindful") cat = "MINDFULNESS";

      return {
        ...s,
        category: cat,
        canonicalUrl: "https://zyba.my.id/resources/" + s.id,
        sourceUrl: "https://zyba.my.id/resources/" + s.id,
      };
    });

    if (categoryParam && categoryParam !== "all") {
      seedList = seedList.filter(
        (s) => s.category.toUpperCase() === categoryParam.toUpperCase()
      );
    }

    if (searchParam) {
      seedList = seedList.filter(
        (s) =>
          s.title.toLowerCase().includes(searchParam) ||
          s.snippet.toLowerCase().includes(searchParam) ||
          s.body.toLowerCase().includes(searchParam)
      );
    }

    // Gabungkan: artikel DB terbitan terbaru di atas, lalu seed
    const combined = [...mappedDbArticles, ...seedList];

    // Hapus duplikat berdasarkan canonicalUrl atau title jika ada
    const seen = new Set<string>();
    const deduplicated = combined.filter((item) => {
      const key = (item.canonicalUrl || item.title).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({
      articles: deduplicated,
      audioTracks: RELAXATION_AUDIO_TRACKS,
    });
  } catch (err: any) {
    console.error("Gagal memuat artikel wawasan:", err);
    return NextResponse.json(
      { error: "Gagal memuat sumber wawasan" },
      { status: 500 }
    );
  }
}
