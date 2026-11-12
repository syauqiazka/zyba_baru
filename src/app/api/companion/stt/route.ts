import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";

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

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Form data tidak valid" }, { status: 400 });
    }

    const audioFile = formData.get("file") as File | Blob | null;
    if (!audioFile) {
      return NextResponse.json({ error: "File audio tidak ditemukan" }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        {
          error: "STT_UNAVAILABLE",
          message: "Layanan transkripsi suara server belum dikonfigurasi. Gunakan mikrofon browser langsung.",
        },
        { status: 503 }
      );
    }

    const groqFormData = new FormData();
    groqFormData.append("file", audioFile, "recording.webm");
    groqFormData.append("model", "whisper-large-v3-turbo");
    groqFormData.append("language", "id");
    groqFormData.append("response_format", "json");

    const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: groqFormData,
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq Whisper STT Error:", errText);
      return NextResponse.json(
        { error: "Gagal mentranskripsi rekaman suara" },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    return NextResponse.json({ text: data.text || "" });
  } catch (error: any) {
    console.error("Error pada endpoint STT:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada STT" },
      { status: 500 }
    );
  }
}
