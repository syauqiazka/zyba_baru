/**
 * ZYBA News API Adapter (Optional News Provider)
 * Menyediakan integrasi sekunder ke penyedia API berita publik jika dikonfigurasi
 * melalui environment variable NEWS_API_KEY.
 * Dapat diganti atau dinonaktifkan tanpa merusak sistem agregasi utama RSS.
 */

import { ParsedFeedItem } from "./rssParser";

export interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function fetchFromNewsApi(
  query = "mental health OR mindfulness OR wellness",
  pageSize = 5
): Promise<ParsedFeedItem[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    // Graceful skip jika tidak dikonfigurasi
    return [];
  }

  try {
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", query);
    url.searchParams.set("language", "en");
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", String(pageSize));
    url.searchParams.set("apiKey", apiKey);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[NEWS_API] Request returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.articles || !Array.isArray(data.articles)) {
      return [];
    }

    return data.articles
      .filter((a: NewsApiArticle) => a.title && a.url)
      .map((a: NewsApiArticle) => ({
        guid: a.url,
        title: a.title,
        link: a.url,
        description: a.description || "",
        content: a.content || undefined,
        pubDate: a.publishedAt ? new Date(a.publishedAt) : new Date(),
        thumbnailUrl: a.urlToImage || undefined,
        author: a.author || a.source.name || "News API",
      }));
  } catch (err) {
    console.warn("[NEWS_API] Gagal mengambil berita eksternal:", err);
    return [];
  }
}
