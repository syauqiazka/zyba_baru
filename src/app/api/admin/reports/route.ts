import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { adminRepo } from "@/backend/db/adminRepo";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const targetType = searchParams.get("targetType") || "ALL";
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const reports = await adminRepo.listReports({ status, targetType, limit });

    return NextResponse.json({ reports });
  } catch (err: any) {
    console.error("Gagal mengambil daftar laporan admin:", err);
    return NextResponse.json(
      { error: "Gagal mengambil daftar laporan komunitas" },
      { status: 500 }
    );
  }
}
