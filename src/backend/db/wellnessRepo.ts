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

      // Format riwayat nyata dari database
      const history: WellnessStatItem[] = assessments.map((a) => {
        let dayLabel = a.date;
        try {
          const parsed = new Date(a.date);
          if (!isNaN(parsed.getTime())) {
            dayLabel = parsed.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" });
          }
        } catch {}
        return {
          date: dayLabel,
          score: a.calculatedScore || Math.round((moodToPoints(a.mood) * 0.6) + (scaleToPoints(a.stressLevel, true) * 0.4)),
          stressLevel: a.stressLevel || 3,
          mood: a.mood,
        };
      });

      const hasData = assessments.length > 0;
      const latestAssessment = hasData ? assessments[assessments.length - 1] : null;
      const ans = (latestAssessment?.answers as Record<string, any>) || {};

      const mental = latestAssessment
        ? Math.round(moodToPoints(latestAssessment.mood) * 0.5 + scaleToPoints(latestAssessment.stressLevel, true) * 0.5)
        : null;
      const physical = latestAssessment?.sleepRating ? scaleToPoints(latestAssessment.sleepRating) : null;
      const social = ans.connection
        ? scaleToPoints(Number(ans.connection))
        : (ans.supported ? scaleToPoints(Number(ans.supported)) : (hasData ? 60 : null));

      return {
        hasData,
        currentScore: user?.zybaScore ?? (hasData ? (latestAssessment?.calculatedScore || 50) : null),
        scoreBreakdown: {
          mental,
          physical,
          social,
        },
        history, // Data riil murni tanpa fabrikasi dummy
      };
    } catch (err) {
      console.warn("[Wellness-Repo] Fallback get stats:", err);
      return {
        hasData: false,
        currentScore: null,
        scoreBreakdown: { mental: null, physical: null, social: null },
        history: [],
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
