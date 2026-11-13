import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { accountDb } from "@/backend/db/accountClient";
import { calculateZybaScore } from "@/backend/scoring/zybaScore";

export const dynamic = "force-dynamic";

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
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let user: any = null;
    let todayCheckIn: any = null;
    let recentAssessments: any[] = [];
    let initialAssessment: any = null;
    let todayActivity: any = null;
    let todayJournal: any = null;

    try {
      user = await accountDb.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          companionPersona: true,
          zybaScore: true,
          stressLevel: true,
          streakDays: true,
          lastStreakDate: true,
          createdAt: true,
        },
      });

      // 1. Check-in hari ini
      todayCheckIn = await accountDb.dailyAssessment.findUnique({
        where: {
          userId_date: {
            userId: session.userId,
            date: todayDate,
          },
        },
      });

      // 2. 7 assessment harian terakhir
      recentAssessments = await accountDb.dailyAssessment.findMany({
        where: { userId: session.userId },
        orderBy: { date: "desc" },
        take: 7,
      });

      // 3. Initial baseline
      initialAssessment = await accountDb.assessment.findUnique({
        where: { userId: session.userId },
        select: { initialMood: true, stressLevel: true, sleepQualityRating: true },
      });

      // 4. Aktivitas hari ini
      todayActivity = await accountDb.activityLog.findFirst({
        where: {
          userId: session.userId,
          completed: true,
          createdAt: { gte: startOfToday },
        },
      });

      // 5. Jurnal hari ini
      todayJournal = await accountDb.journalEntry.findFirst({
        where: {
          userId: session.userId,
          createdAt: { gte: startOfToday },
        },
      });
    } catch (dbErr) {
      console.warn("[GET /api/dashboard] DB query warning (using session fallback):", dbErr);
    }

    const userName = user?.name || session.name || "Teman ZYBA";
    const userPersona = user?.companionPersona || "ZIBI";

    // 6. Hitung skor dinamis
    const scoreResult = calculateZybaScore({
      dailyAssessments: recentAssessments,
      initialAssessment,
      completedActivitiesCount: todayActivity ? 1 : 0,
    });

    // 7. Status Hearth Flame
    const litToday = !!todayCheckIn;
    let flameStreak = user?.streakDays || 0;
    if (litToday && flameStreak === 0) flameStreak = 1;

    return NextResponse.json({
      user: {
        name: userName,
        username: user?.username || null,
        avatarUrl: user?.avatarUrl || null,
        companionPersona: userPersona,
      },
      scoreData: {
        zybaScore: user?.zybaScore ?? scoreResult.zybaScore,
        mentalScore: scoreResult.mentalScore,
        physicalScore: scoreResult.physicalScore,
        socialScore: scoreResult.socialScore,
        stressLevel: user?.stressLevel ?? 2,
        hasEnoughData: scoreResult.hasEnoughData,
        sampleDaysCount: scoreResult.sampleDaysCount,
      },
      hearthFlame: {
        litToday,
        streakDays: flameStreak,
        lastCheckInDate: user?.lastStreakDate ? user.lastStreakDate.toISOString() : null,
      },
      todayChecklist: {
        checkInDone: litToday,
        activityDone: !!todayActivity,
        journalDone: !!todayJournal,
      },
      recentCheckIns: recentAssessments.map((d) => ({
        date: d.date,
        mood: d.mood,
        score: d.calculatedScore,
        flaggedForRisk: d.flaggedForRisk,
      })),
      crisisAlert: todayCheckIn?.flaggedForRisk ?? false,
    });
  } catch (error: any) {
    console.error("[GET /api/dashboard] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data dashboard", details: error?.message },
      { status: 500 }
    );
  }
}
