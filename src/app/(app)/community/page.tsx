"use client";

import React, { useState, useEffect } from "react";
import { useCommunity } from "@/components/community/CommunityContext";
import { InlineComposer } from "@/components/community/InlineComposer";
import { PostCard, PostItem } from "@/components/community/PostCard";
import { CommunityWidgets } from "@/components/community/CommunityWidgets";
import { Mascot } from "@/components/ui/Mascot";
import {
  Search,
  Menu,
  Plus,
  Filter,
  Sparkles,
  ShieldAlert,
  X,
  Send,
} from "lucide-react";

export default function CommunityPage() {
  const {
    currentTab,
    setCurrentTab,
    currentTopic,
    setCurrentTopic,
    searchQuery,
    setSearchQuery,
    setIsMobileSidebarOpen,
    setIsFloatingComposeOpen,
    refreshKey,
    triggerRefresh,
    userName,
  } = useCommunity();

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Report Modal State
  const [reportingPost, setReportingPost] = useState<{
    postId: string;
    reportedUserId: string;
  } | null>(null);
  const [reportReason, setReportReason] = useState("inappropriate");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Fetch posts on tab, topic, or refreshKey change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg("");

    const params = new URLSearchParams();
    params.set("tab", currentTab);
    if (currentTopic) {
      params.set("topic", currentTopic);
    }

    fetch(`/api/community/posts?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal memuat feed komunitas");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setPosts(data.posts || []);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching community posts:", err);
        setErrorMsg("Gagal memuat postingan. Silakan coba kembali.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentTab, currentTopic, refreshKey]);

  // Handle Likes
  const handleLikeToggle = async (postId: string) => {
    await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
  };

  // Handle Bookmarks
  const handleBookmarkToggle = async (postId: string) => {
    await fetch(`/api/community/posts/${postId}/bookmark`, { method: "POST" });
  };

  // Open Report Modal
  const handleOpenReport = (postId: string, reportedUserId: string) => {
    setReportingPost({ postId, reportedUserId });
    setReportSuccess(false);
    setReportDetails("");
  };

  // Submit Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPost || isSubmittingReport) return;

    setIsSubmittingReport(true);
    try {
      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "POST",
          targetId: reportingPost.postId,
          postId: reportingPost.postId,
          reportedUserId: reportingPost.reportedUserId,
          reason: reportReason,
          details: reportDetails.trim(),
        }),
      });

      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportingPost(null);
          setReportSuccess(false);
        }, 1800);
      }
    } catch (err) {
      console.error("Gagal mengirim laporan:", err);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Filter posts by client-side search query
  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.content.toLowerCase().includes(q) ||
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.topicTag && p.topicTag.toLowerCase().includes(q)) ||
      p.authorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full flex gap-8 items-start justify-center">
      {/* Middle Feed Column (Maks 680px) */}
      <div className="flex-1 max-w-[680px] space-y-6 pb-20">
        {/* Feed Tab Filter Pill Bar (Convo inspired) */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-brown-900/10 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setCurrentTab("for-you");
                setCurrentTopic(undefined);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "for-you" && !currentTopic
                  ? "bg-[#3E7B54] text-white font-bold shadow-2xs"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Untuk Kamu (FYP)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTab("following");
                setCurrentTopic(undefined);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "following"
                  ? "bg-[#3E7B54] text-white font-bold shadow-2xs"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Mengikuti
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTab("saved");
                setCurrentTopic(undefined);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === "saved"
                  ? "bg-[#3E7B54] text-white font-bold shadow-2xs"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Disimpan
            </button>
          </div>

          {currentTopic && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-[#3E7B54] text-xs font-bold shrink-0">
              <span>Topik: #{currentTopic}</span>
              <button
                type="button"
                onClick={() => setCurrentTopic(undefined)}
                className="hover:opacity-75 p-0.5"
                aria-label="Hapus filter topik"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* 1. Inline Post Composer (Top of Feed) */}
        <InlineComposer userName={userName} onPostCreated={triggerRefresh} />

        {/* Error notification if any */}
        {errorMsg && (
          <div className="rounded-2xl border border-orange-500/20 bg-orange-50 p-4 text-xs text-brown-900">
            {errorMsg}
          </div>
        )}

        {/* 2. Feed Post List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-brown-900/10 bg-white p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brown-900/10" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-32 h-3.5 bg-brown-900/10 rounded-md" />
                    <div className="w-20 h-2.5 bg-brown-900/10 rounded-md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-4 bg-brown-900/10 rounded-md" />
                  <div className="w-full h-3 bg-brown-900/10 rounded-md" />
                  <div className="w-5/6 h-3 bg-brown-900/10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State: Mascot Zibi berdiri bebas TANPA kotak pembatas */
          <div className="py-12 px-4 text-center flex flex-col items-center">
            <Mascot
              pose="listening"
              size={140}
              animate={true}
              decorative={true}
              className="mb-4"
            />
            <h3 className="font-serif text-lg font-bold text-brown-900">
              Belum Ada Cerita di Bagian Ini
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-brown-700 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? `Tidak ditemukan cerita yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lain ya.`
                : currentTab === "saved"
                ? "Belum ada cerita yang kamu simpan. Simpan cerita hangat yang menyentuh hatimu saat berselancar."
                : "Jadilah yang pertama membuka ruang hangat ini dengan membagikan ceritamu hari ini."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
                onBookmarkToggle={handleBookmarkToggle}
                onReport={handleOpenReport}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Widgets (Desktop only) */}
      <CommunityWidgets onSelectTopic={(topic) => setCurrentTopic(topic)} />

      {/* Floating Quick Action Button "+" (Membuka floating compose card) */}
      <button
        id="floating-compose-button"
        type="button"
        onClick={() => setIsFloatingComposeOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-orange-500 text-brown-900 shadow-[0_8px_24px_rgba(242,136,75,0.4)] hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all"
        aria-label="Tulis Cerita Baru"
        title="Tulis Cerita Baru"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Modal Laporan Konten */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-brown-900/10 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brown-900/10">
              <div className="flex items-center gap-2 text-orange-950">
                <ShieldAlert className="h-5 w-5 text-orange-600" />
                <h4 className="font-serif text-base font-bold">
                  Laporkan Konten
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setReportingPost(null)}
                className="p-1 rounded-lg text-brown-700/60 hover:text-brown-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <p className="font-serif font-bold text-sm text-[#3E7B54]">
                  Terima kasih telah menjaga kehangatan komunitas.
                </p>
                <p className="text-xs text-brown-700">
                  Laporanmu telah diterima dan akan segera ditinjau oleh tim moderasi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1.5">
                    Alasan Laporan
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-brown-900/15 bg-cream/30 text-xs font-medium text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                  >
                    <option value="inappropriate">Konten tidak pantas / menyinggung</option>
                    <option value="harassment">Pelecehan atau perundungan</option>
                    <option value="spam">Spam atau promosi tidak relevan</option>
                    <option value="self_harm">Konten menyakiti diri / krisis</option>
                    <option value="other">Alasan lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1.5">
                    Keterangan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Bantu kami memahami situasi lebih rinci..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-brown-900/15 bg-cream/30 text-xs text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:border-[#3E7B54] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingPost(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-brown-700 hover:bg-cream"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-brown-900 font-bold text-xs shadow-xs"
                  >
                    {isSubmittingReport ? "Mengirim..." : "Kirim Laporan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

