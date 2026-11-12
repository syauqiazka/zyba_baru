/**
 * ZYBA Daily Message Quota Service
 * Ditegakkan server-side pada DB Companion model DailyMessageQuota
 * Sesuai keputusan terkunci AGENTS.md Bagian 4 & 7.5: 20 pesan gratis / hari
 */

import { companionDb } from "@/backend/db/companionClient";

export const DAILY_FREE_QUOTA = 20;

export function getTodayWIB(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wibTime = new Date(utc + 7 * 3600000);
  return wibTime.toISOString().split("T")[0];
}

export interface QuotaStatus {
  allowed: boolean;
  count: number;
  remaining: number;
  maxQuota: number;
  date: string;
}

/**
 * Cek status kuota harian pengguna
 */
export async function checkMessageQuota(userId: string): Promise<QuotaStatus> {
  const date = getTodayWIB();
  const recordId = `${userId}_${date}`;

  try {
    const quotaRecord = await companionDb.dailyMessageQuota.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    const count = quotaRecord?.messageCount ?? 0;
    const remaining = Math.max(0, DAILY_FREE_QUOTA - count);
    const allowed = count < DAILY_FREE_QUOTA;

    return {
      allowed,
      count,
      remaining,
      maxQuota: DAILY_FREE_QUOTA,
      date,
    };
  } catch (error) {
    console.error("Gagal memeriksa kuota pesan:", error);
    // Jika terjadi error pada DB, tetap kembalikan status aman tanpa memblokir darurat
    return {
      allowed: true,
      count: 0,
      remaining: DAILY_FREE_QUOTA,
      maxQuota: DAILY_FREE_QUOTA,
      date,
    };
  }
}

/**
 * Naikkan hitungan kuota harian setelah pesan berhasil diproses
 */
export async function incrementMessageQuota(userId: string): Promise<number> {
  const date = getTodayWIB();
  const recordId = `${userId}_${date}`;

  try {
    const updated = await companionDb.dailyMessageQuota.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      create: {
        id: recordId,
        userId,
        date,
        messageCount: 1,
      },
      update: {
        messageCount: {
          increment: 1,
        },
      },
    });

    return updated.messageCount;
  } catch (error) {
    console.error("Gagal menaikkan kuota pesan:", error);
    return 1;
  }
}
