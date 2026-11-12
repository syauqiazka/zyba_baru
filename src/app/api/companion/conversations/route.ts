import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { companionDb } from "@/backend/db/companionClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const conversations = await companionDb.conversation.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            role: true,
          },
        },
      },
    });

    const formatted = conversations.map((c) => ({
      id: c.id,
      title: c.title,
      emotionTag: c.emotionTag,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      lastMessage: c.messages[0]?.content || null,
      lastMessageAt: c.messages[0]?.createdAt.toISOString() || c.updatedAt.toISOString(),
    }));

    return NextResponse.json({ conversations: formatted });
  } catch (error: any) {
    console.error("Gagal mengambil riwayat percakapan:", error);
    return NextResponse.json(
      { error: "Gagal memuat percakapan" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" && body.title.trim()
      ? body.title.trim().slice(0, 60)
      : "Ruang Curhat Baru";
    const emotionTag = typeof body.emotionTag === "string" ? body.emotionTag : null;

    const newConv = await companionDb.conversation.create({
      data: {
        userId: session.userId,
        title,
        emotionTag,
      },
    });

    return NextResponse.json(
      { conversationId: newConv.id, title: newConv.title },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gagal membuat percakapan baru:", error);
    return NextResponse.json(
      { error: "Gagal membuat percakapan" },
      { status: 500 }
    );
  }
}
