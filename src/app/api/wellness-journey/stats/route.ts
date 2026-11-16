import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { wellnessRepo } from "@/backend/db/wellnessRepo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const stats = await wellnessRepo.getStats(session.userId);
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err: any) {
    console.error("Gagal memuat statistik wellness:", err);
    return NextResponse.json(
      { error: "Gagal memuat data statistik" },
      { status: 500 }
    );
  }
}
