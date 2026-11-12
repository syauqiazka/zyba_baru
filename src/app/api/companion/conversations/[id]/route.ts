import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { companionRepo } from "@/backend/db/companionRepo";

export const dynamic = "force-dynamic";

export async function GET(
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

    const { id } = params;
    const conversation = await companionRepo.getConversation(id, session.userId);

    if (!conversation) {
      return NextResponse.json(
        { error: "Percakapan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: conversation.title,
      emotionTag: conversation.emotionTag,
      messages: conversation.messages,
    });
  } catch (error: any) {
    console.error("Gagal memuat detail percakapan:", error);
    return NextResponse.json(
      { error: "Gagal memuat percakapan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { id } = params;
    const deleted = await companionRepo.deleteConversation(id, session.userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Percakapan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Percakapan berhasil dihapus" });
  } catch (error: any) {
    console.error("Gagal menghapus percakapan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus percakapan" },
      { status: 500 }
    );
  }
}
