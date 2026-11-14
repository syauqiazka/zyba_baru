/**
 * ZYBA Cron Endpoint: Automated Health Article Aggregator
 * Dipanggil secara terjadwal oleh Vercel Cron (setiap 6 jam) atau webhook eksternal.
 * Terproteksi dengan CRON_SECRET & otentikasi Bearer token.
 */

import { NextResponse } from "next/server";
import { runIngestionPipeline } from "@/backend/articles/ingestionPipeline";
import { getAuthUser } from "@/lib/authCookies";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Max execution timeout untuk serverless Vercel (60s)

export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}

async function handleSync(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization") || "";
    const secretParam = searchParams.get("secret");
    const configuredSecret =
      process.env.CRON_SECRET ||
      process.env.RSS_SYNC_SECRET ||
      "zyba-cron-sync-wellness-key-2026";

    // 1. Verifikasi Keamanan / Autentikasi
    const isBearerValid =
      authHeader.startsWith("Bearer ") &&
      authHeader.slice(7).trim() === configuredSecret;
    const isParamValid = secretParam === configuredSecret;

    // Cek apakah dipanggil oleh admin yang sedang login
    const adminUser = await getAuthUser();
    const isAdmin = adminUser && adminUser.role === "ADMIN";

    if (!isBearerValid && !isParamValid && !isAdmin) {
      return NextResponse.json(
        {
          error: "Akses ditolak. Token autentikasi cron tidak valid.",
          hint: "Sertakan Authorization: Bearer <CRON_SECRET> atau parameter ?secret=<CRON_SECRET>.",
        },
        { status: 401 }
      );
    }

    // 2. Jalankan Ingestion Pipeline
    const triggeredBy = isAdmin && !isBearerValid && !isParamValid ? "MANUAL_ADMIN" : "CRON";
    const result = await runIngestionPipeline({
      triggeredBy,
      maxArticlesPerSource: 5,
    });

    return NextResponse.json({
      success: result.success,
      message: result.message,
      articlesFound: result.articlesFound,
      articlesProcessed: result.articlesProcessed,
      articlesSaved: result.articlesSaved,
      articlesRejected: result.articlesRejected,
      durationMs: result.durationMs,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[CRON_SYNC_ARTICLES_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan pada cron sinkronisasi artikel.",
      },
      { status: 500 }
    );
  }
}
