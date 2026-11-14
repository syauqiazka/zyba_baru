import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authCookies";
import { fetchAndParseFeed, validateSafeUrl } from "@/backend/articles/rssParser";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url || !validateSafeUrl(url)) {
      return NextResponse.json(
        { error: "URL feed tidak valid atau mengarah ke IP internal (SSRF Terproteksi)." },
        { status: 400 }
      );
    }

    const feed = await fetchAndParseFeed(url, 6000);

    return NextResponse.json({
      success: true,
      feedTitle: feed.title,
      itemsCount: feed.items.length,
      sampleItems: feed.items.slice(0, 3).map((it) => ({
        title: it.title,
        link: it.link,
        pubDate: it.pubDate.toISOString(),
        hasThumbnail: Boolean(it.thumbnailUrl),
        snippet: it.description.slice(0, 140),
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: `Pengujian feed gagal: ${err.message || String(err)}`,
      },
      { status: 400 }
    );
  }
}
