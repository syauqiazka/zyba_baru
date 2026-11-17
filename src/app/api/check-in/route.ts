import { NextResponse } from "next/server";
import { getAuthTokenFromCookies, setAuthCookie } from "@/lib/authCookies";
import { verifyToken, createToken } from "@/lib/jwt";
import { accountDb } from "@/backend/db/accountClient";
import { detectRisk, CRISIS_RESOURCES } from "@/lib/crisisDetection";
import { calculateZybaScore } from "@/backend/scoring/zybaScore";
import { MoodLevel } from "@/generated/account-client";

export const dynamic = "force-dynamic";

// Format date in WIB (UTC+7) dengan kalkulasi absolut tahan runtime
function getTodayWIB(): string {
  try {
    return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

// Resolusi user riil di database untuk menjamin integritas relasi foreign key (P2003)
async function resolveRealUser(session: { userId?: string; sub?: string; email?: string }) {
  const targetId = session.userId || session.sub;
  let user = targetId
    ? await accountDb.user.findUnique({
        where: { id: targetId },
        select: { id: true, email: true, name: true, role: true, onboardingCompleted: true },
      })
    : null;

  if (!user && session.email) {
    user = await accountDb.user.findUnique({
      where: { email: session.email.toLowerCase().trim() },
      select: { id: true, email: true, name: true, role: true, onboardingCompleted: true },
    });
    if (user) {
      try {
        const refreshedToken = await createToken({
          sub: user.id,
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          onboardingCompleted: user.onboardingCompleted,
        });
        setAuthCookie(refreshedToken);
      } catch {}
    }
  }

  return user;
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

    const realUser = await resolveRealUser(session);
    if (!realUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 401 });
    }
    const actualUserId = realUser.id;

    const todayDate = getTodayWIB();

    // 1. Cek check-in hari ini via composite unique key (userId_date)
    let todayCheckIn = await accountDb.dailyAssessment.findUnique({
      where: {
        userId_date: {
          userId: actualUserId,
          date: todayDate,
        },
      },
    });

    // 2. Resiliensi sinkronisasi: cek record terbaru jika terdaftar pada tanggal WIB hari ini
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

    // Ambil riwayat 7 check-in terakhir
    const pastCheckIns = await accountDb.dailyAssessment.findMany({
      where: { userId: actualUserId },
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

    const realUser = await resolveRealUser(session);
    if (!realUser) {
      return NextResponse.json(
        { error: "Akun pengguna tidak ditemukan di sistem. Silakan login kembali." },
        { status: 401 }
      );
    }
    const actualUserId = realUser.id;

    const todayDate = getTodayWIB();

    // STRICT LOCK: Cek apakah user sudah pernah check-in hari ini
    // Memastikan check-in hanya bisa 1x per hari (tidak bisa re-submit)
    const existing = await accountDb.dailyAssessment.findFirst({
      where: {
        userId: actualUserId,
        OR: [
          { date: todayDate },
          {
            createdAt: {
              gte: new Date(Date.now() - 20 * 60 * 60 * 1000),
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      const existingWIBDate = new Date(existing.createdAt.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
      if (existing.date === todayDate || existingWIBDate === todayDate) {
        return NextResponse.json(
          {
            error: "Kamu sudah menyelesaikan check-in hari ini. Kembalilah besok untuk jeda batin berikutnya.",
            alreadyCheckedIn: true,
            todayCheckIn: existing,
          },
          { status: 400 }
        );
      }
    }

    const body = await request.json();
    const {
      date = todayDate,
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

    // Simpan ke DB dengan mekanisme retry (tahan terhadap jeda/cold start pooler database)
    let lastDbError: any = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        daily = await accountDb.dailyAssessment.upsert({
          where: {
            userId_date: {
              userId: actualUserId,
              date: todayDate,
            },
          },
          create: {
            userId: actualUserId,
            date: todayDate,
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
        break;
      } catch (err) {
        lastDbError = err;
        console.warn(`[POST /api/check-in] DB Upsert attempt ${attempt} failed, retrying...`, err);
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }
    }

    if (!daily) {
      console.error("[POST /api/check-in] DB Upsert gagal total:", lastDbError);
      return NextResponse.json(
        {
          error: "Gagal menyimpan check-in harian ke database. Silakan coba kembali sesaat lagi.",
          details: lastDbError?.message,
        },
        { status: 500 }
      );
    }

    try {
      // Ambil 7 record check-in terakhir untuk rolling window
      recentAssessments = await accountDb.dailyAssessment.findMany({
        where: { userId: actualUserId },
        orderBy: { date: "desc" },
        take: 7,
      });

      initialAssessment = await accountDb.assessment.findUnique({
        where: { userId: actualUserId },
        select: { initialMood: true, stressLevel: true, sleepQualityRating: true },
      });

      completedActivitiesCount = await accountDb.activityLog.count({
        where: {
          userId: actualUserId,
          completed: true,
          createdAt: { gte: new Date(Date.now() - 7 * 86400000) },
        },
      });

      // Hitung Hearth Flame streak
      const user = await accountDb.user.findUnique({
        where: { id: actualUserId },
        select: { streakDays: true, lastStreakDate: true },
      });

      if (user?.lastStreakDate) {
        const lastDate = new Date(user.lastStreakDate.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const today = new Date(todayDate);
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
        where: { id: actualUserId },
        data: {
          stressLevel: stressVal ?? undefined,
          streakDays: newStreakDays,
          lastStreakDate: new Date(),
        },
      });
    } catch (metricErr) {
      console.warn("[POST /api/check-in] Non-critical metrics update error:", metricErr);
    }

    // Pastikan assessment hari ini masuk dalam kalkulasi
    if (recentAssessments.length === 0) {
      recentAssessments = [daily];
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
          where: { id: actualUserId },
          data: { zybaScore: scoreResult.zybaScore },
        });
      }
    } catch {
      // Ignored non-critical score update
    }

    return NextResponse.json(
      {
        success: true,
        alreadyCheckedIn: true,
        dailyAssessment: daily,
        todayCheckIn: daily,
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
