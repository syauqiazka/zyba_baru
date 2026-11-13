/**
 * ZYBA Companion Token Quota & Mindful Cooldown Service
 *
 * Sesuai arahan resmi:
 * 1. Kuota berbasis token: 15.000 token per siklus curhat.
 * 2. Saat kuota 15.000 token habis, pengguna masuk ke masa "Jeda Batin" (Cooldown) selama 5 jam.
 * 3. Tujuan pembatasan: Mencegah pengguna menjadi tergantung secara berlebihan kepada AI,
 *    mendorong jeda reflektif di dunia nyata (nafas mindful, grounding, istirahat).
 * 4. Setelah 5 jam berlalu, kuota 15.000 token otomatis di-refresh penuh kembali.
 */

import { companionDb } from "@/backend/db/companionClient";

export const TOKEN_LIMIT = 15000;
export const COOLDOWN_HOURS = 5;
export const COOLDOWN_MS = COOLDOWN_HOURS * 3600 * 1000; // 5 jam = 18.000.000 ms

export interface TokenQuotaStatus {
  allowed: boolean;
  tokensUsed: number;
  tokenLimit: number;
  remainingTokens: number;
  isCooldown: boolean;
  cooldownUntil: string | null;
  cooldownRemainingSec: number;
  // Backward compatibility alias fields:
  remaining: number;
  maxQuota: number;
  date: string;
}

/**
 * Estimasi jumlah token dari teks (Indonesia & Multilingual ~3.5 karakter per token)
 */
export function estimateTokens(text: string): number {
  if (!text || !text.trim()) return 1;
  const chars = text.trim().length;
  return Math.max(5, Math.ceil(chars / 3.5));
}

// In-memory fallback untuk dev/offline mode jika database postgres belum terhubung
const memStore = new Map<
  string,
  { tokensUsed: number; cooldownUntil: number | null; lastActiveAt: number }
>();

/**
 * Memeriksa status kuota token pengguna & status cooldown 5 jam
 */
export async function checkTokenQuota(userId: string): Promise<TokenQuotaStatus> {
  const now = new Date();
  const nowMs = now.getTime();

  try {
    let quota = await companionDb.companionTokenQuota.findUnique({
      where: { userId },
    });

    if (quota) {
      let tokensUsed = quota.tokensUsed;
      let cooldownUntil = quota.cooldownUntil;

      // Cek apakah masa cooldown sudah berakhir
      if (cooldownUntil) {
        if (nowMs >= cooldownUntil.getTime()) {
          // Cooldown 5 jam telah selesai -> refresh kuota penuh 15.000 token!
          tokensUsed = 0;
          cooldownUntil = null;
          quota = await companionDb.companionTokenQuota.update({
            where: { userId },
            data: {
              tokensUsed: 0,
              cooldownUntil: null,
              lastActiveAt: now,
            },
          });
        }
      }

      const isCooldown = Boolean(cooldownUntil && nowMs < cooldownUntil.getTime());
      const cooldownRemainingSec = isCooldown && cooldownUntil
        ? Math.max(0, Math.ceil((cooldownUntil.getTime() - nowMs) / 1000))
        : 0;

      const remainingTokens = Math.max(0, quota.tokenLimit - tokensUsed);
      const allowed = !isCooldown && remainingTokens > 0;

      return {
        allowed,
        tokensUsed,
        tokenLimit: quota.tokenLimit,
        remainingTokens,
        isCooldown,
        cooldownUntil: cooldownUntil ? cooldownUntil.toISOString() : null,
        cooldownRemainingSec,
        remaining: remainingTokens,
        maxQuota: quota.tokenLimit,
        date: now.toISOString().split("T")[0],
      };
    }

    // Jika belum ada record di DB, inisialisasi baru
    const newRecord = await companionDb.companionTokenQuota.create({
      data: {
        userId,
        tokensUsed: 0,
        tokenLimit: TOKEN_LIMIT,
        cooldownUntil: null,
        lastActiveAt: now,
      },
    });

    return {
      allowed: true,
      tokensUsed: 0,
      tokenLimit: TOKEN_LIMIT,
      remainingTokens: TOKEN_LIMIT,
      isCooldown: false,
      cooldownUntil: null,
      cooldownRemainingSec: 0,
      remaining: TOKEN_LIMIT,
      maxQuota: TOKEN_LIMIT,
      date: now.toISOString().split("T")[0],
    };
  } catch (err) {
    // Fallback in-memory jika DB connection offline
    console.warn("[QuotaService] Fallback to in-memory quota tracking for:", userId);
    let entry = memStore.get(userId);
    if (!entry) {
      entry = { tokensUsed: 0, cooldownUntil: null, lastActiveAt: nowMs };
      memStore.set(userId, entry);
    }

    if (entry.cooldownUntil && nowMs >= entry.cooldownUntil) {
      entry.tokensUsed = 0;
      entry.cooldownUntil = null;
    }

    const isCooldown = Boolean(entry.cooldownUntil && nowMs < entry.cooldownUntil);
    const cooldownRemainingSec = isCooldown && entry.cooldownUntil
      ? Math.max(0, Math.ceil((entry.cooldownUntil - nowMs) / 1000))
      : 0;

    const remainingTokens = Math.max(0, TOKEN_LIMIT - entry.tokensUsed);
    const allowed = !isCooldown && remainingTokens > 0;

    return {
      allowed,
      tokensUsed: entry.tokensUsed,
      tokenLimit: TOKEN_LIMIT,
      remainingTokens,
      isCooldown,
      cooldownUntil: entry.cooldownUntil ? new Date(entry.cooldownUntil).toISOString() : null,
      cooldownRemainingSec,
      remaining: remainingTokens,
      maxQuota: TOKEN_LIMIT,
      date: now.toISOString().split("T")[0],
    };
  }
}

