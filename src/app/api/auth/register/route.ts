import { NextResponse } from "next/server";
import { accountDb } from "@/backend/db/accountClient";
import { hashPassword } from "@/backend/auth/password";
import { generateAndStoreOtp } from "@/backend/auth/otpStore";
import { sendOtpEmail } from "@/backend/email/brevo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }

    // Periksa apakah user dengan email ini sudah ada
    const existingUser = await accountDb.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan masuk." },
        { status: 409 }
      );
    }

    // 1. Generate OTP & simpan di store (cooldown 60s)
    const { otp, allowed, cooldownRemainingSec } = generateAndStoreOtp(normalizedEmail);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Harap tunggu ${cooldownRemainingSec} detik sebelum meminta kode baru.`,
        },
        { status: 429 }
      );
    }

    // 2. Hash password dengan bcrypt cost 12
    const passwordHash = await hashPassword(password);

    // 3. Buat record user baru dengan onboardingCompleted = false
    await accountDb.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        passwordHash,
        onboardingCompleted: false,
      },
    });

    // 4. Kirim email OTP via Brevo HTTPS REST API
    await sendOtpEmail({
      toEmail: normalizedEmail,
      toName: name.trim(),
      otp,
    });

    // PENTING: OTP TIDAK PERNAH DIKEMBALIKAN DI SINI DEMI KEAMANAN
    return NextResponse.json({
      success: true,
      message: "Kode verifikasi 6 digit telah dikirim ke email kamu.",
    });
  } catch (error) {
    console.error("[REGISTER_API_ERROR]", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat memproses pendaftaran. Coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}

