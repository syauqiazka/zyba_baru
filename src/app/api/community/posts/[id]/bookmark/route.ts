import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { communityRepo } from "@/backend/db/communityRepo";

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
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const postId = params.id;
    const result = await communityRepo.toggleBookmark(postId, session.userId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Gagal menyimpan postingan:", error);
    return NextResponse.json(
      { error: "Gagal memproses simpan postingan" },
      { status: 500 }
    );
  }
}

