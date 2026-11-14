import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authCookies";
import {
  getArticleSources,
  createArticleSource,
  updateArticleSource,
  deleteArticleSource,
} from "@/backend/db/articleRepo";
import { validateSafeUrl } from "@/backend/articles/rssParser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const sources = await getArticleSources();
    return NextResponse.json({ sources });
  } catch (err: any) {
    console.error("[ADMIN_SOURCES_GET_ERROR]", err);
    return NextResponse.json({ error: "Gagal memuat sumber artikel." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const body = await request.json();
    const { name, url, websiteUrl, defaultCategory, isActive } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Nama sumber dan URL RSS wajib diisi." },
        { status: 400 }
      );
    }

    if (!validateSafeUrl(url)) {
      return NextResponse.json(
        { error: "URL tidak valid atau mengarah ke alamat jaringan terlarang (SSRF Protection)." },
        { status: 400 }
      );
    }

    const created = await createArticleSource({
      name,
      url,
      websiteUrl,
      defaultCategory,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, source: created });
  } catch (err: any) {
    console.error("[ADMIN_SOURCES_POST_ERROR]", err);
    return NextResponse.json({ error: "Gagal menambahkan sumber RSS." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, url, websiteUrl, defaultCategory, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID sumber wajib disertakan." }, { status: 400 });
    }

    if (url && !validateSafeUrl(url)) {
      return NextResponse.json(
        { error: "URL tidak valid atau dilarang." },
        { status: 400 }
      );
    }

    const updated = await updateArticleSource(id, {
      name,
      url,
      websiteUrl,
      defaultCategory,
      isActive,
    });

    return NextResponse.json({ success: true, source: updated });
  } catch (err: any) {
    console.error("[ADMIN_SOURCES_PATCH_ERROR]", err);
    return NextResponse.json({ error: "Gagal memperbarui sumber RSS." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID sumber wajib disertakan." }, { status: 400 });
    }

    await deleteArticleSource(id);
    return NextResponse.json({ success: true, message: "Sumber RSS berhasil dihapus." });
  } catch (err: any) {
    console.error("[ADMIN_SOURCES_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Gagal menghapus sumber RSS." }, { status: 500 });
  }
}
