import { NextResponse } from "next/server";
import { getAuthTokenFromCookies, removeAuthCookie } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { settingsRepo } from "@/backend/db/settingsRepo";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const password = body.password?.trim();
    const confirmationText = body.confirmationText?.trim();

    if (confirmationText !== "HAPUS") {
      return NextResponse.json(
        { error: "Ketik teks konfirmasi 'HAPUS' dengan tepat untuk melanjutkan" },
        { status: 400 }
      );
    }

    const result = await settingsRepo.deleteAccount(session.userId, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Gagal memproses penghapusan akun" },
        { status: 400 }
      );
    }

    // Bersihkan cookie otentikasi
    removeAuthCookie();

    return NextResponse.json({
      success: true,
      message: "Akun dan seluruh data di ketiga basis data telah dihapus permanen.",
      deletionLogs: result.deletionLogs,
    });
  } catch (err: any) {
    console.error("Gagal menghapus akun:", err);
    return NextResponse.json(
      { error: "Terjadi kendala saat menghapus akun pengguna" },
      { status: 500 }
    );
  }
}
