import { accountDb } from "./accountClient";
import { ActivityType } from "@/generated/account-client";
import { calculateZybaScore } from "../scoring/zybaScore";

export interface ActivityTemplate {
  id: string;
  type: ActivityType;
  title: string;
  desc: string;
  recommendedMin: number;
  category: "mindful" | "body" | "rest";
  isCompleted?: boolean;
}

export const DEFAULT_ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  {
    id: "act-breath-1",
    type: ActivityType.BREATHING,
    title: "Taman Bernapas 4-7-8",
    desc: "Redakan ketegangan sistem saraf dengan 4 siklus pernapasan berirama.",
    recommendedMin: 3,
    category: "mindful",
  },
  {
    id: "act-walk-1",
    type: ActivityType.WALKING,
    title: "Jalan Santai Tanpa Layar",
    desc: "Melangkah perlahan 10-15 menit untuk mengistirahatkan mata dan pikiran.",
    recommendedMin: 15,
    category: "body",
  },
  {
    id: "act-water-1",
    type: ActivityType.WORKOUT,
    title: "Peregangan Pundak & Leher",
    desc: "Rilis simpul ketegangan otot leher dan pundak akibat duduk terlalu lama.",
    recommendedMin: 5,
    category: "body",
  },
  {
    id: "act-rest-1",
    type: ActivityType.SLEEP,
    title: "Jeda Hening Tanpa Notifikasi",
    desc: "Duduk bersandar nyaman dan pejamkan mata sejenak tanpa distraksi gawai.",
    recommendedMin: 5,
    category: "rest",
  },
];

export const activityRepo = {
  /**
   * Mengambil daftar aktivitas hari ini dan rekomendasi
   */
  async listActivities(userId: string) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const logs = await accountDb.activityLog.findMany({
        where: {
          userId,
          createdAt: { gte: todayStart },
        },
        orderBy: { createdAt: "desc" },
      });

      // Tandai template mana saja yang sudah selesai hari ini
      const templates = DEFAULT_ACTIVITY_TEMPLATES.map((tpl) => {
        const isDone = logs.some((l) => l.type === tpl.type && l.completed);
        return {
          ...tpl,
          isCompleted: isDone,
        };
      });

      return {
        logs,
        templates,
        completedCount: logs.filter((l) => l.completed).length,
      };
    } catch (err) {
      console.warn("[Activity-Repo] Fallback list activities:", err);
      return {
        logs: [],
        templates: DEFAULT_ACTIVITY_TEMPLATES.map((t) => ({ ...t, isCompleted: false })),
        completedCount: 0,
      };
    }
  },

  /**
   * Mencatat aktivitas selesai dan menghitung ulang skor Zyba secara dinamis
   */
  async logActivity(
    userId: string,
    data: {
      type: ActivityType;
      durationMin: number;
      completed?: boolean;
    }
  ) {
    try {
      // 1. Catat log aktivitas
      const log = await accountDb.activityLog.create({
        data: {
          userId,
          type: data.type,
          durationMin: data.durationMin,
          completed: data.completed ?? true,
        },
      });

      // 2. Ambil data penilaian harian untuk kalkulasi ulang skor
      const dailyAssessments = await accountDb.dailyAssessment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 7,
      });

      const initialAssessment = await accountDb.assessment.findUnique({
        where: { userId },
      });

      const totalCompletedActs = await accountDb.activityLog.count({
        where: { userId, completed: true },
      });

      // 3. Hitung skor Zyba baru
      const scoreResult = calculateZybaScore({
        dailyAssessments,
        initialAssessment,
        completedActivitiesCount: totalCompletedActs,
      });

      // 4. Perbarui skor pengguna di User table
      await accountDb.user.update({
        where: { id: userId },
        data: { zybaScore: scoreResult.zybaScore },
      });

      return {
        log,
        newZybaScore: scoreResult.zybaScore,
        scoreResult,
      };
    } catch (err) {
      console.error("[Activity-Repo] Gagal mencatat aktivitas:", err);
      // Fallback response jika database offline
      return {
        log: {
          id: "act-log-" + Date.now(),
          userId,
          type: data.type,
          durationMin: data.durationMin,
          completed: true,
          distanceMeter: null,
          targetMin: null,
          createdAt: new Date(),
        },
        newZybaScore: 78,
      };
    }
  },
};
