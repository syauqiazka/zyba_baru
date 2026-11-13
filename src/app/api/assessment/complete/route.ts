import { NextResponse } from "next/server";
import { getAuthTokenFromCookies, setAuthCookie } from "@/lib/authCookies";
import { verifyToken, createToken } from "@/lib/jwt";
import { accountDb } from "@/backend/db/accountClient";
import { detectRisk } from "@/lib/crisisDetection";

export async function POST(request: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan. Silakan masuk kembali." }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
    }

    const body = await request.json();
    const {
      username,
      companionPersona = "ZIBI",
      notifications = { companionNotif: true, wellnessNotif: true, communityNotif: false },
      questionnaire = {},
    } = body;

    const {
      goal,
      gender,
      age,
      weightKg,
      initialMood,
      helpHistory,
      physicalSymptoms,
      sleepQuality,
      stressLevel,
      medication,
      mentalSymptoms,
      expressionText,
    } = questionnaire;

    // Evaluasi Keselamatan Risiko pada Expression Analysis (Wajib AGENTS.md Bagian 7.1 & 8)
    const riskResult = detectRisk(expressionText);

    // Hitung baseline Zyba Score awal dari input asesmen
    let baselineScore = 50;
    if (stressLevel) {
      const stressNum = parseInt(stressLevel.toString(), 10) || 5;
      baselineScore = Math.max(30, Math.min(85, 100 - stressNum * 7));
    }

    // 1. Simpan Assessment ke Account DB sesuai kolom schema resmi
    const soughtHelp = helpHistory ? helpHistory.toLowerCase().includes("pernah") : false;
    const physArray = physicalSymptoms ? [physicalSymptoms] : [];
    const mentalArray = mentalSymptoms ? [mentalSymptoms] : [];
    const sleepRating = sleepQuality ? parseInt(sleepQuality.toString(), 10) : null;
    const stressNum = stressLevel ? parseInt(stressLevel.toString(), 10) : null;

    await accountDb.assessment.upsert({
      where: { userId: session.sub },
      create: {
        userId: session.sub,
        goal: goal || null,
        gender: gender || null,
        age: age ? parseInt(age.toString(), 10) : null,
        weightKg: weightKg ? parseFloat(weightKg.toString()) : null,
        initialMood: initialMood || null,
        soughtHelpBefore: soughtHelp,
        physicalSymptoms: physArray,
        sleepQualityRating: sleepRating,
        stressLevel: stressNum,
        medications: medication || null,
        mentalHealthSymptoms: mentalArray,
        expressionText: expressionText || null,
        flaggedForRisk: riskResult.flagged,
      },
      update: {
        goal: goal || null,
        gender: gender || null,
        age: age ? parseInt(age.toString(), 10) : null,
        weightKg: weightKg ? parseFloat(weightKg.toString()) : null,
        initialMood: initialMood || null,
        soughtHelpBefore: soughtHelp,
        physicalSymptoms: physArray,
        sleepQualityRating: sleepRating,
        stressLevel: stressNum,
        medications: medication || null,
        mentalHealthSymptoms: mentalArray,
        expressionText: expressionText || null,
        flaggedForRisk: riskResult.flagged,
      },
    });

    // 2. Simpan Preferensi Notifikasi
    await accountDb.notificationPref.upsert({
      where: { userId: session.sub },
      create: {
        userId: session.sub,
        companionNotif: Boolean(notifications.companionNotif),
        wellnessNotif: Boolean(notifications.wellnessNotif),
        communityNotif: Boolean(notifications.communityNotif),
      },
      update: {
        companionNotif: Boolean(notifications.companionNotif),
        wellnessNotif: Boolean(notifications.wellnessNotif),
        communityNotif: Boolean(notifications.communityNotif),
      },
    });

    // 3. Update User: Persona, status onboardingCompleted = true, skor awal
    const updatedUser = await accountDb.user.update({
      where: { id: session.sub },
      data: {
        companionPersona: companionPersona as any,
        username: username?.trim() || undefined,
        onboardingCompleted: true,
        zybaScore: baselineScore,
        stressLevel: stressLevel ? parseInt(stressLevel.toString(), 10) : 5,
      },
    });

    // 4. Terbitkan token baru dengan onboardingCompleted = true
    const newToken = await createToken({
      sub: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      onboardingCompleted: true,
    });

    setAuthCookie(newToken);

    return NextResponse.json({
      success: true,
      flaggedForRisk: riskResult.flagged,
      zybaScore: baselineScore,
    });
  } catch (error) {
    console.error("[ASSESSMENT_COMPLETE_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal menyelesaikan asesmen. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
