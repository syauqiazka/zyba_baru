import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { createAblyTokenRequest } from "@/backend/realtime/ablyServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: "Sesi tidak ditemukan. Harap masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Sesi tidak valid atau telah kedaluwarsa." },
        { status: 401 }
      );
    }

    const tokenRequest = await createAblyTokenRequest(session.userId);
    return NextResponse.json(tokenRequest);
  } catch (err: any) {
    console.error("Gagal menghasilkan Ably Token Request:", err);
    return NextResponse.json(
      { error: err.message || "Gagal mengotentikasi sesi realtime." },
      { status: 500 }
    );
  }
}
