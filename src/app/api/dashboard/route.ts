import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { accountDb } from "@/backend/db/accountClient";
import { calculateZybaScore } from "@/backend/scoring/zybaScore";

export const dynamic = "force-dynamic";

function getTodayWIB(): string {
  try {
    return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
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
    let allYearAssessments: any[] = [];

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

      if (!user && session.email) {
        user = await accountDb.user.findUnique({
          where: { email: session.email.toLowerCase().trim() },
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
      }

      const actualUserId = user?.id || session.userId;

      // 1. Check-in hari ini
      todayCheckIn = await accountDb.dailyAssessment.findUnique({
        where: {
          userId_date: {
            userId: actualUserId,
            date: todayDate,
          },
        },
      });

      if (!todayCheckIn) {
        const latest = await accountDb.dailyAssessment.findFirst({
          where: { userId: actualUserId },
          orderBy: { createdAt: "desc" },
        });
        if (latest) {
          const latestWIBDate = new Date(latest.createdAt.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
          if (latest.date === todayDate || latestWIBDate === todayDate) {
            todayCheckIn = latest;
          }
        }
      }

      // 2. 7 assessment harian terakhir
      recentAssessments = await accountDb.dailyAssessment.findMany({
        where: { userId: actualUserId },
        orderBy: { date: "desc" },
        take: 7,
      });

      // 2b. Semua assessment di tahun berjalan untuk analitik bulanan & mingguan
      allYearAssessments = await accountDb.dailyAssessment.findMany({
        where: {
          userId: actualUserId,
          date: { startsWith: todayDate.slice(0, 4) },
        },
        select: { date: true, calculatedScore: true },
      });

      // 3. Initial baseline
      initialAssessment = await accountDb.assessment.findUnique({
        where: { userId: actualUserId },
        select: { initialMood: true, stressLevel: true, sleepQualityRating: true },
      });

      // 4. Aktivitas hari ini
      todayActivity = await accountDb.activityLog.findFirst({
        where: {
          userId: actualUserId,
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

    // 8. Analitik Kehadiran Riil (Monthly & Weekly Tracker)
    const currentYear = todayDate.slice(0, 4);
    const now = new Date();
    const currentMonthIdx = now.getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    // 12 Bulan Riil
    const monthlyTracker = monthNames.map((month, idx) => {
      const monthPrefix = `${currentYear}-${String(idx + 1).padStart(2, "0")}`;
      const daysInMonth = new Date(parseInt(currentYear), idx + 1, 0).getDate();
      const checkInsCount = allYearAssessments.filter((a) => a.date.startsWith(monthPrefix)).length;
      const val = Math.min(100, Math.round((checkInsCount / daysInMonth) * 100));
      return {
        month,
        val,
        checkInsCount,
        active: idx === currentMonthIdx,
      };
    });

    // 7 Hari Minggu Berjalan (Senin - Minggu)
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Senin, 6 = Minggu
    const weeklyTracker = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - dayOfWeek + i);
      const dateStr = d.toISOString().slice(0, 10);
      const hasChecked = allYearAssessments.some((a) => a.date === dateStr);
      return {
        day,
        date: String(d.getDate()),
        val: hasChecked ? 100 : 0,
        active: dateStr === todayDate,
      };
    });

    const weeklyCheckedCount = weeklyTracker.filter((w) => w.val > 0).length;
    const currentMonthCheckedCount = monthlyTracker[currentMonthIdx]?.checkInsCount || 0;
    const dayOfMonth = now.getDate();
    const monthlyRate = dayOfMonth > 0 ? Math.round((currentMonthCheckedCount / dayOfMonth) * 100) : 0;

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
      trackerData: {
        monthly: monthlyTracker,
        weekly: weeklyTracker,
        weeklyCheckedCount,
        currentMonthRate: monthlyRate,
        currentMonthName: monthNames[currentMonthIdx],
        year: currentYear,
      },
      recentCheckIns: recentAssessments.map((d) => ({
        date: d.date,
        mood: d.mood,
        score: d.calculatedScore,
        flaggedForRisk: d.flaggedForRisk,
      })),
      crisisAlert: todayCheckIn?.flaggedForRisk ?? false,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error: any) {
    console.error("[GET /api/dashboard] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data dashboard", details: error?.message },
      { status: 500 }
    );
  }
}
