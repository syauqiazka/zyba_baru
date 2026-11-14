/**
 * ZYBA Admin & Community Moderation Repository
 * Menangani audit laporan komunitas, tindakan moderasi, dan pencatatan ModerationLog.
 * Memenuhi spesifikasi AGENTS.md Bagian 7.11 & design-system/zyba/pages/admin.md.
 */

import { communityDb } from "./communityClient";
import { accountDb } from "./accountClient";

export interface AdminReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: "POST" | "COMMENT";
  targetId: string;
  postId?: string | null;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  reasonLabel: string;
  details?: string | null;
  contentSnippet: string;
  status: "PENDING" | "REVIEWING" | "ACTION_TAKEN" | "DISMISSED";
  resolutionNote?: string | null;
  createdAt: string;
}

// In-memory seed untuk laporan komunitas ketika DB offline
const memReports: AdminReportItem[] = [
  {
    id: "rep-seed-1",
    reporterId: "user_seed_dimas",
    reporterName: "Dimas Anggara",
    targetType: "POST",
    targetId: "post_spam_test",
    postId: "post_spam_test",
    reportedUserId: "user_spammer_99",
    reportedUserName: "Akun Promo Ghaib",
    reason: "spam",
    reasonLabel: "Spam & Promosi Ilegal",
    details: "Mengirimkan tautan judi/pinjol berulang kali di kolom komentar refleksi.",
    contentSnippet: "Klaim bonus pinjaman instan tanpa syarat cair 5 menit langsung wa ke nomor...",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 menit lalu
  },
  {
    id: "rep-seed-2",
    reporterId: "user_seed_nadia",
    reporterName: "Nadia Larasati",
    targetType: "POST",
    targetId: "post_distress_test",
    postId: "post_distress_test",
    reportedUserId: "user_distress_01",
    reportedUserName: "Jiwa Terluka",
    reason: "self_harm",
    reasonLabel: "Indikasi Tekanan / Menyakiti Diri",
    details: "Postingan mengekspresikan keputusasaan mendalam dan butuh pendampingan.",
    contentSnippet: "Rasanya malam ini aku sudah tidak sanggup lagi bernapas di dunia ini...",
    status: "REVIEWING",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 jam lalu
  },
  {
    id: "rep-seed-3",
    reporterId: "user_seed_syauqi",
    reporterName: "Syauqi",
    targetType: "COMMENT",
    targetId: "comm_hate_test",
    postId: "post_seed_1",
    reportedUserId: "user_troll_12",
    reportedUserName: "Kritikus Nyinyir",
    reason: "harassment",
    reasonLabel: "Pelecehan / Komentar Kasar",
    details: "Menggunakan kata-kata kasar yang merendahkan proses pulih orang lain.",
    contentSnippet: "Lemah banget baru masalah sepele gitu aja curhat nangis-nangis di medsos.",
    status: "ACTION_TAKEN",
    resolutionNote: "Komentar disembunyikan dan pengguna diberikan peringatan resmi.",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
];

function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), ms)),
  ]);
}

