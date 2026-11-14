import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { communityRepo } from "@/backend/db/communityRepo";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const comments = await communityRepo.listComments(postId);
    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error("Gagal memuat komentar:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar komentar" },
      { status: 500 }
    );
  }
}

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
    const body = await req.json().catch(() => ({}));
    const { content, isAnonymous } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Isi komentar tidak boleh kosong" },
        { status: 400 }
      );
    }

    const newComment = await communityRepo.createComment({
      postId,
      userId: session.userId,
      userName: session.name || "Teman ZYBA",
      content: content.slice(0, 1000),
      isAnonymous: Boolean(isAnonymous),
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error: any) {
    console.error("Gagal menambahkan komentar:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan komentar" },
      { status: 500 }
    );
  }
}

