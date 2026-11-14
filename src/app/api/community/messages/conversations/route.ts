import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { directMessageRepo } from "@/backend/db/directMessageRepo";

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

    const conversations = await directMessageRepo.listConversations(session.userId);
    return NextResponse.json({ conversations });
  } catch (err: any) {
    console.error("Gagal memuat percakapan:", err);
    return NextResponse.json(
      { error: "Gagal memuat percakapan pesan langsung" },
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
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await req.json();
    const { recipientUserId } = body;
    if (!recipientUserId) {
      return NextResponse.json(
        { error: "Penerima pesan wajib disertakan" },
        { status: 400 }
      );
    }

    const conversationId = await directMessageRepo.getOrCreateConversation(
      session.userId,
      recipientUserId
    );

    return NextResponse.json({ conversationId });
  } catch (err: any) {
    console.error("Gagal membuat percakapan:", err);
    return NextResponse.json(
      { error: "Gagal menginisialisasi percakapan pesan" },
      { status: 500 }
    );
  }
}
