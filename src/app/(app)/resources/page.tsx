"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AudioRelaxPlayer } from "@/components/wellness/AudioRelaxPlayer";
import { ResourceArticle, SEED_RESOURCES, RELAXATION_AUDIO_TRACKS } from "@/backend/db/resourceRepo";
import { Mascot } from "@/components/ui/Mascot";
import {
  ArrowLeft,
  Search,
  Clock,
  ArrowRight,
  Share2,
  Heart,
  Check,
  Sparkles,
  BookOpen,
  Filter,
  X,
  ShieldAlert,
  MessageCircle,
  ChevronUp,
  Volume2,
  Calendar,
  Compass,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Semua Kategori" },
  { id: "MENTAL_HEALTH", label: "Mental Health" },
  { id: "EMOTIONAL_WELLNESS", label: "Emotional Wellness" },
  { id: "MINDFULNESS", label: "Mindfulness" },
  { id: "SELF_CARE", label: "Self Care" },
  { id: "SLEEP_AND_REST", label: "Kualitas Tidur" },
  { id: "PHYSICAL_WELLNESS", label: "Kebugaran Fisik" },
  { id: "RELATIONSHIPS", label: "Hubungan Sosial" },
  { id: "PERSONAL_DEVELOPMENT", label: "Pengembangan Diri" },
];

const DURATION_FILTERS = [
  { id: "all", label: "Semua Durasi" },
  { id: "short", label: "< 3 Menit" },
  { id: "medium", label: "3 - 4 Menit" },
  { id: "long", label: "≥ 5 Menit" },
];

function cleanText(val?: string | null): string {
  if (!val) return "";
  let text = val
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&bull;/g, "•")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/?[^>]+(>|$)/g, "");

  return text.trim();
}

