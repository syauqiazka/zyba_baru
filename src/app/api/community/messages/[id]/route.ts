import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { directMessageRepo } from "@/backend/db/directMessageRepo";
import { detectRisk } from "@/lib/crisisDetection";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const conversationId = params.id;
    const messages = await directMessageRepo.listMessages(
      conversationId,
      session.userId
    );

    return NextResponse.json({ messages });
  } catch (err: any) {
    console.error("Gagal memuat pesan:", err);
    return NextResponse.json(
      { error: "Gagal memuat daftar pesan" },
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
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const conversationId = params.id;
    const body = await req.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Crisis safety detection (AGENTS.md Bagian 8)
    const risk = detectRisk(content);
    if (risk.flagged) {
      // Catat risiko tetapi tetap izinkan pengiriman jika non-destruktif
      console.warn(`[DM Risk Safety] User ${session.userId} mengirim pesan berindikasi beban emosional: ${risk.level}`);
    }

    const message = await directMessageRepo.sendMessage(
      conversationId,
      session.userId,
      session.name || "Kamu",
      content
    );

    return NextResponse.json({ message, riskDetected: risk.flagged });
  } catch (err: any) {
    console.error("Gagal mengirim pesan langsung:", err);
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
