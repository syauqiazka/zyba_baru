import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { adminRepo } from "@/backend/db/adminRepo";

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

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses terlarang. Diperlukan hak istimewa administrator." },
        { status: 403 }
      );
    }

    const stats = await adminRepo.getStats();

    return NextResponse.json({ stats });
  } catch (err: any) {
    console.error("Gagal memuat statistik admin:", err);
    return NextResponse.json(
      { error: "Gagal memuat statistik laporan admin" },
      { status: 500 }
    );
  }
}
