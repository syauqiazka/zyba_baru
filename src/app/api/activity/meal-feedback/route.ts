import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { activityRepo } from "@/backend/db/activityRepo";
import { learnFromUserInteraction } from "@/backend/ai/zibiMemory";

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
    const { mealLogId, correctedFoodName, correctedCalories, complaintNotes } = body;

    if (!mealLogId || !complaintNotes?.trim()) {
      return NextResponse.json(
        { error: "ID makanan dan catatan koreksi/komplain wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Update database catatan makanan
    const updated = await activityRepo.updateMealFeedback(session.userId, {
      mealLogId,
      correctedFoodName: correctedFoodName?.trim(),
      correctedCalories: correctedCalories ? Number(correctedCalories) : undefined,
      complaintNotes: complaintNotes.trim(),
    });

    // 2. Beri umpan balik ke memori adaptif Zibi agar AI terus belajar & berkembang
    const feedbackSummary = `[Koreksi Nutrisi Piring]: Makanan="${correctedFoodName || 'Piring Pengguna'}", Kalori Sebenarnya=${correctedCalories || 'Disesuaikan'}, Masukan Pengguna="${complaintNotes.trim()}".`;
    await learnFromUserInteraction(
      session.userId,
      feedbackSummary,
      "Terima kasih atas masukan berhargamu. Zibi telah mencatat preferensi porsi dan bahan ini untuk analisis piring berikutnya."
    ).catch((err) => {
      console.warn("[Meal-Feedback] Gagal update Zibi memory:", err);
    });

    return NextResponse.json({
      success: true,
      message:
        "Koreksi berhasil disimpan! Zibi telah memperbarui catatan nutrisimu dan mempelajari preferensi piringmu.",
      updatedMeal: updated,
    });
  } catch (err: any) {
    console.error("[POST /api/activity/meal-feedback] Error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan koreksi: " + (err.message || String(err)) },
      { status: 500 }
    );
  }
}
