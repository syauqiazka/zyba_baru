"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  Search,
  Filter,
  Layers,
  Radio,
  Clock,
  Sparkles,
  AlertCircle,
  Globe,
  Archive,
  ArrowRight,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface ArticleItem {
  id: string;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  thumbnail?: string | null;
  publishedAt: string;
  status: "PENDING" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
  relevanceScore: number;
  relevanceReason?: string | null;
  language: string;
  readingTime: number;
  createdAt: string;
}

interface SourceItem {
  id: string;
  name: string;
  url: string;
  websiteUrl?: string | null;
  defaultCategory?: string | null;
  isActive: boolean;
  lastSyncAt?: string | null;
  lastStatus?: string | null;
  lastError?: string | null;
  totalFetched: number;
  totalApproved: number;
}

interface SyncLogItem {
  id: string;
  sourceName?: string | null;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  articlesFound: number;
  articlesProcessed: number;
  articlesRejected: number;
  articlesApproved: number;
  errorMessage?: string | null;
  durationMs: number;
  triggeredBy: "CRON" | "MANUAL_ADMIN";
  createdAt: string;
}

interface StatsData {
  total: number;
  published: number;
  pending: number;
  rejected: number;
  collectedToday: number;
  activeSources: number;
  lastSyncAt: string | null;
  systemStatus: "HEALTHY" | "DEGRADED" | "IDLE";
}

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "MENTAL_HEALTH", label: "Mental Health" },
  { value: "EMOTIONAL_WELLNESS", label: "Emotional Wellness" },
  { value: "MINDFULNESS", label: "Mindfulness" },
  { value: "SELF_CARE", label: "Self Care" },
  { value: "SLEEP_AND_REST", label: "Sleep & Rest" },
  { value: "PHYSICAL_WELLNESS", label: "Physical Wellness" },
  { value: "RELATIONSHIPS", label: "Relationships" },
  { value: "PERSONAL_DEVELOPMENT", label: "Personal Development" },
];

