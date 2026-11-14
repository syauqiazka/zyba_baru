import { accountDb } from "./accountClient";
import { MoodLevel } from "@/generated/account-client";
import { detectRisk } from "@/lib/crisisDetection";
import { moodToPoints, scaleToPoints } from "../scoring/zybaScore";

export interface WellnessStatItem {
  date: string;
  score: number;
  stressLevel: number;
  mood: string;
}

export interface JournalItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: string | null;
  createdAt: string;
}

export const wellnessRepo = {
  /**
   * Mengambil statistik riwayat skor dan tren kebugaran batin
   */
  async getStats(userId: string) {
    try {
      const user = await accountDb.user.findUnique({
        where: { id: userId },
        select: { zybaScore: true, name: true },
      });

      const assessments = await accountDb.dailyAssessment.findMany({
        where: { userId },
        orderBy: { date: "asc" },
        take: 14,
      });

      // Format riwayat untuk grafik
      const history: WellnessStatItem[] = assessments.map((a) => ({
        date: a.date,
        score: a.calculatedScore || Math.round((moodToPoints(a.mood) * 0.6) + (scaleToPoints(a.stressLevel, true) * 0.4)),
        stressLevel: a.stressLevel || 3,
        mood: a.mood,
      }));

      // Breakdown domain
      const latestAssessment = assessments[assessments.length - 1];
      const mental = latestAssessment
        ? Math.round(moodToPoints(latestAssessment.mood) * 0.5 + scaleToPoints(latestAssessment.stressLevel, true) * 0.5)
        : 70;
      const physical = latestAssessment?.sleepRating ? scaleToPoints(latestAssessment.sleepRating) : 75;
      const social = 68;

      return {
        currentScore: user?.zybaScore || 74,
        scoreBreakdown: {
          mental,
          physical,
          social,
        },
        history: history.length > 0 ? history : [
          { date: "Sen", score: 68, stressLevel: 3, mood: "NEUTRAL" },
          { date: "Sel", score: 72, stressLevel: 2, mood: "HAPPY" },
          { date: "Rab", score: 70, stressLevel: 3, mood: "NEUTRAL" },
          { date: "Kam", score: 78, stressLevel: 2, mood: "HAPPY" },
          { date: "Jum", score: 75, stressLevel: 2, mood: "NEUTRAL" },
          { date: "Sab", score: 82, stressLevel: 1, mood: "OVERJOYED" },
          { date: "Min", score: user?.zybaScore || 80, stressLevel: 1, mood: "HAPPY" },
        ],
      };
    } catch (err) {
      console.warn("[Wellness-Repo] Fallback get stats:", err);
      return {
        currentScore: 74,
        scoreBreakdown: { mental: 72, physical: 75, social: 70 },
        history: [
          { date: "Sen", score: 70, stressLevel: 3, mood: "NEUTRAL" },
          { date: "Sel", score: 74, stressLevel: 2, mood: "HAPPY" },
          { date: "Rab", score: 72, stressLevel: 3, mood: "NEUTRAL" },
          { date: "Kam", score: 78, stressLevel: 2, mood: "HAPPY" },
          { date: "Jum", score: 76, stressLevel: 2, mood: "NEUTRAL" },
          { date: "Sab", score: 80, stressLevel: 1, mood: "HAPPY" },
          { date: "Min", score: 74, stressLevel: 2, mood: "HAPPY" },
        ],
      };
    }
  },

  /**
   * Mengambil entri jurnal reflektif pengguna
   */
  async listJournalEntries(userId: string): Promise<JournalItem[]> {
    try {
      const entries = await accountDb.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      });

      return entries.map((e) => ({
        id: e.id,
        userId: e.userId,
        title: e.title,
        content: e.content,
        mood: e.mood,
        createdAt: e.createdAt.toISOString(),
      }));
    } catch (err) {
      console.warn("[Wellness-Repo] Fallback list journal:", err);
      return [];
    }
  },

  /**
   * Menyimpan entri jurnal baru dengan deteksi keselamatan emosional (detectRisk)
   */
  async createJournalEntry(
    userId: string,
    data: {
      title: string;
      content: string;
      mood?: string;
    }
  ): Promise<{ entry: JournalItem; riskDetected: boolean }> {
    const risk = detectRisk(`${data.title} ${data.content}`);

    let moodEnum: MoodLevel | undefined = undefined;
    if (data.mood && Object.values(MoodLevel).includes(data.mood as MoodLevel)) {
      moodEnum = data.mood as MoodLevel;
    }

    try {
      const created = await accountDb.journalEntry.create({
        data: {
          userId,
          title: data.title.trim(),
          content: data.content.trim(),
          mood: moodEnum,
        },
      });

      return {
        entry: {
          id: created.id,
          userId: created.userId,
          title: created.title,
          content: created.content,
          mood: created.mood,
          createdAt: created.createdAt.toISOString(),
        },
        riskDetected: risk.flagged,
      };
    } catch (err) {
      console.warn("[Wellness-Repo] Simpan jurnal gagal, fallback memory:", err);
      return {
        entry: {
          id: "journal-" + Date.now(),
          userId,
          title: data.title,
          content: data.content,
          mood: data.mood,
          createdAt: new Date().toISOString(),
        },
        riskDetected: risk.flagged,
      };
    }
  },
};
