"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  EyeOff,
  UserX,
  Flag,
  MessageSquare,
  Filter,
  Check,
  X,
  Loader2,
  Heart,
  HelpCircle,
  Clock,
  UserCheck,
  BookOpen,
} from "lucide-react";
import { ArticleAdminSection } from "@/components/admin/ArticleAdminSection";

interface AdminReport {
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

interface AdminStats {
  total: number;
  pending: number;
  reviewing: number;
  actionTaken: number;
  dismissed: number;
}

export default function AdminPage() {
  const [mainTab, setMainTab] = useState<"MODERATION" | "ARTICLES">("MODERATION");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    pending: 0,
    reviewing: 0,
    actionTaken: 0,
    dismissed: 0,
  });

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Modal Action state
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [actionType, setActionType] = useState<
    "HIDE_POST" | "WARN" | "SUPPORT_CRISIS" | "DISMISS_REPORT" | "BAN"
  >("HIDE_POST");
  const [actionReason, setActionReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchReportsAndStats = async () => {
    try {
      setLoading(true);

      const [reportsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/reports?status=${statusFilter}&targetType=${typeFilter}`),
        fetch(`/api/admin/stats`),
      ]);

      if (reportsRes.status === 403 || statsRes.status === 403) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      if (reportsRes.ok) {
        const data = await reportsRes.json();
        const fetchedReports = data.reports || [];
        setReports(fetchedReports);

        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("modal") === "action" && fetchedReports.length > 0) {
            setSelectedReport(fetchedReports[0]);
          }
        }
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("tab") === "articles") {
        setMainTab("ARTICLES");
      }
    }
    fetchReportsAndStats();
  }, [statusFilter, typeFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const targetReportId = selectedReport.id;
    const resolvedReason = actionReason.trim() || "Tindakan moderasi administratif standar.";
    const isDismiss = actionType === "DISMISS_REPORT";

    try {
      setSubmittingAction(true);

      // Update optimistik pada daftar laporan lokal
      setReports((prev) =>
        prev.map((r) =>
          r.id === targetReportId
            ? {
                ...r,
                status: isDismiss ? "DISMISSED" : "ACTION_TAKEN",
                resolutionNote: resolvedReason,
              }
            : r
        )
      );

      const res = await fetch(`/api/admin/reports/${selectedReport.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          reason: resolvedReason,
          targetUserId: selectedReport.reportedUserId,
          targetContentId: selectedReport.targetId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menerapkan aksi moderasi");
      }

      showToast("Tindakan moderasi berhasil diterapkan.");
      setSelectedReport(null);
      setActionReason("");
      fetchReportsAndStats();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat memproses moderasi");
      fetchReportsAndStats();
    } finally {
      setSubmittingAction(false);
    }
  };

  if (unauthorized) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF4F1] border border-[#F28C6E]/30 text-[#F28C6E] mb-4">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[#1B241E]">
          Akses Terbatas Administrator
        </h1>
        <p className="mt-2 max-w-md text-sm text-[#2D3E33]/70">
          Halaman ini khusus untuk tim pemandu keselamatan suaka ZYBA. Akunmu saat ini tidak memiliki hak istimewa administrator.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1B241E] px-6 py-2.5 text-xs font-medium text-white hover:bg-[#2D3E33] transition-colors"
        >
          <span>Kembali ke Beranda Suaka</span>
        </Link>
      </div>
    );
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "self_harm":
        return "bg-[#FDF4F1] text-[#F28C6E] border-[#F28C6E]/30";
      case "harassment":
      case "hate_speech":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "spam":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-[#E8F2EC] text-[#3E7B54] border-[#3E7B54]/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
            <Clock className="h-3 w-3" />
            <span>Menunggu</span>
          </span>
        );
      case "REVIEWING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-medium text-blue-800">
            <Shield className="h-3 w-3" />
            <span>Sedang Ditinjau</span>
          </span>
        );
      case "ACTION_TAKEN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F2EC] px-2.5 py-0.5 text-[11px] font-medium text-[#3E7B54]">
            <CheckCircle className="h-3 w-3" />
            <span>Telah Ditindak</span>
          </span>
        );
      case "DISMISSED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
            <Check className="h-3 w-3" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#1B241E] px-5 py-2.5 text-sm text-[#F5F8F5] shadow-lg animate-in fade-in slide-in-from-top-4">
          <Check className="h-4 w-4 text-[#3E7B54]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Main Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 p-1 rounded-2xl bg-white border border-[#2D3E33]/10 shadow-2xs max-w-fit">
        <button
          type="button"
          onClick={() => setMainTab("MODERATION")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mainTab === "MODERATION"
              ? "bg-[#3E7B54] text-white shadow-xs"
              : "text-[#2D3E33]/70 hover:text-[#1B241E] hover:bg-[#2D3E33]/5"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Moderasi Komunitas</span>
        </button>
        <button
          type="button"
          onClick={() => setMainTab("ARTICLES")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mainTab === "ARTICLES"
              ? "bg-[#3E7B54] text-white shadow-xs"
              : "text-[#2D3E33]/70 hover:text-[#1B241E] hover:bg-[#2D3E33]/5"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manajemen Artikel & Wawasan</span>
        </button>
      </div>

      {mainTab === "ARTICLES" ? (
        <ArticleAdminSection onNotify={showToast} />
      ) : (
        <>
          {/* Header Info */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-[#1B241E]">
              Moderasi Laporan Komunitas
            </h1>
            <p className="mt-1 text-sm text-[#2D3E33]/70">
              Jaga suaka ZYBA tetap aman, hangat, dan terlindungi dari pelecehan maupun sinyal bahaya diri.
            </p>
          </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-white p-5 border border-[#2D3E33]/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Menunggu</p>
          <p className="font-serif text-3xl font-semibold text-[#1B241E] mt-1">{stats.pending}</p>
          <p className="text-[11px] text-[#2D3E33]/60 mt-1">Laporan baru perlu ditinjau</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#2D3E33]/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Ditinjau</p>
          <p className="font-serif text-3xl font-semibold text-[#1B241E] mt-1">{stats.reviewing}</p>
          <p className="text-[11px] text-[#2D3E33]/60 mt-1">Dalam proses pemeriksaan</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#2D3E33]/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#3E7B54]">Selesai Ditindak</p>
          <p className="font-serif text-3xl font-semibold text-[#1B241E] mt-1">{stats.actionTaken}</p>
          <p className="text-[11px] text-[#2D3E33]/60 mt-1">Konten tersembunyi / ditegur</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#2D3E33]/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Ditolak</p>
          <p className="font-serif text-3xl font-semibold text-[#1B241E] mt-1">{stats.dismissed}</p>
          <p className="text-[11px] text-[#2D3E33]/60 mt-1">Tidak melanggar panduan</p>
        </div>
      </div>

      {/* Bilah Filter & Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "ALL", label: "Semua" },
            { id: "PENDING", label: "Menunggu" },
            { id: "REVIEWING", label: "Ditinjau" },
            { id: "ACTION_TAKEN", label: "Ditindak" },
            { id: "DISMISSED", label: "Ditolak" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === item.id
                  ? "bg-[#1B241E] text-white"
                  : "bg-white/80 text-[#2D3E33]/70 hover:bg-[#E8F2EC] hover:text-[#1B241E] border border-[#2D3E33]/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Target Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-[#2D3E33]/50" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-full border border-[#2D3E33]/15 bg-white px-3 py-1.5 text-xs text-[#1B241E] focus:outline-none focus:border-[#3E7B54]"
          >
            <option value="ALL">Semua Tipe Konten</option>
            <option value="POST">Postingan Komunitas</option>
            <option value="COMMENT">Komentar</option>
          </select>
        </div>
      </div>

      {/* Daftar Laporan Komunitas */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#3E7B54]" />
        </div>
      ) : reports.length === 0 ? (
        <div id="admin-reports-empty" className="rounded-3xl bg-white/70 border border-[#2D3E33]/10 p-12 text-center">
          <UserCheck className="mx-auto h-8 w-8 text-[#3E7B54] mb-3" />
          <h3 className="font-serif text-lg font-medium text-[#1B241E]">
            Suaka Damai & Bersih
          </h3>
          <p className="mt-1 text-xs text-[#2D3E33]/70 max-w-sm mx-auto">
            Tidak ada laporan pelanggaran komunitas dengan kriteria filter saat ini.
          </p>
        </div>
      ) : (
        <div id="admin-reports-container" className="space-y-4">
          {reports.map((report, idx) => (
            <div
              key={report.id}
              className="rounded-2xl bg-white p-5 border border-[#2D3E33]/10 hover:border-[#2D3E33]/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getReasonColor(
                      report.reason
                    )}`}
                  >
                    {report.reasonLabel}
                  </span>

                  <span className="text-[11px] font-medium text-[#2D3E33]/60">
                    Sasaran: {report.targetType === "POST" ? "Postingan" : "Komentar"}
                  </span>

                  <span className="text-[#2D3E33]/30">•</span>

                  <span className="text-[11px] text-[#2D3E33]/50">
                    Dilaporkan oleh: <strong>{report.reporterName}</strong>
                  </span>

                  <span className="text-[#2D3E33]/30">•</span>

                  <span className="text-[11px] text-[#2D3E33]/50">
                    Terlapor: <strong className="text-rose-700">{report.reportedUserName}</strong>
                  </span>
                </div>

                {/* Cuplikan Teks yang Dilaporkan */}
                <div className="rounded-xl bg-[#F5F8F5] p-3 text-xs text-[#1B241E] italic border-l-2 border-[#3E7B54]">
                  &ldquo;{report.contentSnippet}&rdquo;
                </div>

                {report.details && (
                  <p className="text-[11px] text-[#2D3E33]/70">
                    Catatan Pelapor: {report.details}
                  </p>
                )}

                {report.resolutionNote && (
                  <p className="text-[11px] text-[#3E7B54]">
                    Tindakan Admin: {report.resolutionNote}
                  </p>
                )}
              </div>

              {/* Status & Aksi */}
              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#2D3E33]/10">
                {getStatusBadge(report.status)}

                {report.status === "PENDING" || report.status === "REVIEWING" ? (
                  <button
                    type="button"
                    id={idx === 0 ? "btn-review-report-first" : undefined}
                    onClick={() => {
                      setSelectedReport(report);
                      setActionReason("");
                      // Default suggest crisis support if self_harm
                      if (report.reason === "self_harm") {
                        setActionType("SUPPORT_CRISIS");
                        setActionReason("Mengarahkan pengguna ke saluran bantuan krisis kesehatan mental 119.");
                      } else {
                        setActionType("HIDE_POST");
                        setActionReason("");
                      }
                    }}
                    className="rounded-full bg-[#1B241E] px-4 py-2 text-xs font-medium text-white hover:bg-[#2D3E33] transition-colors shadow-2xs"
                  >
                    Tinjau & Tindak
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Selesai Ditindak</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TINDAKAN MODERASI */}
      {selectedReport && (
        <div id="modal-admin-action" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B241E]/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl border border-[#2D3E33]/15">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3E33]/10">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#3E7B54]" />
                <h3 className="text-base font-semibold text-[#1B241E]">
                  Tindakan Moderasi Laporan
                </h3>
              </div>
              <button
                type="button"
                id="btn-cancel-admin-action"
                onClick={() => setSelectedReport(null)}
                className="text-[#2D3E33]/50 hover:text-[#1B241E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteAction} className="mt-4 space-y-4">
              <div className="rounded-xl bg-[#F5F8F5] p-3 text-xs space-y-1">
                <p>
                  <strong className="text-[#1B241E]">Konten Terlapor:</strong> &ldquo;{selectedReport.contentSnippet}&rdquo;
                </p>
                <p className="text-[#2D3E33]/70">
                  Pelanggaran: <strong>{selectedReport.reasonLabel}</strong> | Pengguna: <strong>{selectedReport.reportedUserName}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B241E] mb-2">
                  Pilih Tindakan Administrator
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: "HIDE_POST",
                      label: "Sembunyikan Konten",
                      desc: "Konten disembunyikan dari linimasa publik namun data tetap tersimpan.",
                      icon: EyeOff,
                    },
                    {
                      id: "SUPPORT_CRISIS",
                      label: "Tawarkan Sumber Bantuan Krisis",
                      desc: "Kirim pesan lembut berisi rujukan hotline darurat 119 kepada pengguna.",
                      icon: Heart,
                    },
                    {
                      id: "WARN",
                      label: "Beri Peringatan Resmi",
                      desc: "Kirim teguran pelanggaran etika suaka ke akun pengguna terlapor.",
                      icon: AlertTriangle,
                    },
                    {
                      id: "DISMISS_REPORT",
                      label: "Tolak Laporan (Tidak Melanggar)",
                      desc: "Tutup laporan jika konten dinilai tidak melanggar pedoman suaka.",
                      icon: CheckCircle,
                    },
                    {
                      id: "BAN",
                      label: "Blokir Akses Pengguna (Permanen)",
                      desc: "Blokir akun pelanggar berulang dari seluruh akses interaksi komunitas.",
                      icon: UserX,
                    },
                  ].map((act) => {
                    const Icon = act.icon;
                    const isSelected = actionType === act.id;
                    return (
                      <label
                        key={act.id}
                        className={`flex items-start gap-3 rounded-xl p-3 border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#3E7B54] bg-[#E8F2EC]/50"
                            : "border-[#2D3E33]/10 hover:bg-[#F5F8F5]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="adminAction"
                          checked={isSelected}
                          onChange={() => setActionType(act.id as any)}
                          className="mt-1 accent-[#3E7B54]"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#1B241E] flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-[#3E7B54]" />
                            <span>{act.label}</span>
                          </p>
                          <p className="text-[11px] text-[#2D3E33]/70 mt-0.5">{act.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B241E] mb-1.5">
                  Catatan Audit Moderasi (Tercatat di ModerationLog)
                </label>
                <textarea
                  rows={2}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  required
                  placeholder="Tuliskan alasan tindakan administratif ini..."
                  className="w-full rounded-xl border border-[#2D3E33]/15 bg-white p-3 text-xs text-[#1B241E] focus:outline-none focus:border-[#3E7B54]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2D3E33]/10">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  disabled={submittingAction}
                  className="rounded-full px-4 py-2 text-xs font-medium text-[#2D3E33]/70 hover:text-[#1B241E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1B241E] px-5 py-2 text-xs font-medium text-white hover:bg-[#2D3E33] transition-colors disabled:opacity-50"
                >
                  {submittingAction ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Terapkan Tindakan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )}
</div>
  );
}
