import { NextResponse } from "next/server";
import { getAuthTokenFromCookies, setAuthCookie } from "@/lib/authCookies";
import { verifyToken, createToken } from "@/lib/jwt";
import { accountDb } from "@/backend/db/accountClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Ambil status terbaru dari DB dengan fallback email jika session.sub ID legacy/tidak cocok
    let user = await accountDb.user.findUnique({
      where: { id: session.sub },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        companionPersona: true,
        role: true,
        onboardingCompleted: true,
        zybaScore: true,
        stressLevel: true,
      },
    });

    if (!user && session.email) {
      user = await accountDb.user.findUnique({
        where: { email: session.email.toLowerCase().trim() },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          avatarUrl: true,
          companionPersona: true,
          role: true,
          onboardingCompleted: true,
          zybaScore: true,
          stressLevel: true,
        },
      });

      if (user) {
        // Otomatis sinkronkan & perbarui cookie token dengan ID riil database
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

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("[AUTH_ME_ERROR]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memeriksa sesi." },
      { status: 500 }
    );
  }
}

