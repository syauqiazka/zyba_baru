import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { activityRepo } from "@/backend/db/activityRepo";
import { ActivityType } from "@/generated/account-client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await req.json();
    const type = body.type as ActivityType;
    const durationMin = Number(body.durationMin) || 3;

    if (!type) {
      return NextResponse.json(
        { error: "Tipe aktivitas wajib diisi" },
        { status: 400 }
      );
    }

    const result = await activityRepo.logActivity(session.userId, {
      type,
      durationMin,
      completed: true,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Gagal mencatat log aktivitas:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan progres aktivitas" },
      { status: 500 }
    );
  }
}
