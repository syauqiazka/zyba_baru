import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { companionRepo } from "@/backend/db/companionRepo";
import { checkMessageQuota } from "@/backend/ai/quota";

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

    const conversations = await companionRepo.listConversations(session.userId);
    const quota = await checkMessageQuota(session.userId);

    return NextResponse.json({
      conversations,
      remainingQuota: quota.remaining,
      maxQuota: quota.maxQuota,
    });
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
    let title = typeof body.title === "string" && body.title.trim()
      ? body.title.trim().slice(0, 60)
      : (body.initialMessage && typeof body.initialMessage === "string"
          ? body.initialMessage.slice(0, 35) + "..."
          : "Ruang Curhat Baru");
    const emotionTag = typeof body.emotionTag === "string" ? body.emotionTag : null;

    const newConv = await companionRepo.createConversation(
      session.userId,
      title,
      emotionTag
    );

    // If initialMessage was supplied, store it as the first user message
    if (body.initialMessage && typeof body.initialMessage === "string") {
      await companionRepo.addMessage({
        conversationId: newConv.id,
        userId: session.userId,
        role: "user",
        content: body.initialMessage.trim(),
      });
    }

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
