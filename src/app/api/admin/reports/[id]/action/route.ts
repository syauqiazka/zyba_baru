import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { adminRepo } from "@/backend/db/adminRepo";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses terlarang. Diperlukan hak istimewa administrator." },
        { status: 403 }
      );
    }

    const reportId = params.id;
    const body = await req.json();
    const { action, reason, targetUserId, targetContentId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Tindakan moderasi wajib dipilih" },
        { status: 400 }
      );
    }

    const validActions = [
      "HIDE_POST",
      "DELETE_POST",
      "WARN",
      "SUSPEND",
      "BAN",
      "DISMISS_REPORT",
      "SUPPORT_CRISIS",
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Tindakan '${action}' tidak valid.` },
        { status: 400 }
      );
    }

    const result = await adminRepo.takeAction({
      reportId,
      adminId: session.userId,
      action,
      reason: reason?.trim() || "Tindakan moderasi administratif standar.",
      targetUserId,
      targetContentId,
    });

    return NextResponse.json({
      success: true,
      message: "Tindakan moderasi berhasil diterapkan dan dicatat ke log audit.",
    });
  } catch (err: any) {
    console.error("Gagal menjalankan aksi moderasi:", err);
    return NextResponse.json(
      { error: "Gagal memproses tindakan moderasi" },
      { status: 500 }
    );
  }
}
