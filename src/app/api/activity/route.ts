import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { activityRepo } from "@/backend/db/activityRepo";

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

    const result = await activityRepo.listActivities(session.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Gagal memuat aktivitas:", err);
    return NextResponse.json(
      { error: "Gagal memuat rencana aktivitas" },
      { status: 500 }
    );
  }
}
