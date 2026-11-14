import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authCookies";
import { getArticleStats } from "@/backend/db/articleRepo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const stats = await getArticleStats();
    return NextResponse.json({ stats });
  } catch (err: any) {
    console.error("[ADMIN_ARTICLE_STATS_ERROR]", err);
    return NextResponse.json({ error: "Gagal memuat statistik artikel." }, { status: 500 });
  }
}
