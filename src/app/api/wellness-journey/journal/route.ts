import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { wellnessRepo } from "@/backend/db/wellnessRepo";

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

    const entries = await wellnessRepo.listJournalEntries(session.userId);
    return NextResponse.json(
      { entries },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("Gagal memuat jurnal:", err);
    return NextResponse.json(
      { error: "Gagal memuat daftar entri jurnal" },
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
    const title = body.title?.trim();
    const content = body.content?.trim();
    const mood = body.mood;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul dan isi jurnal wajib diisi" },
        { status: 400 }
      );
    }

    const result = await wellnessRepo.createJournalEntry(session.userId, {
      title,
      content,
      mood,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Gagal menyimpan jurnal:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan refleksi jurnal" },
      { status: 500 }
    );
  }
}