/**
 * Menambahkan konsumsi token setelah interaksi chat berhasil
 * dan mengaktifkan jeda 5 jam jika batas 15.000 token tercapai.
 */
export async function consumeTokens(
  userId: string,
  tokensConsumed: number
): Promise<TokenQuotaStatus> {
  const now = new Date();
  const nowMs = now.getTime();

  try {
    const current = await companionDb.companionTokenQuota.findUnique({
      where: { userId },
    });

    let currentTokens = current?.tokensUsed ?? 0;
    let newTokens = currentTokens + Math.max(1, tokensConsumed);
    let cooldownUntil: Date | null = current?.cooldownUntil ?? null;

    // Jika melebihi batas 15k token, aktifkan cooldown 5 jam
    if (newTokens >= TOKEN_LIMIT) {
      newTokens = TOKEN_LIMIT;
      cooldownUntil = new Date(nowMs + COOLDOWN_MS);
    }

    const updated = await companionDb.companionTokenQuota.upsert({
      where: { userId },
      create: {
        userId,
        tokensUsed: newTokens,
        tokenLimit: TOKEN_LIMIT,
        cooldownUntil,
        lastActiveAt: now,
      },
      update: {
        tokensUsed: newTokens,
        cooldownUntil,
        lastActiveAt: now,
      },
    });

    const isCooldown = Boolean(cooldownUntil && nowMs < cooldownUntil.getTime());
    const cooldownRemainingSec = isCooldown && cooldownUntil
      ? Math.max(0, Math.ceil((cooldownUntil.getTime() - nowMs) / 1000))
      : 0;
    const remainingTokens = Math.max(0, TOKEN_LIMIT - newTokens);

    return {
      allowed: !isCooldown && remainingTokens > 0,
      tokensUsed: newTokens,
      tokenLimit: TOKEN_LIMIT,
      remainingTokens,
      isCooldown,
      cooldownUntil: cooldownUntil ? cooldownUntil.toISOString() : null,
      cooldownRemainingSec,
      remaining: remainingTokens,
      maxQuota: TOKEN_LIMIT,
      date: now.toISOString().split("T")[0],
    };
  } catch (err) {
    // In-memory fallback
    let entry = memStore.get(userId) || { tokensUsed: 0, cooldownUntil: null, lastActiveAt: nowMs };
    let newTokens = entry.tokensUsed + Math.max(1, tokensConsumed);
    let cooldownUntilNum: number | null = entry.cooldownUntil;

    if (newTokens >= TOKEN_LIMIT) {
      newTokens = TOKEN_LIMIT;
      cooldownUntilNum = nowMs + COOLDOWN_MS;
    }

    entry.tokensUsed = newTokens;
    entry.cooldownUntil = cooldownUntilNum;
    entry.lastActiveAt = nowMs;
    memStore.set(userId, entry);

    const isCooldown = Boolean(cooldownUntilNum && nowMs < cooldownUntilNum);
    const cooldownRemainingSec = isCooldown && cooldownUntilNum
      ? Math.max(0, Math.ceil((cooldownUntilNum - nowMs) / 1000))
      : 0;
    const remainingTokens = Math.max(0, TOKEN_LIMIT - newTokens);

    return {
      allowed: !isCooldown && remainingTokens > 0,
      tokensUsed: newTokens,
      tokenLimit: TOKEN_LIMIT,
      remainingTokens,
      isCooldown,
      cooldownUntil: cooldownUntilNum ? new Date(cooldownUntilNum).toISOString() : null,
      cooldownRemainingSec,
      remaining: remainingTokens,
      maxQuota: TOKEN_LIMIT,
      date: now.toISOString().split("T")[0],
    };
  }
}

// Backward-compatibility aliases
export const checkMessageQuota = checkTokenQuota;
export async function incrementMessageQuota(userId: string): Promise<number> {
  const res = await consumeTokens(userId, 150);
  return res.tokensUsed;
}
