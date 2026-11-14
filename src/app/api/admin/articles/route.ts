import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authCookies";
import {
  getArticles,
  updateArticleStatus,
  updateArticleDetails,
  deleteArticle,
} from "@/backend/db/articleRepo";
import { ArticleCategory, ArticleStatus } from "@/generated/account-client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") || "ALL") as any;
    const category = (searchParams.get("category") || "ALL") as any;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { articles, total } = await getArticles({
      status,
      category,
      search,
      limit,
      offset,
      includeSeed: false,
    });

    return NextResponse.json({ articles, total });
  } catch (err: any) {
    console.error("[ADMIN_ARTICLES_GET_ERROR]", err);
    return NextResponse.json(
      { error: "Gagal memuat daftar artikel admin." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const body = await request.json();
    const { id, action, title, excerpt, category, readingTime, reviewNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID artikel wajib disertakan." }, { status: 400 });
    }

    if (action === "APPROVE") {
      const updated = await updateArticleStatus(
        id,
        ArticleStatus.PUBLISHED,
        user.sub,
        reviewNotes || "Disetujui oleh Administrator ZYBA"
      );
      return NextResponse.json({ success: true, article: updated });
    }

    if (action === "REJECT") {
      const updated = await updateArticleStatus(
        id,
        ArticleStatus.REJECTED,
        user.sub,
        reviewNotes || "Ditolak oleh Administrator ZYBA"
      );
      return NextResponse.json({ success: true, article: updated });
    }

    if (action === "ARCHIVE") {
      const updated = await updateArticleStatus(
        id,
        ArticleStatus.ARCHIVED,
        user.sub,
        reviewNotes || "Diarsipkan"
      );
      return NextResponse.json({ success: true, article: updated });
    }

    if (action === "UPDATE") {
      const updated = await updateArticleDetails(id, {
        title,
        excerpt,
        category: category as ArticleCategory,
        readingTime,
      });
      return NextResponse.json({ success: true, article: updated });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal." }, { status: 400 });
  } catch (err: any) {
    console.error("[ADMIN_ARTICLES_PATCH_ERROR]", err);
    return NextResponse.json(
      { error: "Gagal memperbarui status artikel." },
      { status: 500 }
    );
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
      return NextResponse.json({ error: "ID artikel wajib disertakan." }, { status: 400 });
    }

    await deleteArticle(id);
    return NextResponse.json({ success: true, message: "Artikel berhasil dihapus." });
  } catch (err: any) {
    console.error("[ADMIN_ARTICLES_DELETE_ERROR]", err);
    return NextResponse.json(
      { error: "Gagal menghapus artikel." },
      { status: 500 }
    );
  }
}
