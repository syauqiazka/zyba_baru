/**
 * In-Memory & Resilient OTP Store with Cooldown & Attempt Throttling
 * Sesuai AGENTS.md Bagian 7.1: OTP 6 digit via Brevo (cooldown 60s + batas 5 percobaan)
 */

interface OtpRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const globalForOtp = globalThis as unknown as {
  otpCache?: Map<string, OtpRecord>;
};

const otpCache = globalForOtp.otpCache ?? new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== "production") {
  globalForOtp.otpCache = otpCache;
}

const OTP_TTL_MS = 10 * 60 * 1000; // 10 menit
const OTP_COOLDOWN_MS = 60 * 1000; // 60 detik cooldown
const MAX_ATTEMPTS = 5; // Maksimal 5 kali percobaan salah

export function generateAndStoreOtp(email: string): {
  otp: string;
  allowed: boolean;
  cooldownRemainingSec?: number;
} {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  const existing = otpCache.get(normalizedEmail);

  if (existing && now - existing.lastSentAt < OTP_COOLDOWN_MS) {
    const remainingSec = Math.ceil(
      (OTP_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000
    );
    return {
      otp: "",
      allowed: false,
      cooldownRemainingSec: remainingSec,
    };
  }

  // 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpCache.set(normalizedEmail, {
    otp,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: now,
  });

  return {
    otp,
    allowed: true,
  };
}

export function verifyOtp(
  email: string,
  inputOtp: string
): { success: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const record = otpCache.get(normalizedEmail);
  const now = Date.now();

  if (!record) {
    return {
      success: false,
      error: "Kode verifikasi tidak ditemukan atau belum diminta.",
    };
  }

  if (now > record.expiresAt) {
    otpCache.delete(normalizedEmail);
    return {
      success: false,
      error: "Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.",
    };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpCache.delete(normalizedEmail);
    return {
      success: false,
      error: "Batas percobaan terlampaui. Silakan minta kode verifikasi baru.",
    };
  }

  if (record.otp !== inputOtp.trim()) {
    record.attempts += 1;
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Kode salah. Sisa kesempatan: ${remaining} kali.`,
    };
  }

  // Lolos verifikasi
  otpCache.delete(normalizedEmail);
  return { success: true };
}