export default function ResourcesPage() {
  const [articles, setArticles] = useState<any[]>(SEED_RESOURCES);
  const [audioTracks, setAudioTracks] = useState<any[]>(RELAXATION_AUDIO_TRACKS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Detail view state: ID artikel yang sedang dibaca (Foto 2)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Feedback states
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    "res-1": 42,
    "res-2": 38,
    "res-3": 54,
    "res-4": 61,
    "res-5": 29,
    "res-6": 47,
  });
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync dengan query param URL (?article=res-X) pada initial mount dan fetch data dinamis
  useEffect(() => {
    async function loadResources() {
      try {
        setLoading(true);
        const res = await fetch("/api/resources");
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            const cleaned = data.articles.map((art: any) => ({
              ...art,
              title: cleanText(art.title),
              subtitle: art.subtitle ? cleanText(art.subtitle) : null,
              snippet: cleanText(art.snippet),
              body: cleanText(art.body),
            }));
            setArticles(cleaned);
            if (typeof window !== "undefined") {
              const urlParams = new URLSearchParams(window.location.search);
              const articleParam = urlParams.get("article");
              if (articleParam) {
                const found = cleaned.find((a: any) => a.id === articleParam);
                if (found) {
                  setSelectedArticleId(articleParam);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("Gagal fetch artikel dinamis:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  // Update progress bar ketika membaca artikel di Foto 2
  useEffect(() => {
    const handleScroll = () => {
      if (!selectedArticleId) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedArticleId]);

  // Buka artikel detail (Foto 2)
  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("article", id);
      window.history.pushState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Kembali ke katalog artikel (Foto 1)
  const handleBackToCatalog = () => {
    setSelectedArticleId(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("article");
      window.history.pushState({}, "", url.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleLike = (id: string) => {
    setLikedArticles((prev) => {
      const current = !!prev[id];
      setLikeCounts((counts) => ({
        ...counts,
        [id]: (counts[id] || 0) + (current ? -1 : 1),
      }));
      return { ...prev, [id]: !current };
    });
  };

  const copyArticleLink = (id: string) => {
    if (typeof window !== "undefined") {
      const link = `${window.location.origin}/resources?article=${id}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter artikel di katalog
  const filteredArticles = articles.filter((a) => {
    if (selectedCategory !== "all" && a.category !== selectedCategory) {
      return false;
    }
    if (durationFilter === "short" && a.readTimeMin >= 3) return false;
    if (durationFilter === "medium" && (a.readTimeMin < 3 || a.readTimeMin > 4)) return false;
    if (durationFilter === "long" && a.readTimeMin < 5) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSnippet = a.snippet.toLowerCase().includes(q);
      const matchBody = a.body.toLowerCase().includes(q);
      const matchTag = Boolean(a.tags && Array.isArray(a.tags) && a.tags.some((t: string) => t.toLowerCase().includes(q)));
      if (!matchTitle && !matchSnippet && !matchBody && !matchTag) return false;
    }
    return true;
  });

  // Featured article: artikel pertama jika filter default
  const featuredArticle =
    selectedCategory === "all" && durationFilter === "all" && !searchQuery.trim()
      ? filteredArticles[0]
      : null;
  const gridArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles;

  // Artikel yang sedang dibuka di halaman detail (Foto 2)
  const currentArticle = selectedArticleId
    ? articles.find((a) => a.id === selectedArticleId) || articles[0]
    : null;

  // Rekomendasi artikel terkait di sidebar halaman detail
  const relatedArticles = currentArticle
    ? articles
        .filter((a) => a.id !== currentArticle.id)
        .slice(0, 2)
    : [];

  return (
    <div className="min-h-screen bg-[#F5F8F5] text-brown-900 pb-24">
      {/* 1. TOP GLOBAL NAVIGATION BAR (Persis seperti Companion & Komunitas) */}
      <header className="sticky top-0 z-50 w-full bg-[#F5F8F5]/95 backdrop-blur-md border-b border-brown-900/10 shadow-2xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between gap-4">
          {/* Sisi Kiri: Tombol Kembali ke Dashboard Utama + Brand ZYBA Wawasan */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-brown-900/10 bg-white text-xs font-semibold text-brown-800 hover:bg-brown-50 hover:border-brown-900/20 transition-all shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-brown-600" />
              <span>Menu Utama ZYBA</span>
              <span className="hidden sm:inline text-brown-600 font-normal">| Dashboard</span>
            </Link>

            <div className="h-5 w-[1px] bg-brown-900/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-serif font-black tracking-tight text-brown-900 text-base">
                ZYBA
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-[#3E7B54] text-[10px] font-bold tracking-wider uppercase">
                Wawasan
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Status Wawasan & Kontak Bantuan Krisis */}
          <div className="flex items-center gap-3">
            <Link
              href="/guidebook"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brown-600 hover:text-brown-900 transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-orange-600" />
              <span>Bantuan Krisis 24/7</span>
            </Link>

            <Link
              href="/companion"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#3E7B54] text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Teman Zibi AI</span>
            </Link>
          </div>
        </div>

        {/* Scroll Progress Bar ketika membaca artikel di Foto 2 */}
        {selectedArticleId && (
          <div className="w-full h-1 bg-brown-900/5">
            <div
              className="h-full bg-[#3E7B54] transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* TAMPILAN FOTO 2: HALAMAN BACA DETAIL ARTIKEL (Single Article Full View)    */}
      {/* ========================================================================= */}
      {currentArticle ? (
        <article className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 md:pt-12">
          {/* Sub-Header Navigasi Artikel */}
          <div className="flex items-center justify-between pb-6 border-b border-brown-900/10 mb-8">
            <button
              type="button"
              onClick={handleBackToCatalog}
              className="inline-flex items-center gap-2 text-xs font-bold text-brown-700 hover:text-brown-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 text-brown-500 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Jelajah Wawasan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFontSize((f) => (f === "normal" ? "large" : "normal"))}
                className="px-2.5 py-1 rounded-lg border border-brown-900/10 bg-white text-xs font-bold text-brown-700 hover:bg-brown-50 transition-colors"
                title="Sesuaikan ukuran teks baca"
              >
                {fontSize === "normal" ? "Teks A+" : "Teks A"}
              </button>
              <button
                type="button"
                onClick={() => copyArticleLink(currentArticle.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-brown-900/10 bg-white text-xs font-bold text-brown-700 hover:bg-brown-50 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copied ? "Tautan Tersalin" : "Bagikan"}</span>
              </button>
            </div>
          </div>

          {/* Article Header (Editorial Layout persis Foto 2) */}
          <header className="space-y-4 max-w-4xl mx-auto text-center pb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brown-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>Ditinjau oleh Tim Psikologi ZYBA • {currentArticle.publishedAt || "14 November 2026"}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight leading-[1.2]">
              {cleanText(currentArticle.title)}
            </h1>

            {currentArticle.subtitle && (
              <p className="text-base sm:text-lg text-brown-700 max-w-2xl mx-auto leading-relaxed">
                {cleanText(currentArticle.subtitle)}
              </p>
            )}

            {/* Category Pills (Persis Foto 2) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {(currentArticle.tags || [currentArticle.categoryLabel]).map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3.5 py-1 rounded-full text-xs font-bold bg-white border border-brown-900/10 text-brown-800 shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Widescreen Hero Image (Persis Foto 2) */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl sm:rounded-4xl overflow-hidden border border-brown-900/10 shadow-sm bg-brown-900/5">
              <img
                src={currentArticle.imageUrl || "/images/resources/res-1-lifestyle.svg"}
                alt={currentArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-xs text-brown-600 mt-2.5 italic">
              Ilustrasi suaka reflektif ZYBA — Ruang hening untuk menjernihkan pikiran dan menyelaraskan ritme diri.
            </p>
          </div>

          {/* Editorial Article Body & Sidebar Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Kolom Konten Utama (8 Kolom) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Introduction Lead */}
              <div
                className={`text-brown-800 leading-relaxed font-sans ${
                  fontSize === "large" ? "text-lg" : "text-base sm:text-lg"
                }`}
              >
                <p className="font-medium text-brown-900 leading-relaxed first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:leading-none first-letter:text-[#3E7B54]">
                  {currentArticle.snippet}
                </p>
              </div>

              {/* Pull Quote Editorial (Persis Foto 2) */}
              {currentArticle.pullQuote && (
                <div className="my-8 rounded-3xl border-l-4 border-l-[#3E7B54] border border-brown-900/10 bg-white p-6 sm:p-8 shadow-2xs">
                  <blockquote className="font-serif italic text-lg sm:text-xl text-brown-900 leading-relaxed mb-4">
                    &ldquo;{currentArticle.pullQuote.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3 pt-2 border-t border-brown-900/10">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[#3E7B54] font-bold text-xs shrink-0">
                      {currentArticle.pullQuote.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brown-900">{currentArticle.pullQuote.author}</h4>
                      <p className="text-[11px] text-brown-600">{currentArticle.pullQuote.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Body Text */}
              <div
                className={`space-y-6 text-brown-800 leading-relaxed font-sans ${
                  fontSize === "large" ? "text-lg" : "text-base"
                }`}
              >
                {cleanText(currentArticle.body)
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((par: string, pIdx: number) => {
                    // Cek apakah paragraf adalah poin bernomor atau bullet
                    if (par.startsWith("1.") || par.startsWith("-") || par.startsWith("•")) {
                      return (
                        <div key={pIdx} className="space-y-4 my-6 pl-1">
                          {par.split("\n").map((line: string, lIdx: number) => (
                            <div key={lIdx} className="flex items-start gap-3.5">
                              <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                {lIdx + 1}
                              </span>
                              <p className="text-sm sm:text-base text-brown-800 leading-relaxed flex-1">
                                {line.replace(/^[0-9]\.\s*/, "").replace(/^[-•]\s*/, "")}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p key={pIdx} className="leading-relaxed">
                        {par}
                      </p>
                    );
                  })}
              </div>

              {/* Bagian Penutup / Conclusion */}
              <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/50 p-6 sm:p-7 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3E7B54]">
                  <Sparkles className="h-4 w-4" />
                  <span>Pengingat Lembut Hari Ini</span>
                </div>
                <p className="text-sm text-brown-800 leading-relaxed">
                  Tidak ada tuntutan untuk menyelesaikan segalanya hari ini. Ambil satu napas panjang, akui usahamu yang sudah berjalan sejauh ini, dan izinkan tubuhmu untuk beristirahat.
                </p>
              </div>

              {/* Sumber Asli & Atribusi */}
              {currentArticle.sourceUrl && (
                <div className="rounded-2xl border border-brown-900/10 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-brown-700/60 block">
                      Sumber Publikasi Asli
                    </span>
                    <span className="font-bold text-brown-900">
                      {currentArticle.author || "Penerbit Terpercaya"}
                    </span>
                  </div>
                  <a
                    href={currentArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E7B54] text-white font-bold text-xs hover:bg-[#326343] transition-colors self-start sm:self-auto"
                  >
                    <span>Buka Artikel Asli</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Disclaimer Medis Edukatif */}
              <div className="rounded-2xl border border-brown-900/10 bg-amber-50/60 p-4 text-xs text-amber-950 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Catatan Suaka ZYBA:</strong> Seluruh artikel dan wawasan yang dihadirkan di suaka ini bertujuan untuk edukasi dan pendampingan kesejahteraan batin. Konten ini bukan pengganti diagnosis medis, terapi klinis, atau konsultasi tenaga profesional kesehatan mental.
                </p>
              </div>

              {/* Article Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-brown-900/10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleLike(currentArticle.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold transition-all shadow-2xs ${
                      likedArticles[currentArticle.id]
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-brown-900/10 bg-white text-brown-700 hover:bg-brown-50"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedArticles[currentArticle.id] ? "fill-orange-500 text-orange-500" : ""
                      }`}
                    />
                    <span>
                      {likedArticles[currentArticle.id] ? "Disukai" : "Membantu"} (
                      {likeCounts[currentArticle.id] || 0})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyArticleLink(currentArticle.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-brown-900/10 bg-white text-xs font-bold text-brown-700 hover:bg-brown-50 transition-all shadow-2xs"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                    <span>{copied ? "Tautan Tersalin" : "Bagikan Wawasan"}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brown-600 hover:text-brown-900 transition-colors"
                >
                  <ChevronUp className="h-4 w-4" />
                  <span>Kembali ke Atas</span>
                </button>
              </div>
            </div>

            {/* Kolom Samping Artikel (4 Kolom) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Card Curhat ke Zibi AI Terkait Topik Ini */}
              <div className="rounded-3xl border border-emerald-900/10 bg-white p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Mascot pose="happy" size={60} animate={false} decorative={true} />
                  <div>
                    <h3 className="font-serif text-sm font-bold text-brown-900">Curhat ke Zibi</h3>
                    <p className="text-[11px] text-brown-600">Sahabat Mindful ZYBA</p>
                  </div>
                </div>
                <p className="text-xs text-brown-700 leading-relaxed">
                  Ingin mendiskusikan apa yang baru saja kamu baca atau membagikan perasaanmu hari ini?
                </p>
                <Link
                  href="/companion"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#3E7B54] text-white text-xs font-bold hover:bg-[#2D5E3F] transition-all shadow-2xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Mulai Obrolan Tenang</span>
                </Link>
              </div>

              {/* Card Bantuan Krisis */}
              <div className="rounded-3xl border border-orange-500/20 bg-orange-50/60 p-6 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-700">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Pusat Bantuan Krisis 24/7</span>
                </div>
                <p className="text-xs text-brown-800 leading-relaxed">
                  Jika beban batin terasa terlalu berat untuk ditanggung sendiri, bantuan profesional bebas pulsa tersedia sepanjang waktu.
                </p>
                <div className="pt-1">
                  <a
                    href="tel:119"
                    className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-orange-500 text-brown-900 font-bold text-xs hover:bg-orange-400 transition-colors shadow-2xs"
                  >
                    Hubungi Hotline Darurat 119
                  </a>
                </div>
              </div>

              {/* Card Artikel Rekomendasi Terkait */}
              <div className="rounded-3xl border border-brown-900/10 bg-white p-6 space-y-4 shadow-sm">
                <h3 className="font-serif text-sm font-bold text-brown-900">Wawasan Lainnya</h3>
                <div className="space-y-4 divide-y divide-brown-900/5">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => handleOpenArticle(rel.id)}
                      className="pt-3.5 first:pt-0 cursor-pointer group flex items-start gap-3"
                    >
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                        <img
                          src={rel.imageUrl || "/images/resources/res-1-lifestyle.svg"}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E7B54] block">
                          {rel.categoryLabel}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-brown-600">
                          <Clock className="h-3 w-3" />
                          <span>{rel.readTimeMin} menit baca</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </article>
      ) : (
        /* ========================================================================= */
        /* TAMPILAN FOTO 1: KATALOG UTAMA WAWASAN (Browse Our Resources Layout)       */
        /* ========================================================================= */
        <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 md:pt-12 space-y-10">
          {/* Hero Header Section (Persis Foto 1) */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#3E7B54] text-xs font-bold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Wawasan & Suaka Batin</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight">
              Jelajahi Wawasan Sehat ZYBA
            </h1>

            <p className="text-sm sm:text-base text-brown-700 leading-relaxed">
              Panduan hangat, berbasis psikologi positif dan suaka batin, untuk menavigasi dinamika mental generasi muda tanpa beban.
            </p>
          </div>

          {/* Two-Column Layout (Persis Foto 1: Kolom Kiri Filter & Kolom Kanan Grid Artikel) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            {/* --------------------------------------------------------------------- */}
            {/* KOLOM KIRI (Sidebar Filter & Kategori, lebar 3.5 kolom / ~280px)      */}
            {/* --------------------------------------------------------------------- */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-brown-900/10 bg-white p-6 space-y-6 shadow-sm">
                {/* 1. Input Pencarian Artikel (Persis Foto 1: Label Search Article) */}
                <div className="space-y-2">
                  <label htmlFor="search-input" className="block text-xs font-bold text-brown-900 tracking-wide uppercase">
                    Pencarian Artikel
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-400" />
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari topik atau kata kunci..."
                      className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-brown-900/10 bg-brown-50/50 text-xs text-brown-900 placeholder:text-brown-600 focus:outline-none focus:ring-2 focus:ring-[#3E7B54]/30 focus:border-[#3E7B54] transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700 p-0.5"
                        aria-label="Hapus kata kunci pencarian"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Filter Durasi Baca (Persis Foto 1: Filter Select Dropdown) */}
                <div className="space-y-2">
                  <label htmlFor="duration-select" className="block text-xs font-bold text-brown-900 tracking-wide uppercase">
                    Filter Waktu Baca
                  </label>
                  <div className="relative">
                    <select
                      id="duration-select"
                      value={durationFilter}
                      onChange={(e) => setDurationFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-brown-900/10 bg-brown-50/50 text-xs font-medium text-brown-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3E7B54]/30 focus:border-[#3E7B54] transition-all cursor-pointer"
                    >
                      {DURATION_FILTERS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brown-400 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Browse By Categories (Persis Foto 1: Vertical List with Active Indicator) */}
                <div className="space-y-3 pt-2 border-t border-brown-900/10">
                  <span className="block text-xs font-bold text-brown-900 tracking-wide uppercase">
                    Kategori Wawasan
                  </span>
                  <nav className="space-y-1" aria-label="Kategori Wawasan">
                    {CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      const count =
                        cat.id === "all"
                          ? articles.length
                          : articles.filter((a) => a.category === cat.id).length;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all text-left ${
                            isActive
                              ? "bg-[#3E7B54] text-white font-bold shadow-2xs"
                              : "text-brown-700 hover:bg-brown-50 hover:text-brown-900 font-medium"
                          }`}
                        >
                          <span className="truncate">{cat.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                              isActive ? "bg-white/20 text-white" : "bg-brown-900/5 text-brown-500"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* 4. Audio Relax Player (Sound Bath Binaural Generator) */}
              <div className="rounded-3xl border border-emerald-900/10 bg-white p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3E7B54]">
                  <Volume2 className="h-4 w-4" />
                  <span>Audio Relaksasi & Gelombang Batin</span>
                </div>
                <AudioRelaxPlayer tracks={audioTracks} />
              </div>

              {/* 5. Banner Hotline Bantuan Krisis */}
              <div className="rounded-3xl border border-orange-500/20 bg-orange-50/70 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-700">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Bantuan Krisis 24/7</span>
                </div>
                <p className="text-xs text-brown-700 leading-relaxed">
                  Sedang berada di titik nadir? Hotline 119 siap menemani kapan pun kamu butuh suaka.
                </p>
                <Link
                  href="/guidebook"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:text-orange-800"
                >
                  <span>Buka Direktori Bantuan</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </aside>

            {/* --------------------------------------------------------------------- */}
            {/* KOLOM KANAN (Grid Artikel & Featured Card, lebar 8-9 kolom)           */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-8">
              {filteredArticles.length === 0 ? (
                /* Empty State jika filter/pencarian tidak ditemukan */
                <div className="rounded-3xl border border-brown-900/10 bg-white p-12 text-center space-y-4 shadow-sm">
                  <Mascot pose="listening" size={130} animate={false} decorative={true} className="mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-brown-900">
                    Tidak Menemukan Wawasan yang Cocok
                  </h3>
                  <p className="text-xs text-brown-600 max-w-sm mx-auto">
                    Coba sesuaikan kata kunci pencarian atau pilih kategori &ldquo;Semua Kategori&rdquo; untuk membaca topik lainnya.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setDurationFilter("all");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#3E7B54] text-white text-xs font-bold hover:bg-[#2D5E3F] transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <>
                  {/* A. FEATURED ARTICLE HERO CARD (Foto 1: Gambar langsung di kiri, teks di kanan — Tanpa kotak luar) */}
                  {featuredArticle && (
                    <div
                      onClick={() => handleOpenArticle(featuredArticle.id)}
                      className="group cursor-pointer grid grid-cols-1 sm:grid-cols-12 gap-7 sm:gap-9 items-center pb-10 border-b border-brown-900/10"
                    >
                      {/* Gambar Sisi Kiri Hero Langsung (Tanpa kotak luar pembungkus) */}
                      <div className="sm:col-span-6 aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xs">
                        <img
                          src={featuredArticle.imageUrl || "/images/resources/res-1-lifestyle.svg"}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Konten Sisi Kanan Hero Langsung */}
                      <div className="sm:col-span-6 space-y-3.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#3E7B54] text-[10px] font-bold tracking-wider uppercase">
                            Pilihan Utama
                          </span>
                          <span className="text-[11px] font-semibold text-brown-600">
                            {featuredArticle.categoryLabel}
                          </span>
                        </div>

                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors leading-tight">
                          {featuredArticle.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-brown-700 leading-relaxed line-clamp-3">
                          {featuredArticle.snippet}
                        </p>

                        <div className="flex items-center justify-between pt-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#3E7B54] font-bold text-xs">
                              ZY
                            </div>
                            <div className="text-xs">
                              <span className="font-bold text-brown-900 block">{featuredArticle.author}</span>
                              <span className="text-brown-600">{featuredArticle.readTimeMin} menit baca</span>
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3E7B54] group-hover:translate-x-1 transition-transform">
                            <span>Baca Artikel</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* B. 2/3-COLUMN ARTICLE GRID (Foto 1: Gambar langsung di atas, teks langsung di bawah — Bebas kotak bertumpuk) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                    {gridArticles.map((art) => (
                      <article
                        key={art.id}
                        onClick={() => handleOpenArticle(art.id)}
                        className="group cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3.5">
                          {/* Gambar langsung di atas (tanpa kotak pembungkus kartu) */}
                          <div className="w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xs">
                            <img
                              src={art.imageUrl || "/images/resources/res-1-lifestyle.svg"}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Kategori Tag & Durasi Baca */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E7B54]">
                              {art.categoryLabel}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-brown-600 font-medium">
                              <Clock className="h-3 w-3" />
                              <span>{art.readTimeMin} menit baca</span>
                            </div>
                          </div>

                          {/* Judul Artikel */}
                          <h3 className="font-serif text-lg font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors leading-snug line-clamp-2">
                            {art.title}
                          </h3>

                          {/* Cuplikan Teks Ringkas */}
                          <p className="text-xs sm:text-sm text-brown-700 leading-relaxed line-clamp-2">
                            {art.snippet}
                          </p>
                        </div>

                        {/* Footer Meta: Penulis + Panah Tautan */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-[10px]">
                              {art.author.slice(0, 1)}
                            </div>
                            <span className="text-xs font-semibold text-brown-800 truncate max-w-[150px]">
                              {art.author}
                            </span>
                          </div>

                          <div className="text-brown-500 group-hover:text-[#3E7B54] group-hover:translate-x-1 transition-all">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
