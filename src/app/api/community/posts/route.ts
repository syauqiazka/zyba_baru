import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { communityRepo } from "@/backend/db/communityRepo";
import { detectRisk } from "@/lib/crisisDetection";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = (searchParams.get("tab") || "for-you") as any;
    const topic = searchParams.get("topic") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const token = getAuthTokenFromCookies();
    let userId = "";
    if (token) {
      const session = await verifyToken(token);
      if (session?.userId) {
        userId = session.userId;
      }
    }

    const posts = await communityRepo.listPosts({
      tab,
      topic,
      userId,
      limit,
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("Gagal memuat feed komunitas:", error);
    return NextResponse.json(
      { error: "Gagal memuat postingan komunitas" },
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
    const { title, content, topicTag, isAnonymous } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Isi cerita tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Crisis detection (AGENTS.md Bagian 8)
    const risk = detectRisk(`${title || ""} ${content}`);

    const result = await communityRepo.createPost({
      userId: session.userId,
      userName: session.name || "Teman ZYBA",
      userHandle: session.name?.toLowerCase().replace(/\s+/g, "_") || "teman_zyba",
      title: typeof title === "string" ? title.slice(0, 120) : undefined,
      content: content.slice(0, 2000),
      topicTag: typeof topicTag === "string" ? topicTag.slice(0, 50) : "Refleksi",
      isAnonymous: Boolean(isAnonymous),
    });

    return NextResponse.json(
      {
        post: result.post,
        riskAlert: risk.flagged,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gagal membuat postingan komunitas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan postingan" },
      { status: 500 }
    );
  }
}

