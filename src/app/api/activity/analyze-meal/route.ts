import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { analyzeMealPhoto } from "@/backend/ai/aiMealVision";
import { activityRepo } from "@/backend/db/activityRepo";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await request.json();
    const { imageBase64, mimeType = "image/jpeg", userNote, samplePreset } = body;

    if (!imageBase64 && !samplePreset && !userNote) {
      return NextResponse.json(
        { error: "Foto makanan atau catatan makanan wajib dilampirkan" },
        { status: 400 }
      );
    }

    // Jalankan analisis vision AI Zibi
    const analysis = await analyzeMealPhoto(
      imageBase64 || "",
      mimeType,
      samplePreset || userNote
    );

    // Simpan ke database MealLog
    const mealLog = await activityRepo.createMealLog(session.userId, {
      imageUrl: imageBase64 && imageBase64.length < 500000 ? imageBase64 : undefined,
      foodName: analysis.foodName,
      calories: analysis.calories,
      proteinGrams: analysis.proteinGrams,
      carbsGrams: analysis.carbsGrams,
      fatGrams: analysis.fatGrams,
      fiberGrams: analysis.fiberGrams,
      healthScore: analysis.healthScore,
      notes: `${analysis.mindfulReview} — Rekomendasi: ${analysis.recommendation}`,
    });

    return NextResponse.json({
      success: true,
      mealLog,
      analysis,
    });
  } catch (err: any) {
    console.error("[POST /api/activity/analyze-meal] Error:", err);
    return NextResponse.json(
      { error: "Gagal menganalisis piring makanan: " + (err.message || String(err)) },
      { status: 500 }
    );
  }
}
