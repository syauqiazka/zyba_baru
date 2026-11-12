import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { companionDb } from "@/backend/db/companionClient";

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

    const conversation = await companionDb.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 100,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Percakapan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Pastikan percakapan milik user yang sedang login
    if (conversation.userId !== session.userId) {
      return NextResponse.json(
        { error: "Akses tidak diizinkan" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        emotionTag: conversation.emotionTag,
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
        messages: conversation.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          modelUsed: m.modelUsed,
          attachmentType: m.attachmentType,
          attachmentUrl: m.attachmentUrl,
          audioDurationSec: m.audioDurationSec,
          flaggedForRisk: m.flaggedForRisk,
          ttsAudioUrl: m.ttsAudioUrl,
          createdAt: m.createdAt.toISOString(),
        })),
      },
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

    const conversation = await companionDb.conversation.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Percakapan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (conversation.userId !== session.userId) {
      return NextResponse.json(
        { error: "Akses tidak diizinkan" },
        { status: 403 }
      );
    }

    await companionDb.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Gagal menghapus percakapan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus percakapan" },
      { status: 500 }
    );
  }
}
