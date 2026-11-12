import { NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { verifyOtp } from "@/backend/auth/otpStore";
import { createToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/authCookies";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email dan kode verifikasi wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verifikasi kode OTP
    const verification = verifyOtp(normalizedEmail, otp);
    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || "Kode verifikasi tidak valid." },
        { status: 400 }
      );
    }

    // 2. Ambil data user
    const user = await accountDb.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // 3. Buat JWT Token dan simpan di httpOnly cookie
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
    console.error("[VERIFY_OTP_API_ERROR]", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat memverifikasi kode." },
      { status: 500 }
    );
  }
}

