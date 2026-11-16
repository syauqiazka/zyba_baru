import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { accountDb } from "@/backend/db/accountClient";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { calculateZybaScore } from "@/backend/scoring/zybaScore";
import { MoodLevel } from "@/generated/account-client";

export const dynamic = "force-dynamic";

// Format date in WIB (UTC+7)
function getTodayWIB(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export async function GET() {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const todayDate = getTodayWIB();

    // Check today's check-in
    const todayCheckIn = await accountDb.dailyAssessment.findUnique({
      where: {
        userId_date: {
          userId: session.userId,
          date: todayDate,
        },
      },
    });

    // Get past 7 check-ins
    const pastCheckIns = await accountDb.dailyAssessment.findMany({
      where: { userId: session.userId },
      orderBy: { date: "desc" },
      take: 7,
    });

    return NextResponse.json(
      {
        todayDate,
        alreadyCheckedIn: !!todayCheckIn,
        todayCheckIn,
        pastCheckIns,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[GET /api/check-in] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat status check-in", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await request.json();
    const {
      date = getTodayWIB(),
      mood = "NEUTRAL",
      stressLevel,
      sleepRating,
      energyTags = [],
      reflection = "",
      answers = {},
    } = body;

    // Mental health safety: detect risk on reflection and gratitude/notes
    const reflectionRisk = detectRisk(reflection);
    const gratitudeRisk = detectRisk(answers?.gratitude);
    const noteRisk = detectRisk(answers?.note);

    const isFlagged =
      reflectionRisk.flagged ||
      gratitudeRisk.flagged ||
      noteRisk.flagged;

    // Validasi enum MoodLevel
    const validMood = Object.values(MoodLevel).includes(mood as MoodLevel)
      ? (mood as MoodLevel)
      : MoodLevel.NEUTRAL;

    const stressVal = stressLevel != null ? parseInt(stressLevel.toString(), 10) : null;
    const sleepVal = sleepRating != null ? parseInt(sleepRating.toString(), 10) : null;

    let daily: any = null;
    let recentAssessments: any[] = [];
    let initialAssessment: any = null;
    let completedActivitiesCount = 0;
    let newStreakDays = 1;

    try {
      // Upsert 1 record per user per tanggal (AGENTS.md D1 & 7.2)
      daily = await accountDb.dailyAssessment.upsert({
        where: {
          userId_date: {
            userId: session.userId,
            date,
          },
        },
        create: {
          userId: session.userId,
          date,
          mood: validMood,
          stressLevel: stressVal,
          sleepRating: sleepVal,
          energyTags: Array.isArray(energyTags) ? energyTags : [],
          reflection: reflection || null,
          answers: answers || {},
          flaggedForRisk: isFlagged,
        },
        update: {
          mood: validMood,
          stressLevel: stressVal,
          sleepRating: sleepVal,
          energyTags: Array.isArray(energyTags) ? energyTags : [],
          reflection: reflection || null,
          answers: answers || {},
          flaggedForRisk: isFlagged,
        },
      });

      // Ambil 7 record check-in terakhir untuk rolling window
      recentAssessments = await accountDb.dailyAssessment.findMany({
        where: { userId: session.userId },
        orderBy: { date: "desc" },
        take: 7,
      });

      initialAssessment = await accountDb.assessment.findUnique({
        where: { userId: session.userId },
        select: { initialMood: true, stressLevel: true, sleepQualityRating: true },
      });

      completedActivitiesCount = await accountDb.activityLog.count({
        where: {
          userId: session.userId,
          completed: true,
          createdAt: { gte: new Date(Date.now() - 7 * 86400000) },
        },
      });

      // Hitung Hearth Flame streak
      const user = await accountDb.user.findUnique({
        where: { id: session.userId },
        select: { streakDays: true, lastStreakDate: true },
      });

      if (user?.lastStreakDate) {
        const lastDate = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(user.lastStreakDate);

        const today = new Date(date);
        const prev = new Date(lastDate);
        const diffDays = Math.round((today.getTime() - prev.getTime()) / 86400000);

        if (diffDays === 0) {
          newStreakDays = user.streakDays || 1;
        } else if (diffDays === 1) {
          newStreakDays = (user.streakDays || 0) + 1;
        } else {
          newStreakDays = 1;
        }
      }

      // Update user record
      await accountDb.user.update({
        where: { id: session.userId },
        data: {
          zybaScore: undefined, // will update below
          stressLevel: stressVal ?? undefined,
          streakDays: newStreakDays,
          lastStreakDate: new Date(),
        },
      });
    } catch (dbErr) {
      console.warn("[POST /api/check-in] DB operation warning (using calculated in-memory result):", dbErr);
    }

    // Pastikan assessment hari ini masuk dalam kalkulasi
    if (recentAssessments.length === 0) {
      recentAssessments = [
        {
          date,
          mood: validMood,
          stressLevel: stressVal,
          sleepRating: sleepVal,
          energyTags: Array.isArray(energyTags) ? energyTags : [],
          answers,
        },
      ];
    }

    // Hitung Zyba Score dinamis
    const scoreResult = calculateZybaScore({
      dailyAssessments: recentAssessments,
      initialAssessment,
      completedActivitiesCount,
    });

    try {
      if (daily?.id) {
        await accountDb.dailyAssessment.update({
          where: { id: daily.id },
          data: { calculatedScore: scoreResult.zybaScore },
        });
        await accountDb.user.update({
          where: { id: session.userId },
          data: { zybaScore: scoreResult.zybaScore },
        });
      }
    } catch {
      // Ignored if DB offline
    }

    return NextResponse.json(
      {
        success: true,
        dailyAssessment: daily || {
          date,
          mood: validMood,
          calculatedScore: scoreResult.zybaScore,
        },
        scoreResult,
        flaggedForRisk: isFlagged,
        crisisResources: isFlagged ? CRISIS_RESOURCES : null,
        streakDays: newStreakDays,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[POST /api/check-in] Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan check-in harian", details: error?.message },
      { status: 500 }
    );
  }
}
