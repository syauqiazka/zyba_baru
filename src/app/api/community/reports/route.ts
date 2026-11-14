import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { communityRepo } from "@/backend/db/communityRepo";

export async function POST(req: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { targetType, targetId, postId, reportedUserId, reason, details } = body;

    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: "Data laporan tidak lengkap" },
        { status: 400 }
      );
    }

    const report = await communityRepo.createReport({
      reporterId: session.userId,
      targetType: targetType === "COMMENT" ? "COMMENT" : "POST",
      targetId,
      postId,
      reportedUserId,
      reason,
      details,
    });

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error: any) {
    console.error("Gagal mengirim laporan:", error);
    return NextResponse.json(
      { error: "Gagal mengirimkan laporan" },
      { status: 500 }
    );
  }
}

