import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { settingsRepo } from "@/backend/db/settingsRepo";

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
    const oldPassword = body.oldPassword?.trim();
    const newPassword = body.newPassword?.trim();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Kata sandi lama dan kata sandi baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal 8 karakter" },
        { status: 400 }
      );
    }

    const result = await settingsRepo.changePassword(session.userId, oldPassword, newPassword);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Gagal mengubah kata sandi" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    });
  } catch (err: any) {
    console.error("Gagal mengubah kata sandi:", err);
    return NextResponse.json(
      { error: "Terjadi kendala saat memperbarui kata sandi" },
      { status: 500 }
    );
  }
}