export const adminRepo = {
  /**
   * Mengambil daftar laporan komunitas dengan filter status dan tipe
   */
  async listReports(options: { status?: string; targetType?: string; limit?: number } = {}) {
    const { status, targetType, limit = 20 } = options;

    try {
      const where: any = {};
      if (status && status !== "ALL") where.status = status;
      if (targetType && targetType !== "ALL") where.targetType = targetType;

      const reports = await withTimeout(
        communityDb.communityReport.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
        }),
        2500
      );

      if (reports.length > 0) {
        return reports.map((r) => ({
          id: r.id,
          reporterId: r.reporterId,
          reporterName: "Pengguna Pelapor",
          targetType: r.targetType,
          targetId: r.targetId,
          postId: r.postId,
          reportedUserId: r.reportedUserId,
          reportedUserName: "Pengguna Terlapor",
          reason: r.reason,
          reasonLabel: formatReason(r.reason),
          details: r.details,
          contentSnippet: r.details || "Konten yang dilaporkan dalam komunitas.",
          status: r.status,
          resolutionNote: r.resolutionNote,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch {
      // In-memory fallback
    }

    let list = [...memReports];
    if (status && status !== "ALL") {
      list = list.filter((r) => r.status === status);
    }
    if (targetType && targetType !== "ALL") {
      list = list.filter((r) => r.targetType === targetType);
    }
    return list.slice(0, limit);
  },

  /**
   * Mengambil ringkasan statistik laporan untuk dashboard admin
   */
  async getStats() {
    try {
      const [total, pending, reviewing, actionTaken, dismissed] = await withTimeout(
        Promise.all([
          communityDb.communityReport.count(),
          communityDb.communityReport.count({ where: { status: "PENDING" } }),
          communityDb.communityReport.count({ where: { status: "REVIEWING" } }),
          communityDb.communityReport.count({ where: { status: "ACTION_TAKEN" } }),
          communityDb.communityReport.count({ where: { status: "DISMISSED" } }),
        ]),
        2500
      );

      return { total, pending, reviewing, actionTaken, dismissed };
    } catch {
      const pending = memReports.filter((r) => r.status === "PENDING").length;
      const reviewing = memReports.filter((r) => r.status === "REVIEWING").length;
      const actionTaken = memReports.filter((r) => r.status === "ACTION_TAKEN").length;
      const dismissed = memReports.filter((r) => r.status === "DISMISSED").length;

      return {
        total: memReports.length,
        pending,
        reviewing,
        actionTaken,
        dismissed,
      };
    }
  },

  /**
   * Menjalankan tindakan moderasi pada laporan tertentu
   */
  async takeAction(params: {
    reportId: string;
    adminId: string;
    action: "HIDE_POST" | "DELETE_POST" | "WARN" | "SUSPEND" | "BAN" | "DISMISS_REPORT" | "SUPPORT_CRISIS";
    reason: string;
    targetUserId?: string;
    targetContentId?: string;
  }) {
    const { reportId, adminId, action, reason, targetUserId, targetContentId } = params;

    // 1. Perbarui status laporan di Community DB
    try {
      const isDismiss = action === "DISMISS_REPORT";
      await communityDb.communityReport.update({
        where: { id: reportId },
        data: {
          status: isDismiss ? "DISMISSED" : "ACTION_TAKEN",
          reviewedBy: adminId,
          resolutionNote: reason,
          resolvedAt: new Date(),
        },
      });

      // Jika menyembunyikan post
      if (action === "HIDE_POST" && targetContentId) {
        await communityDb.communityPost.update({
          where: { id: targetContentId },
          data: { isHidden: true },
        });
      }
    } catch {
      // In-memory fallback
      const report = memReports.find((r) => r.id === reportId);
      if (report) {
        report.status = action === "DISMISS_REPORT" ? "DISMISSED" : "ACTION_TAKEN";
        report.resolutionNote = reason;
      }
    }

    // 2. Catat log moderasi di Account DB
    try {
      if (targetUserId) {
        await accountDb.moderationLog.create({
          data: {
            adminId,
            targetUserId,
            action: mapActionType(action),
            reason,
            reportId,
          },
        });

        if (action === "WARN") {
          await accountDb.user.update({
            where: { id: targetUserId },
            data: { warningCount: { increment: 1 } },
          });
        } else if (action === "SUSPEND") {
          await accountDb.user.update({
            where: { id: targetUserId },
            data: { isSuspended: true },
          });
        } else if (action === "BAN") {
          await accountDb.user.update({
            where: { id: targetUserId },
            data: { isBanned: true, banReason: reason },
          });
        }
      }
    } catch {}

    return { success: true };
  },
};

function formatReason(reason: string): string {
  const map: Record<string, string> = {
    spam: "Spam & Promosi",
    harassment: "Pelecehan / Perundungan",
    hate_speech: "Ujaran Kebencian",
    inappropriate: "Konten Tidak Pantas",
    self_harm: "Indikasi Bahaya Diri",
    other: "Pelanggaran Lainnya",
  };
  return map[reason] || "Laporan Pelanggaran";
}

function mapActionType(action: string): any {
  if (action === "DISMISS_REPORT") return "DISMISS_REPORT";
  if (action === "HIDE_POST") return "HIDE_POST";
  if (action === "DELETE_POST") return "DELETE_POST";
  if (action === "WARN") return "WARN";
  if (action === "SUSPEND") return "SUSPEND";
  if (action === "BAN") return "BAN";
  return "WARN";
}
