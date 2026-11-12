import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { companionDb } from "@/backend/db/companionClient";
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

      const newConv = await companionDb.conversation.create({
        data: {
          userId: session.userId,
          title: generatedTitle,
          emotionTag: risk.flagged ? "CRISIS" : null,
        },
      });
      conversationId = newConv.id;
    } else {
      // Pastikan kepemilikan percakapan
      const existing = await companionDb.conversation.findUnique({
        where: { id: conversationId },
        select: { userId: true, title: true },
      });

      if (!existing || existing.userId !== session.userId) {
        return NextResponse.json({ error: "Percakapan tidak ditemukan" }, { status: 404 });
      }

      // Perbarui judul jika masih default
      if (existing.title === "Ruang Curhat Baru" || existing.title === "New Conversation") {
        const updatedTitle =
          trimmedContent.length > 35
            ? `${trimmedContent.slice(0, 32)}...`
            : trimmedContent;
        await companionDb.conversation.update({
          where: { id: conversationId },
          data: { title: updatedTitle },
        });
      }
    }

    // 4. Simpan Pesan Pengguna
    const userMessage = await companionDb.message.create({
      data: {
        conversationId,
        role: "user",
        content: trimmedContent,
        flaggedForRisk: risk.flagged,
      },
    });

    // 5. Ambil Riwayat Percakapan Terakhir untuk Konteks AI (Maksimum 10 pesan terakhir)
    const history = await companionDb.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const contextMessages: ChatMessageContext[] = history
      .reverse()
      .map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: m.content || "",
      }));

    // 6. Panggil Multi-Provider AI Fallback Engine
    const aiResult = await generateCompanionResponse(
      persona as PersonaId,
      contextMessages,
      modelPreference
    );

    // 7. Simpan Balasan Asisten
    const assistantMessage = await companionDb.message.create({
      data: {
        conversationId,
        role: "assistant",
        content: aiResult.content,
        modelUsed: `${aiResult.provider}:${aiResult.modelUsed}`,
      },
    });

    // 8. Update Waktu Percakapan & Naikkan Kuota
    await companionDb.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    const newCount = await incrementMessageQuota(session.userId);
    const remainingQuota = Math.max(0, 20 - newCount);

    return NextResponse.json({
      conversationId,
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        flaggedForRisk: userMessage.flaggedForRisk,
        createdAt: userMessage.createdAt.toISOString(),
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        modelUsed: assistantMessage.modelUsed,
        createdAt: assistantMessage.createdAt.toISOString(),
      },
      remainingQuota,
      crisisDetected: risk.flagged,
    });
  } catch (error: any) {
    console.error("Gagal memproses chat companion:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesan curhat", details: error.message },
      { status: 500 }
    );
  }
}