export function ArticleAdminSection({ onNotify }: { onNotify: (msg: string) => void }) {
  const [subTab, setSubTab] = useState<"overview" | "articles" | "sources" | "sync">("overview");
  const [loading, setLoading] = useState(false);

  // Stats state
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    published: 0,
    pending: 0,
    rejected: 0,
    collectedToday: 0,
    activeSources: 0,
    lastSyncAt: null,
    systemStatus: "HEALTHY",
  });

  // Articles state
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingArticleId, setProcessingArticleId] = useState<string | null>(null);

  // Sources state
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceCategory, setNewSourceCategory] = useState("MENTAL_HEALTH");
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testingUrl, setTestingUrl] = useState(false);

  // Sync state
  const [syncLogs, setSyncLogs] = useState<SyncLogItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Edit Article Modal State
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editCategory, setEditCategory] = useState("MENTAL_HEALTH");
  const [editReadingTime, setEditReadingTime] = useState(3);
  const [savingEdit, setSavingEdit] = useState(false);

  // Load stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/articles/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      }
    } catch {}
  };

  // Load articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/articles", window.location.origin);
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (categoryFilter !== "ALL") url.searchParams.set("category", categoryFilter);
      if (searchQuery) url.searchParams.set("search", searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  // Load sources
  const fetchSources = async () => {
    try {
      const res = await fetch("/api/admin/articles/sources");
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources || []);
      }
    } catch {}
  };

  // Load sync logs
  const fetchSyncLogs = async () => {
    try {
      const res = await fetch("/api/admin/articles/sync");
      if (res.ok) {
        const data = await res.json();
        setSyncLogs(data.logs || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchStats();
    if (subTab === "overview") {
      fetchStats();
      fetchArticles();
      fetchSources();
    } else if (subTab === "articles") {
      fetchArticles();
    } else if (subTab === "sources") {
      fetchSources();
    } else if (subTab === "sync") {
      fetchSyncLogs();
    }
  }, [subTab, statusFilter, categoryFilter]);

  // Actions on articles
  const handleArticleAction = async (id: string, action: "APPROVE" | "REJECT" | "ARCHIVE") => {
    try {
      setProcessingArticleId(id);

      // Optimistic state update
      const newStatus = action === "APPROVE" ? "PUBLISHED" : action === "REJECT" ? "REJECTED" : "ARCHIVED";
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
      );

      const res = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        onNotify(
          action === "APPROVE"
            ? "Artikel berhasil disetujui & dipublikasikan!"
            : action === "REJECT"
            ? "Artikel berhasil ditolak."
            : "Artikel diarsipkan."
        );
        fetchArticles();
        fetchStats();
      }
    } catch {
      onNotify("Gagal memperbarui status artikel.");
      fetchArticles();
    } finally {
      setProcessingArticleId(null);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Hapus artikel ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        onNotify("Artikel berhasil dihapus permanen.");
        fetchArticles();
        fetchStats();
      }
    } catch {
      onNotify("Gagal menghapus artikel.");
    }
  };

  const handleOpenEdit = (article: ArticleItem) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditExcerpt(article.excerpt);
    setEditCategory(article.category);
    setEditReadingTime(article.readingTime || 3);
  };

  const handleSaveEdit = async () => {
    if (!editingArticle) return;
    try {
      setSavingEdit(true);
      const res = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingArticle.id,
          action: "UPDATE",
          title: editTitle,
          excerpt: editExcerpt,
          category: editCategory,
          readingTime: editReadingTime,
        }),
      });
      if (res.ok) {
        onNotify("Perubahan artikel berhasil disimpan.");
        setEditingArticle(null);
        fetchArticles();
      }
    } catch {
      onNotify("Gagal menyimpan perubahan artikel.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Actions on sources
  const handleToggleSource = async (src: SourceItem) => {
    try {
      const res = await fetch("/api/admin/articles/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: src.id, isActive: !src.isActive }),
      });
      if (res.ok) {
        onNotify(`Sumber ${src.name} sekarang ${!src.isActive ? "Aktif" : "Nonaktif"}.`);
        fetchSources();
      }
    } catch {
      onNotify("Gagal mengubah status sumber.");
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm("Hapus sumber RSS ini?")) return;
    try {
      const res = await fetch(`/api/admin/articles/sources?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        onNotify("Sumber RSS berhasil dihapus.");
        fetchSources();
      }
    } catch {
      onNotify("Gagal menghapus sumber RSS.");
    }
  };

  const handleTestFeedUrl = async () => {
    if (!newSourceUrl) return;
    setTestingUrl(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/articles/sources/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newSourceUrl }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || "Gagal menghubungkan ke feed" });
    } finally {
      setTestingUrl(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSourceName || !newSourceUrl) {
      alert("Nama dan URL feed wajib diisi.");
      return;
    }
    try {
      const res = await fetch("/api/admin/articles/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSourceName,
          url: newSourceUrl,
          defaultCategory: newSourceCategory,
          isActive: true,
        }),
      });
      if (res.ok) {
        onNotify("Sumber RSS berhasil ditambahkan!");
        setShowAddSourceModal(false);
        setNewSourceName("");
        setNewSourceUrl("");
        setTestResult(null);
        fetchSources();
        fetchStats();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menambah sumber.");
      }
    } catch {
      alert("Terjadi kesalahan saat menambah sumber.");
    }
  };

  // Manual Trigger Sync Now
  const handleTriggerSyncNow = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/admin/articles/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        onNotify(data.message || "Sinkronisasi artikel selesai.");
        fetchStats();
        fetchArticles();
        fetchSyncLogs();
      } else {
        onNotify(`Sinkronisasi terkendala: ${data.error || "Coba lagi"}`);
      }
    } catch {
      onNotify("Gagal menghubungi server sinkronisasi.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brown-900/10 pb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-brown-900/10 shadow-2xs">
          <button
            type="button"
            onClick={() => setSubTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "overview"
                ? "bg-[#3E7B54] text-white shadow-xs"
                : "text-brown-700 hover:text-brown-900 hover:bg-brown-900/5"
            }`}
          >
            Ringkasan (Overview)
          </button>
          <button
            type="button"
            onClick={() => setSubTab("articles")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === "articles"
                ? "bg-[#3E7B54] text-white shadow-xs"
                : "text-brown-700 hover:text-brown-900 hover:bg-brown-900/5"
            }`}
          >
            <span>Daftar Artikel</span>
            {stats.pending > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-bold">
                {stats.pending}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSubTab("sources")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "sources"
                ? "bg-[#3E7B54] text-white shadow-xs"
                : "text-brown-700 hover:text-brown-900 hover:bg-brown-900/5"
            }`}
          >
            Sumber RSS ({stats.activeSources})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("sync")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "sync"
                ? "bg-[#3E7B54] text-white shadow-xs"
                : "text-brown-700 hover:text-brown-900 hover:bg-brown-900/5"
            }`}
          >
            Riwayat Sinkronisasi
          </button>
        </div>

        {/* Sync Now Quick Action Button */}
        <button
          type="button"
          disabled={isSyncing}
          onClick={handleTriggerSyncNow}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-500 text-brown-900 hover:bg-orange-400 font-bold text-xs shadow-2xs transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Menyinkronkan..." : "Sync Now (Tarik Artikel)"}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {subTab === "overview" && (
        <div className="space-y-6">
          {/* Metrik Kartu Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-brown-700/60 uppercase tracking-wider">
                Total Terkumpul
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-extrabold text-brown-900">
                  {stats.total}
                </span>
                <BookOpen className="w-5 h-5 text-[#3E7B54]" />
              </div>
              <p className="text-[11px] text-brown-700/70">
                +{stats.collectedToday} artikel baru hari ini
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-50/40 p-5 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-wider">
                Published (Tayang)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-extrabold text-emerald-950">
                  {stats.published}
                </span>
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-emerald-800/80">Tampil aktif di Suaka Wawasan</p>
            </div>

            <div className="rounded-3xl border border-amber-500/20 bg-amber-50/40 p-5 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-amber-800/70 uppercase tracking-wider">
                Pending Verifikasi
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-extrabold text-amber-950">
                  {stats.pending}
                </span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-[11px] text-amber-800/80">Menunggu persetujuan admin</p>
            </div>

            <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-brown-700/60 uppercase tracking-wider">
                Status Sistem
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`w-3 h-3 rounded-full ${
                    stats.systemStatus === "HEALTHY"
                      ? "bg-emerald-500"
                      : stats.systemStatus === "DEGRADED"
                      ? "bg-amber-500"
                      : "bg-stone-400"
                  }`}
                />
                <span className="font-serif text-xl font-bold text-brown-900">
                  {stats.systemStatus === "HEALTHY" ? "Aktif & Sehat" : "Terpantau"}
                </span>
              </div>
              <p className="text-[11px] text-brown-700/70">
                Terakhir sync: {stats.lastSyncAt ? new Date(stats.lastSyncAt).toLocaleTimeString("id-ID") : "Baru saja"}
              </p>
            </div>
          </div>

          {/* Quick Pending Approval Table (Preview 3 Teratas) */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-serif text-base font-bold text-brown-900">
                  Perlu Verifikasi Admin Cepat
                </h3>
                <p className="text-xs text-brown-700/70">
                  Artikel dengan relevansi kesehatan tinggi yang baru dikumpulkan oleh robot RSS
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("PENDING");
                  setSubTab("articles");
                }}
                className="text-xs font-bold text-[#3E7B54] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Pending</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {articles.filter((a) => a.status === "PENDING").length === 0 ? (
              <div className="py-8 text-center text-xs text-brown-700/60">
                Semua artikel telah ditinjau! Tidak ada artikel pending saat ini.
              </div>
            ) : (
              <div className="space-y-3">
                {articles
                  .filter((a) => a.status === "PENDING")
                  .slice(0, 3)
                  .map((art) => (
                    <div
                      key={art.id}
                      className="p-4 rounded-2xl border border-brown-900/10 bg-[#F5F8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Skor Relevansi {art.relevanceScore}/100
                          </span>
                          <span className="text-[10px] text-brown-700/60 font-medium">
                            {art.sourceName}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-brown-900 leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-brown-700/80 line-clamp-2">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={processingArticleId === art.id}
                          onClick={() => handleArticleAction(art.id, "APPROVE")}
                          className="px-3.5 py-1.5 rounded-xl bg-[#3E7B54] text-white font-bold text-xs hover:bg-[#326343] transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {processingArticleId === art.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Setujui</span>
                        </button>
                        <button
                          type="button"
                          disabled={processingArticleId === art.id}
                          onClick={() => handleArticleAction(art.id, "REJECT")}
                          className="px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ARTICLE MANAGEMENT */}
      {subTab === "articles" && (
        <div className="space-y-4">
          {/* Controls: Search & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-700/40" />
              <input
                type="text"
                placeholder="Cari artikel, topik, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchArticles()}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-brown-900/10 text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-white border border-brown-900/10 text-xs font-bold text-brown-900 focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Pending Review</option>
                <option value="PUBLISHED">Published (Tayang)</option>
                <option value="REJECTED">Ditolak</option>
                <option value="ARCHIVED">Diarsipkan</option>
              </select>

              {/* Filter Kategori */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-white border border-brown-900/10 text-xs font-bold text-brown-900 focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Daftar Kartu Artikel */}
          {loading ? (
            <div className="py-12 text-center text-xs text-brown-700/60">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#3E7B54]" />
              <span>Memuat artikel kesehatan...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center text-xs text-brown-700/60 bg-white rounded-3xl border border-brown-900/10">
              Tidak ada artikel yang sesuai kriteria pencarian.
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs hover:border-[#3E7B54]/30 transition-all flex flex-col lg:flex-row lg:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                          art.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-900"
                            : art.status === "PENDING"
                            ? "bg-amber-100 text-amber-900"
                            : art.status === "REJECTED"
                            ? "bg-red-100 text-red-900"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {art.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-brown-900/5 text-brown-800 font-semibold text-[10px]">
                        {art.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-brown-700/60 font-medium">
                        {art.sourceName} • {new Date(art.publishedAt).toLocaleDateString("id-ID")}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Relevance: {art.relevanceScore}%
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-brown-900 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-brown-700/80 leading-relaxed">
                      {art.excerpt}
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-[11px] text-brown-700/60">
                      <span>Estimasi baca: {art.readingTime} menit</span>
                      <span>•</span>
                      <a
                        href={art.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3E7B54] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Tautan Sumber Asli</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                    {art.status === "PUBLISHED" ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 w-full justify-center">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tayang</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={processingArticleId === art.id}
                        onClick={() => handleArticleAction(art.id, "APPROVE")}
                        className="px-3.5 py-1.5 rounded-xl bg-[#3E7B54] text-white font-bold text-xs hover:bg-[#326343] transition-all shadow-2xs flex items-center gap-1.5 w-full justify-center disabled:opacity-50"
                      >
                        {processingArticleId === art.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Publish</span>
                      </button>
                    )}

                    {art.status === "REJECTED" ? (
                      <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs flex items-center gap-1.5 w-full justify-center">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>Ditolak</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={processingArticleId === art.id}
                        onClick={() => handleArticleAction(art.id, "REJECT")}
                        className="px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition-all flex items-center gap-1.5 w-full justify-center disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(art)}
                      className="px-3.5 py-1.5 rounded-xl border border-brown-900/10 bg-white text-brown-800 font-bold text-xs hover:bg-brown-900/5 transition-all flex items-center gap-1 w-full justify-center"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id)}
                      className="px-3.5 py-1.5 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs transition-all flex items-center gap-1 w-full justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SOURCES MANAGEMENT */}
      {subTab === "sources" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-serif text-base font-bold text-brown-900">
                Pengelolaan Sumber RSS & Feed Kesehatan
              </h3>
              <p className="text-xs text-brown-700/70">
                Sumber otoritatif terpercaya yang dipindai secara berkala oleh ZYBA Bot
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAddSourceModal(true);
                setTestResult(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#3E7B54] text-white font-bold text-xs shadow-2xs hover:bg-[#326343] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sumber RSS</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        src.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {src.isActive ? "AKTIF" : "NONAKTIF"}
                    </span>
                    <span className="text-[10px] text-brown-700/60 font-medium">
                      Status: {src.lastStatus || "Siap"}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-brown-900">
                    {src.name}
                  </h4>

                  <p className="text-xs text-brown-700/70 break-all font-mono text-[11px] bg-[#F5F8F5] p-2 rounded-xl">
                    {src.url}
                  </p>
                </div>

                <div className="pt-2 border-t border-brown-900/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-brown-700/70">
                    <span>Artikel Ditarik: {src.totalFetched}</span>
                    <span>Disetujui: {src.totalApproved}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleToggleSource(src)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                        src.isActive
                          ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      {src.isActive ? "Nonaktifkan" : "Aktifkan"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSource(src.id)}
                      className="text-stone-400 hover:text-red-600 text-xs font-bold p-1 transition-colors"
                      title="Hapus Sumber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SYNC LOGS MANAGEMENT */}
      {subTab === "sync" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-serif text-base font-bold text-brown-900">
                Riwayat Sinkronisasi Berkala
              </h3>
              <p className="text-xs text-brown-700/70">
                Log audit setiap proses tarikan artikel oleh Vercel Cron maupun manual admin
              </p>
            </div>
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleTriggerSyncNow}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-500 text-brown-900 font-bold text-xs shadow-2xs hover:bg-orange-400 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Menyinkronkan..." : "Tarik Sekarang"}</span>
            </button>
          </div>

          <div className="rounded-3xl border border-brown-900/10 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brown-900">
                <thead className="bg-[#F5F8F5] text-brown-700/70 uppercase text-[10px] font-bold border-b border-brown-900/5">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Pemicu</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ditemukan</th>
                    <th className="px-4 py-3">Disimpan</th>
                    <th className="px-4 py-3">Ditolak</th>
                    <th className="px-4 py-3">Durasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brown-900/5">
                  {syncLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-brown-700/60">
                        Belum ada riwayat sinkronisasi tercatat.
                      </td>
                    </tr>
                  ) : (
                    syncLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-brown-900/2">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-brown-900/5 font-semibold text-[10px]">
                            {log.triggeredBy}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              log.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : log.status === "PARTIAL"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold">{log.articlesFound}</td>
                        <td className="px-4 py-3 font-bold text-emerald-700">+{log.articlesApproved}</td>
                        <td className="px-4 py-3 text-stone-500">{log.articlesRejected}</td>
                        <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{log.durationMs}ms</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ARTIKEL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-brown-900/10">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brown-900">
                Edit Metadata Artikel
              </h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="text-stone-400 hover:text-brown-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brown-900/15 text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1">
                  Ringkasan Original
                </label>
                <textarea
                  rows={4}
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brown-900/15 text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brown-900 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-brown-900/15 text-xs text-brown-900 focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.filter((c) => c.value !== "ALL").map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-brown-900 block mb-1">
                    Waktu Baca (Menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={editReadingTime}
                    onChange={(e) => setEditReadingTime(parseInt(e.target.value, 10) || 3)}
                    className="w-full px-3.5 py-2 rounded-xl border border-brown-900/15 text-xs text-brown-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-brown-900/10">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-brown-700 hover:bg-brown-900/5"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={savingEdit}
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-[#3E7B54] text-white text-xs font-bold hover:bg-[#326343] shadow-xs disabled:opacity-50"
              >
                {savingEdit ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH SUMBER RSS */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-brown-900/10">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brown-900">
                Tambah Sumber RSS Kesehatan Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSourceModal(false)}
                className="text-stone-400 hover:text-brown-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1">
                  Nama Penerbit / Organisasi
                </label>
                <input
                  type="text"
                  placeholder="Mis. WHO Mental Health Feed"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brown-900/15 text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1">
                  URL RSS / Atom Feed (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/feed.xml"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-brown-900/15 text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                  />
                  <button
                    type="button"
                    disabled={testingUrl || !newSourceUrl}
                    onClick={handleTestFeedUrl}
                    className="px-3 py-2 rounded-xl bg-brown-900/5 hover:bg-brown-900/10 text-brown-900 font-bold text-xs shrink-0 transition-colors disabled:opacity-50"
                  >
                    {testingUrl ? "Menguji..." : "Tes Feed"}
                  </button>
                </div>
              </div>

              {/* Feed Test Result Box */}
              {testResult && (
                <div
                  className={`p-3 rounded-2xl text-xs space-y-1.5 ${
                    testResult.success
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                      : "bg-red-50 border border-red-200 text-red-900"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {testResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>
                      {testResult.success
                        ? `Feed Valid: ${testResult.feedTitle} (${testResult.itemsCount} artikel ditemukan)`
                        : testResult.error}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-brown-900 block mb-1">
                  Kategori Default
                </label>
                <select
                  value={newSourceCategory}
                  onChange={(e) => setNewSourceCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brown-900/15 text-xs text-brown-900 focus:outline-none"
                >
                  {CATEGORY_OPTIONS.filter((c) => c.value !== "ALL").map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-brown-900/10">
              <button
                type="button"
                onClick={() => setShowAddSourceModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-brown-700 hover:bg-brown-900/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddSource}
                className="px-4 py-2 rounded-xl bg-[#3E7B54] text-white text-xs font-bold hover:bg-[#326343] shadow-xs"
              >
                Simpan Sumber
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
