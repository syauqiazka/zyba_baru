"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Send,
  ShieldAlert,
  Check,
  User,
  Sparkles,
} from "lucide-react";

export interface PostItem {
  id: string;
  userId: string;
  authorName: string;
  authorHandle: string;
  title?: string | null;
  content: string;
  topicTag?: string | null;
  isAnonymous: boolean;
  imageUrl?: string | null;
  audioUrl?: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface PostCardProps {
  post: PostItem;
  currentUserId?: string;
  onLikeToggle: (postId: string) => Promise<void>;
  onBookmarkToggle: (postId: string) => Promise<void>;
  onReport: (postId: string, reportedUserId: string) => void;
}

export function PostCard({
  post,
  currentUserId,
  onLikeToggle,
  onBookmarkToggle,
  onReport,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [commentText, setCommentText] = useState("");
  const [commentAnonymous, setCommentAnonymous] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    try {
      await onLikeToggle(post.id);
    } catch {
      // rollback on error
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleBookmark = async () => {
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    try {
      await onBookmarkToggle(post.id);
    } catch {
      setIsBookmarked(!nextBookmarked);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/community?post=${post.id}`);
      setCopied(true);
      setShowMenu(false);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      setShowComments(true);
      setIsLoadingComments(true);
      try {
        const res = await fetch(`/api/community/posts/${post.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Gagal memuat komentar:", err);
      } finally {
        setIsLoadingComments(false);
      }
    } else {
      setShowComments(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText.trim(),
          isAnonymous: commentAnonymous,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setCommentsCount((prev) => prev + 1);
        setCommentText("");
      }
    } catch (err) {
      console.error("Gagal mengirim komentar:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return "Baru saja";
      if (diffHours < 24) return `${diffHours}j lalu`;
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 7) return `${diffDays}h lalu`;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "Hari ini";
    }
  };

  const shouldTruncate = post.content.length > 220;

  return (
    <article className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)] transition-all hover:border-brown-900/20">
      {/* Top Header: Topic Tag & Timestamp & Menu */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          {post.topicTag && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#3E7B54] font-bold text-[11px]">
              #{post.topicTag}
            </span>
          )}
          <span className="text-brown-700/60 font-medium">
            • {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        {/* Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-brown-700/60 hover:text-brown-900 hover:bg-cream transition-colors"
            aria-label="Opsi postingan"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-2xl border border-brown-900/10 bg-white p-1.5 shadow-lg z-20 space-y-0.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-brown-900 hover:bg-cream text-left"
              >
                <Share2 className="h-3.5 w-3.5 text-brown-700" />
                <span>Salin Tautan</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onReport(post.id, post.userId);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-orange-950 hover:bg-orange-50 text-left"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-orange-600" />
                <span>Laporkan</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Author Row */}
      <div className="flex items-center gap-3 mb-3.5">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
          {post.isAnonymous ? (
            <Sparkles className="h-4 w-4" />
          ) : (
            post.authorName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-serif text-sm font-bold text-brown-900 truncate">
              {post.authorName}
            </h4>
            {post.isAnonymous && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-brown-900/5 text-brown-700 font-medium">
                Anonim
              </span>
            )}
          </div>
          <p className="text-[11px] text-brown-700/60 truncate">
            @{post.authorHandle}
          </p>
        </div>
      </div>

      {/* Post Title (If present) */}
      {post.title && (
        <h3 className="font-serif text-base sm:text-lg font-bold text-brown-900 mb-2 leading-snug">
          {post.title}
        </h3>
      )}

      {/* Post Content */}
      <div className="text-xs sm:text-sm text-brown-700 leading-relaxed space-y-2">
        <p className={!isExpanded && shouldTruncate ? "line-clamp-4" : ""}>
          {post.content}
        </p>

        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-[#3E7B54] hover:underline"
          >
            {isExpanded ? "Tutup kembali" : "Baca selengkapnya..."}
          </button>
        )}
      </div>

      {/* Toast Copied confirmation */}
      {copied && (
        <div className="my-2 p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          <span>Tautan postingan berhasil disalin!</span>
        </div>
      )}

      {/* Action Footer Bar (Target >= 44px) */}
      <div className="mt-5 pt-3.5 border-t border-brown-900/8 flex items-center justify-between text-xs font-semibold text-brown-700">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`min-h-[44px] px-3 rounded-full flex items-center gap-1.5 transition-all ${
              isLiked
                ? "text-orange-600 bg-orange-100/60"
                : "hover:bg-cream hover:text-brown-900"
            }`}
            aria-label={`Suka (${likesCount})`}
          >
            <Heart
              className={`h-4 w-4 transition-transform active:scale-125 ${
                isLiked ? "fill-orange-500 text-orange-500" : "stroke-[1.8]"
              }`}
            />
            <span>{likesCount}</span>
          </button>

          {/* Comment Toggle Button */}
          <button
            type="button"
            onClick={toggleComments}
            className={`min-h-[44px] px-3 rounded-full flex items-center gap-1.5 transition-all ${
              showComments
                ? "text-[#3E7B54] bg-emerald-50"
                : "hover:bg-cream hover:text-brown-900"
            }`}
            aria-label={`Komentar (${commentsCount})`}
          >
            <MessageCircle className="h-4 w-4 stroke-[1.8]" />
            <span>{commentsCount}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`min-h-[44px] px-3 rounded-full flex items-center gap-1.5 transition-all ${
              isBookmarked
                ? "text-[#3E7B54] bg-emerald-50"
                : "hover:bg-cream hover:text-brown-900"
            }`}
            aria-label="Simpan postingan"
          >
            <Bookmark
              className={`h-4 w-4 ${
                isBookmarked ? "fill-[#3E7B54] text-[#3E7B54]" : "stroke-[1.8]"
              }`}
            />
            <span className="hidden sm:inline">Simpan</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="min-h-[44px] px-3 rounded-full flex items-center gap-1.5 hover:bg-cream hover:text-brown-900 transition-colors"
          aria-label="Bagikan cerita"
        >
          <Share2 className="h-4 w-4 stroke-[1.8]" />
          <span className="hidden sm:inline">Bagikan</span>
        </button>
      </div>

      {/* Inline Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-brown-900/10 space-y-4">
          <h5 className="font-serif text-xs font-bold text-brown-900">
            Daftar Komentar ({commentsCount})
          </h5>

          {/* Comment List */}
          {isLoadingComments ? (
            <div className="py-4 text-center text-xs text-brown-700/60">
              Memuat tanggapan hangat...
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-brown-700/60 py-2">
              Belum ada komentar. Jadilah yang pertama memberikan kata-kata hangat!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl bg-cream/50 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brown-900">
                      {comment.authorName}
                    </span>
                    <span className="text-[10px] text-brown-700/50">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-brown-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Input Form */}
          <form onSubmit={handleSendComment} className="pt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis tanggapan empatismu..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-brown-900/15 bg-cream/40 text-xs text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !commentText.trim()}
                className="h-10 px-4 rounded-xl bg-[#3E7B54] hover:bg-[#346B48] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
              <label className="flex items-center gap-1.5 text-[11px] text-brown-700/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={commentAnonymous}
                  onChange={(e) => setCommentAnonymous(e.target.checked)}
                  className="rounded text-[#3E7B54] focus:ring-0"
                />
                <span>Komentar sebagai Anonim</span>
              </label>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}

