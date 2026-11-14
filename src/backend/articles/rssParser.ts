/**
 * ZYBA RSS & Atom Feed Parser
 * Dilengkapi proteksi SSRF (Server-Side Request Forgery), sanitasi HTML,
 * dan ekstraksi metadata artikel (judul, tautan, tanggal, ringkasan, thumbnail).
 */

export interface ParsedFeedItem {
  guid: string;
  title: string;
  link: string;
  description: string;
  content?: string;
  pubDate: Date;
  thumbnailUrl?: string;
  author?: string;
}

export interface ParsedFeedResult {
  title: string;
  description?: string;
  link?: string;
  items: ParsedFeedItem[];
}

/**
 * Validasi URL untuk mencegah SSRF (Server-Side Request Forgery)
 * Memastikan URL menggunakan HTTP/HTTPS dan bukan mengarah ke localhost atau IP privat
 */
export function validateSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    // Blokir localhost dan loopback
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "0.0.0.0"
    ) {
      return false;
    }

    // Blokir rentang IP privat (RFC 1918 & link-local)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const octet1 = parseInt(ipMatch[1], 10);
      const octet2 = parseInt(ipMatch[2], 10);

      // 10.0.0.0/8
      if (octet1 === 10) return false;
      // 172.16.0.0/12
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
      // 192.168.0.0/16
      if (octet1 === 192 && octet2 === 168) return false;
      // 169.254.0.0/16 (Link-local)
      if (octet1 === 169 && octet2 === 254) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Membersihkan string HTML menjadi teks bersih tanpa eksekusi skrip
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // 1. Hapus tag script, style, iframe, object beserta isinya
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // 2. Hapus seluruh tag HTML
  clean = clean.replace(/<\/?[^>]+(>|$)/g, " ");

  // 3. Decode entitas HTML umum
  clean = clean
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—");

  // 4. Normalkan spasi berlebih
  return clean.replace(/\s+/g, " ").trim();
}

/**
 * Ekstraksi URL thumbnail dari tag XML (media:content, media:thumbnail, enclosure, img tag)
 */
function extractThumbnail(itemXml: string): string | undefined {
  // 1. media:content url="..."
  const mediaContent = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaContent && mediaContent[1]) return mediaContent[1];

  // 2. media:thumbnail url="..."
  const mediaThumb = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (mediaThumb && mediaThumb[1]) return mediaThumb[1];

  // 3. enclosure type="image/..." url="..."
  const enclosure = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\/[^"']+["']/i) ||
                    itemXml.match(/<enclosure[^>]*type=["']image\/[^"']+["'][^>]+url=["']([^"']+)["']/i);
  if (enclosure && enclosure[1]) return enclosure[1];

  // 4. <img src="..."> dalam description atau content
  const imgTag = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgTag && imgTag[1] && imgTag[1].startsWith("http")) return imgTag[1];

  return undefined;
}

/**
 * Parse teks XML (RSS 2.0 atau Atom) menjadi array item terstruktur
 */
export function parseFeedXml(xml: string): ParsedFeedResult {
  // Deteksi judul feed
  const feedTitleMatch = xml.match(/<channel[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i) ||
                         xml.match(/<feed[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
  const feedTitle = feedTitleMatch ? sanitizeHtml(feedTitleMatch[1]) : "Sumber Feed";

  const isAtom = xml.includes("<entry") || xml.includes("<feed");
  const items: ParsedFeedItem[] = [];

  if (isAtom) {
    // Atom parsing
    const entryRegex = /<entry[\s\S]*?<\/entry>/gi;
    let match: RegExpExecArray | null;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[0];

      const titleMatch = entryXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const title = titleMatch ? sanitizeHtml(titleMatch[1]) : "";

      const linkMatch = entryXml.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']alternate["']/i) ||
                        entryXml.match(/<link[^>]+href=["']([^"']+)["']/i);
      const link = linkMatch ? linkMatch[1] : "";

      const idMatch = entryXml.match(/<id>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/id>/i);
      const guid = idMatch ? idMatch[1].trim() : link;

      const summaryMatch = entryXml.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i) ||
                           entryXml.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/i);
      const description = summaryMatch ? sanitizeHtml(summaryMatch[1]) : "";

      const dateMatch = entryXml.match(/<published>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/published>/i) ||
                        entryXml.match(/<updated>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/updated>/i);
      const pubDate = dateMatch && !isNaN(Date.parse(dateMatch[1])) ? new Date(dateMatch[1]) : new Date();

      const thumbnail = extractThumbnail(entryXml);

      if (title && link) {
        items.push({
          guid,
          title,
          link,
          description,
          pubDate,
          thumbnailUrl: thumbnail,
        });
      }
    }
  } else {
    // RSS 2.0 parsing
    const itemRegex = /<item[\s\S]*?<\/item>/gi;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[0];

      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const title = titleMatch ? sanitizeHtml(titleMatch[1]) : "";

      const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      const link = linkMatch ? linkMatch[1].trim() : "";

      const guidMatch = itemXml.match(/<guid[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/guid>/i);
      const guid = guidMatch ? guidMatch[1].trim() : link;

      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const contentMatch = itemXml.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i);

      const description = descMatch ? sanitizeHtml(descMatch[1]) : "";
      const content = contentMatch ? sanitizeHtml(contentMatch[1]) : undefined;

      const dateMatch = itemXml.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i) ||
                        itemXml.match(/<dc:date>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:date>/i);
      const pubDate = dateMatch && !isNaN(Date.parse(dateMatch[1])) ? new Date(dateMatch[1]) : new Date();

      const thumbnail = extractThumbnail(itemXml);

      if (title && (link || guid)) {
        items.push({
          guid,
          title,
          link: link || guid,
          description,
          content,
          pubDate,
          thumbnailUrl: thumbnail,
        });
      }
    }
  }

  return {
    title: feedTitle,
    items,
  };
}

/**
 * Fetch and parse RSS feed with timeout and safety validation
 */
export async function fetchAndParseFeed(
  feedUrl: string,
  timeoutMs = 8000
): Promise<ParsedFeedResult> {
  if (!validateSafeUrl(feedUrl)) {
    throw new Error(`URL feed ditolak karena tidak memenuhi kriteria keamanan: ${feedUrl}`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ZybaWellnessBot/2.0 (+https://zyba.my.id/bot; health-aggregator)",
        Accept: "application/rss+xml, application/atom+xml, text/xml, application/xml, text/plain",
      },
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil RSS feed (${res.status} ${res.statusText})`);
    }

    const xml = await res.text();
    return parseFeedXml(xml);
  } finally {
    clearTimeout(timer);
  }
}
