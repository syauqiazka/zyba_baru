import { NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { comparePassword } from "@/backend/auth/password";
import { createToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/authCookies";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Cari user di Account DB dengan mekanisme retry (tahan terhadap cold start Neon pooler)
    let user: any = null;
    let lastError: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        user = await accountDb.user.findUnique({
          where: { email: normalizedEmail },
        });
        break;
      } catch (dbErr) {
        lastError = dbErr;
        console.warn(`[LOGIN] accountDb koneksi attempt ${attempt} gagal, mencoba lagi...`, dbErr);
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    }

    if (!user && lastError) {
      console.error("[LOGIN] Gagal menghubungi database accountDb:", lastError);
      return NextResponse.json(
        { error: "Koneksi database sedang dalam pemulihan. Silakan coba kembali dalam beberapa detik." },
        { status: 503 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    // 2. Periksa status banned / suspended
    if (user.isBanned) {
      return NextResponse.json(
        { error: "Akun ini telah dinonaktifkan permanen." },
        { status: 403 }
      );
    }

    if (user.isSuspended && user.suspendedUntil && user.suspendedUntil > new Date()) {
      return NextResponse.json(
        {
          error: `Akun ini ditangguhkan sementara hingga ${user.suspendedUntil.toLocaleDateString("id-ID")}.`,
        },
        { status: 403 }
      );
    }

    // 3. Verifikasi kata sandi
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    // 4. Terbitkan JWT Token dan pasang cookie httpOnly
    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
    });

    setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("[LOGIN_API_ERROR]", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat memproses masuk." },
      { status: 500 }
    );
  }
}

