import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { companionRepo } from "@/backend/db/companionRepo";
import { checkMessageQuota, incrementMessageQuota } from "@/backend/ai/quota";
import { generateCompanionResponse, ChatMessageContext } from "@/backend/ai/aiProvider";
import { detectRisk } from "@/lib/crisisDetection";
import { PersonaId } from "@/backend/ai/personas";

export const dynamic = "force-dynamic";

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

    const body = await req.json();
    const { content, persona = "KINA", modelPreference } = body;
    let conversationId = body.conversationId;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });
    }

    const trimmedContent = content.trim();

    // 1. PENEGAKAN KUOTA HARIAN (Server-Side Enforcement - 20 Pesan/Hari)
    const quota = await checkMessageQuota(session.userId);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message: "Kuota curhat harianmu (20 pesan) telah habis untuk hari ini. Beristirahatlah sejenak dan kembali esok hari ya.",
          quota,
        },
        { status: 403 }
      );
    }

    // 2. DETEKSI RISIKO KRISIS KESEHATAN MENTAL (AGENTS.md Bagian 8)
    const risk = detectRisk(trimmedContent);

    // 3. Pastikan Percakapan Ada atau Buat Otomatis
    if (!conversationId || conversationId === "new") {
      const generatedTitle =
        trimmedContent.length > 35
          ? `${trimmedContent.slice(0, 32)}...`
          : trimmedContent;

      const newConv = await companionRepo.createConversation(
        session.userId,
        generatedTitle,
        risk.flagged ? "CRISIS" : null
      );
      conversationId = newConv.id;
    }

    // 4. Catat pesan user
    await companionRepo.addMessage({
      conversationId,
      userId: session.userId,
      role: "user",
      content: trimmedContent,
      flaggedForRisk: risk.flagged,
    });

    // 5. Susun konteks percakapan sebelumnya
    const recentMessages = await companionRepo.getRecentMessages(conversationId, 6);
    const context: ChatMessageContext[] = recentMessages.map((m) => ({
      role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
      content: m.content || "",
    }));

    // 6. Jalankan AI Multi-Provider Chained Fallback
    const personaKey = (persona as PersonaId) || "KINA";
    const aiResponse = await generateCompanionResponse(
      personaKey,
      context,
      modelPreference
    );

    // 7. Simpan respons asisten
    const assistantMessage = await companionRepo.addMessage({
      conversationId,
      userId: session.userId,
      role: "assistant",
      content: aiResponse.content,
      modelUsed: aiResponse.modelUsed,
      flaggedForRisk: risk.flagged,
    });

    // 8. Naikkan kuota harian
    const newCount = await incrementMessageQuota(session.userId);
    const remaining = Math.max(0, 20 - newCount);

    return NextResponse.json({
      conversationId,
      message: assistantMessage,
      remainingQuota: remaining,
      maxQuota: 20,
      flaggedForRisk: risk.flagged,
    });
  } catch (error: any) {
    console.error("Gagal memproses pesan curhat:", error);
    return NextResponse.json(
      { error: "Gagal memproses respons AI", details: error.message },
      { status: 500 }
    );
  }
}
