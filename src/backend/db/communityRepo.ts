/**
 * ZYBA Community Database Repository
 * Menghubungkan ke Prisma communityDb dengan in-memory fallback transparan
 * ketika PostgreSQL offline di development atau testing.
 * Memenuhi spesifikasi AGENTS.md Bagian 7.6 & DESIGN.md
 */

import { communityDb } from "./communityClient";
import { detectRisk } from "@/lib/crisisDetection";

export interface CommunityPostRecord {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string | null;
  authorHandle: string;
  title?: string | null;
  content: string;
  topicTag?: string | null;
  isAnonymous: boolean;
  imageUrl?: string | null;
  audioUrl?: string | null;
  audioDurationSec?: number | null;
  stickerId?: string | null;
  isHidden: boolean;
  commentsDisabled: boolean;
  likesCount: number;
  commentsCount: number;
  likedBy: Set<string>;
  bookmarkedBy: Set<string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityCommentRecord {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string | null;
  authorHandle: string;
  content: string;
  isAnonymous: boolean;
  stickerId?: string | null;
  parentId?: string | null;
  isHidden: boolean;
  createdAt: Date;
}

export interface CommunityReportRecord {
  id: string;
  reporterId: string;
  targetType: "POST" | "COMMENT";
  targetId: string;
  postId?: string | null;
  reportedUserId: string;
  reason: string;
  details?: string | null;
  status: "PENDING" | "REVIEWING" | "ACTION_TAKEN" | "DISMISSED";
  createdAt: Date;
}

// Global in-memory store for fallback in development/test
const globalStore = globalThis as unknown as {
  _memCommunityPosts?: Map<string, CommunityPostRecord>;
  _memCommunityComments?: Map<string, CommunityCommentRecord>;
  _memCommunityReports?: Map<string, CommunityReportRecord>;
};

if (!globalStore._memCommunityPosts) {
  globalStore._memCommunityPosts = new Map();
  // Seed 4 authentic representative wellness posts (AGENTS.md Bagian 7.6)
  const seedPosts: CommunityPostRecord[] = [
    {
      id: "post_seed_1",
      userId: "user_seed_syauqi",
      authorName: "Syauqi",
      authorHandle: "syauqi",
      title: "Belajar Menerima Hari-Hari yang Lambat",
      content:
        "Hari ini saya memutuskan untuk berhenti memaksakan diri menyelesaikan semua to-do list. Terkadang, memberi ruang jeda untuk bernapas dan meminum teh hangat jauh lebih menyembuhkan daripada terus berlari mengejar kesempurnaan. Siapa di sini yang juga sedang belajar berdamai dengan ritme diri?",
      topicTag: "Pikiran Tenang",
      isAnonymous: false,
      isHidden: false,
      commentsDisabled: false,
      likesCount: 18,
      commentsCount: 3,
      likedBy: new Set(["user_seed_nadia", "user_seed_dimas"]),
      bookmarkedBy: new Set(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: "post_seed_2",
      userId: "user_seed_nadia",
      authorName: "Nadia Larasati",
      authorHandle: "nadialaras",
      title: "Tips Sederhana saat Overthinking Datang Menjelang Tidur",
      content:
        "Kalau pikiran mulai riuh saat malam hari, biasanya aku mencoba teknik Brain Dump: menuliskan semua kekhawatiran di selembar kertas kecil, lalu menutupnya dengan komitmen 'Ini urusan besok pagi, sekarang tubuhku berhak istirahat'. Dipadukan dengan nafas 4-7-8, terasa jauh lebih lega dan damai.",
      topicTag: "Overthinking",
      isAnonymous: false,
      isHidden: false,
      commentsDisabled: false,
      likesCount: 24,
      commentsCount: 5,
      likedBy: new Set(["user_seed_syauqi"]),
      bookmarkedBy: new Set(["user_seed_syauqi"]),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7), // 7 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
    },
    {
      id: "post_seed_3",
      userId: "user_seed_anon_1",
      authorName: "Teman Berkelana",
      authorHandle: "anonim",
      title: "Secangkir Ketenangan di Pagi yang Teduh",
      content:
        "Hanya ingin berbagi rasa syukur kecil hari ini: udara pagi yang sejuk setelah gerimis semalam dan sempat menyapa diri sendiri di cermin dengan hangat. Hal sederhana apa yang membuat hatimu sedikit lebih nyaman hari ini?",
      topicTag: "Lingkar Syukur",
      isAnonymous: true,
      isHidden: false,
      commentsDisabled: false,
      likesCount: 31,
      commentsCount: 4,
      likedBy: new Set(),
      bookmarkedBy: new Set(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14), // 14 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
    },
    {
      id: "post_seed_4",
      userId: "user_seed_dimas",
      authorName: "Dimas Anggara",
      authorHandle: "dimasang",
      title: "Memulihkan Baterai Sosial yang Habis",
      content:
        "Sebagai seorang yang cepat lelah di lingkungan bising, aku menyadari bahwa menolak ajakan kumpul saat tenaga terkuras bukanlah kesalahan. Jiwa kita butuh suaka untuk kembali mengisi daya. Jangan lupa luangkan waktu berkualitas untuk dirimu sendiri akhir pekan ini.",
      topicTag: "Kisah Pulih",
      isAnonymous: false,
      isHidden: false,
      commentsDisabled: false,
      likesCount: 15,
      commentsCount: 2,
      likedBy: new Set(),
      bookmarkedBy: new Set(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ];

  for (const post of seedPosts) {
    globalStore._memCommunityPosts.set(post.id, post);
  }
}

if (!globalStore._memCommunityComments) {
  globalStore._memCommunityComments = new Map();
  // Seed sample comments
  const seedComments: CommunityCommentRecord[] = [
    {
      id: "comment_seed_1",
      postId: "post_seed_1",
      userId: "user_seed_nadia",
      authorName: "Nadia Larasati",
      authorHandle: "nadialaras",
      content: "Sangat relate! Kadang kita lupa kalau jeda itu sendiri adalah bentuk kemajuan.",
      isAnonymous: false,
      isHidden: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "comment_seed_2",
      postId: "post_seed_1",
      userId: "user_seed_anon_2",
      authorName: "Teman Berkelana",
      authorHandle: "anonim",
      content: "Terima kasih sudah mengingatkan. Hari ini terasa berat tapi membaca tulisan ini bikin tenang.",
      isAnonymous: true,
      isHidden: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    },
  ];
  for (const c of seedComments) {
    globalStore._memCommunityComments.set(c.id, c);
  }
}

if (!globalStore._memCommunityReports) {
  globalStore._memCommunityReports = new Map();
}

const memPosts = globalStore._memCommunityPosts!;
const memComments = globalStore._memCommunityComments!;
const memReports = globalStore._memCommunityReports!;

/**
 * Algoritma Penilaian Personal (FYP Mindful Ranking)
 * Menyesuaikan feed setiap pengguna berdasarkan afinitas topik, interaksi,
 * waktu posting, dan variasi keberagaman agar tidak monoton.
 */
function calculateFypScore(post: any, userId: string, userLikedTopics: Set<string>): number {
  let score = 100;

  // 1. Afinitas Topik Personal (+35 poin jika menyukai topik serupa)
  if (post.topicTag && userLikedTopics.has(post.topicTag.toLowerCase())) {
    score += 35;
  }

  // 2. Kualitas interaksi (likes & komentar)
  const likes = post.likes?.length ?? post.likesCount ?? 0;
  const comments = post.comments?.length ?? post.commentsCount ?? 0;
  score += Math.min(25, likes * 2 + comments * 3);

  // 3. Jitter Personalisasi Unik per User (Deterministic Hash Seed)
  // Menjamin urutan beranda setiap user berbeda satu sama lain (seperti FYP)
  if (userId) {
    let hash = 0;
    const seed = `${userId}:${post.id}`;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const personalizationJitter = Math.abs(hash) % 40; // 0 - 39 poin unik
    score += personalizationJitter;
  }

  // 4. Peluruhan waktu (Freshness vs Evergreen)
  const postDate = new Date(post.createdAt).getTime();
  const now = Date.now();
  const ageHours = Math.max(0, (now - postDate) / (1000 * 60 * 60));
  if (ageHours < 24) {
    score += 20; // boost 24 jam pertama
  } else if (ageHours < 72) {
    score += 10;
  }

  return score;
}

export const communityRepo = {
  /**
   * Mengambil daftar postingan dengan filter tab (for-you, following, saved, liked)
   */
  async listPosts(options: {
    tab?: "for-you" | "following" | "saved" | "liked" | "topic";
    topic?: string;
    userId?: string;
    cursor?: string;
    limit?: number;
  }) {
    const { tab = "for-you", topic, userId = "", limit = 10 } = options;

    try {
      // 1. Coba lewat Prisma Client jika DB terhubung
      const whereClause: any = { isHidden: false };
      if (topic) {
        whereClause.topicTag = topic;
      }
      if (tab === "saved" && userId) {
        whereClause.bookmarks = { some: { userId } };
      } else if (tab === "liked" && userId) {
        whereClause.likes = { some: { userId } };
      }

      // Kueri database dengan timeout 1.5 detik agar UI tidak tergantung lama
      const isFyp = tab === "for-you" && !topic;
      const fetchTake = isFyp ? Math.max(limit * 3, 30) : limit;

      const queryPromise = communityDb.communityPost.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: fetchTake,
        include: {
          likes: true,
          bookmarks: true,
          comments: { where: { isHidden: false }, take: 2 },
        },
      });

      const timeoutPromise = new Promise<any[]>((_, reject) =>
        setTimeout(() => reject(new Error("DB_TIMEOUT")), 1500)
      );

      const posts = await Promise.race([queryPromise, timeoutPromise]);

      if (posts && posts.length > 0) {
        // ALGORITMA "UNTUK KAMU" (FYP PERSONALISASI WELLNESS)
        // Menghasilkan urutan feed yang unik untuk setiap user berdasarkan afinitas & relevansi
        let sortedPosts = posts;
        if (isFyp) {
          // Ekstraksi topik yang disukai user dari riwayat like
          const userLikedTopics = new Set<string>();
          if (userId) {
            posts.forEach((p: any) => {
              if (p.likes?.some((l: any) => l.userId === userId) && p.topicTag) {
                userLikedTopics.add(p.topicTag.toLowerCase());
              }
            });
          }

          sortedPosts = [...posts].sort((a: any, b: any) => {
            const scoreA = calculateFypScore(a, userId, userLikedTopics);
            const scoreB = calculateFypScore(b, userId, userLikedTopics);
            return scoreB - scoreA;
          });
        }

        return sortedPosts.slice(0, limit).map((p: any) => ({
          id: p.id,
          userId: p.userId,
          authorName: p.isAnonymous ? "Teman Berkelana" : "Pengguna ZYBA",
          authorHandle: p.isAnonymous ? "anonim" : "zyba_user",
          title: p.title || null,
          content: p.content || "",
          topicTag: p.topicTag || "Refleksi",
          isAnonymous: p.isAnonymous,
          imageUrl: p.imageUrl,
          audioUrl: p.audioUrl,
          likesCount: p.likes?.length || 0,
          commentsCount: p.comments?.length || 0,
          isLiked: p.likes?.some((l: any) => l.userId === userId) || false,
          isBookmarked: p.bookmarks?.some((b: any) => b.userId === userId) || false,
          createdAt: p.createdAt.toISOString(),
        }));
      }
      // Jika DB kosong: jatuh ke seed memory
    } catch {
      // 2. Fallback in-memory jika DB offline atau timeout
    }
      let list = Array.from(memPosts.values()).filter((p) => !p.isHidden);

      if (topic) {
        list = list.filter((p) => p.topicTag?.toLowerCase() === topic.toLowerCase());
      } else if (tab === "saved" && userId) {
        list = list.filter((p) => p.bookmarkedBy.has(userId));
      } else if (tab === "liked" && userId) {
        list = list.filter((p) => p.likedBy.has(userId));
      }

      if (tab === "for-you" && !topic) {
        const userLikedTopics = new Set<string>();
        list.forEach((p) => {
          if (userId && p.likedBy.has(userId) && p.topicTag) {
            userLikedTopics.add(p.topicTag.toLowerCase());
          }
        });
        list.sort((a, b) => {
          const scoreA = calculateFypScore(a, userId, userLikedTopics);
          const scoreB = calculateFypScore(b, userId, userLikedTopics);
          return scoreB - scoreA;
        });
      } else {
        list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      return list.slice(0, limit).map((p) => ({
        id: p.id,
        userId: p.userId,
        authorName: p.isAnonymous ? "Teman Berkelana" : p.authorName,
        authorHandle: p.isAnonymous ? "anonim" : p.authorHandle,
        title: p.title || null,
        content: p.content,
        topicTag: p.topicTag || "Refleksi",
        isAnonymous: p.isAnonymous,
        imageUrl: p.imageUrl || null,
        audioUrl: p.audioUrl || null,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        isLiked: userId ? p.likedBy.has(userId) : false,
        isBookmarked: userId ? p.bookmarkedBy.has(userId) : false,
        createdAt: p.createdAt.toISOString(),
      }));
  },

  /**
   * Membuat postingan baru dengan sensor detectRisk
   */
  async createPost(params: {
    userId: string;
    userName: string;
    userHandle?: string;
    title?: string;
    content: string;
    topicTag?: string;
    isAnonymous?: boolean;
  }) {
    const {
      userId,
      userName,
      userHandle = "teman_zyba",
      title,
      content,
      topicTag = "Refleksi",
      isAnonymous = false,
    } = params;

    // Sensor Krisis (AGENTS.md Bagian 8 & 7.6)
    const combinedText = `${title || ""} ${content}`;
    const risk = detectRisk(combinedText);

    try {
      const created = await communityDb.communityPost.create({
        data: {
          userId,
          title: title?.trim() || null,
          content: content.trim(),
          topicTag: topicTag.trim(),
          isAnonymous,
        },
      });

      return {
        post: {
          id: created.id,
          userId: created.userId,
          authorName: isAnonymous ? "Teman Berkelana" : userName,
          authorHandle: isAnonymous ? "anonim" : userHandle,
          title: created.title,
          content: created.content,
          topicTag: created.topicTag,
          isAnonymous: created.isAnonymous,
          likesCount: 0,
          commentsCount: 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: created.createdAt.toISOString(),
        },
        riskAlert: risk.flagged,
      };
    } catch {
      // In-memory fallback
      const newId = `post_${Date.now()}`;
      const newPost: CommunityPostRecord = {
        id: newId,
        userId,
        authorName: userName,
        authorHandle: userHandle,
        title: title?.trim() || null,
        content: content.trim(),
        topicTag: topicTag.trim(),
        isAnonymous,
        isHidden: false,
        commentsDisabled: false,
        likesCount: 0,
        commentsCount: 0,
        likedBy: new Set(),
        bookmarkedBy: new Set(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memPosts.set(newId, newPost);

      return {
        post: {
          id: newPost.id,
          userId: newPost.userId,
          authorName: isAnonymous ? "Teman Berkelana" : userName,
          authorHandle: isAnonymous ? "anonim" : userHandle,
          title: newPost.title,
          content: newPost.content,
          topicTag: newPost.topicTag,
          isAnonymous: newPost.isAnonymous,
          likesCount: 0,
          commentsCount: 0,
          isLiked: false,
          isBookmarked: false,
          createdAt: newPost.createdAt.toISOString(),
        },
        riskAlert: risk.flagged,
      };
    }
  },

  /**
   * Toggle status Like pada sebuah postingan
   */
  async toggleLike(postId: string, userId: string) {
    const memPost = memPosts.get(postId);
    try {
      const existing = await communityDb.communityLike.findUnique({
        where: { postId_userId: { postId, userId } },
      });

      if (existing) {
        await communityDb.communityLike.delete({
          where: { id: existing.id },
        });
        if (memPost) {
          memPost.likedBy.delete(userId);
          memPost.likesCount = Math.max(0, memPost.likesCount - 1);
        }
        return { isLiked: false };
      } else {
        await communityDb.communityLike.create({
          data: { postId, userId },
        });
        if (memPost) {
          memPost.likedBy.add(userId);
          memPost.likesCount += 1;
        }
        return { isLiked: true };
      }
    } catch {
      // In-memory fallback
      if (!memPost) throw new Error("Postingan tidak ditemukan");

      if (memPost.likedBy.has(userId)) {
        memPost.likedBy.delete(userId);
        memPost.likesCount = Math.max(0, memPost.likesCount - 1);
        return { isLiked: false, likesCount: memPost.likesCount };
      } else {
        memPost.likedBy.add(userId);
        memPost.likesCount += 1;
        return { isLiked: true, likesCount: memPost.likesCount };
      }
    }
  },

  /**
   * Toggle Bookmark / Simpan
   */
  async toggleBookmark(postId: string, userId: string) {
    const memPost = memPosts.get(postId);
    try {
      const existing = await communityDb.communityBookmark.findUnique({
        where: { userId_postId: { userId, postId } },
      });

      if (existing) {
        await communityDb.communityBookmark.delete({
          where: { id: existing.id },
        });
        if (memPost) memPost.bookmarkedBy.delete(userId);
        return { isBookmarked: false };
      } else {
        await communityDb.communityBookmark.create({
          data: { userId, postId },
        });
        if (memPost) memPost.bookmarkedBy.add(userId);
        return { isBookmarked: true };
      }
    } catch {
      if (!memPost) throw new Error("Postingan tidak ditemukan");

      if (memPost.bookmarkedBy.has(userId)) {
        memPost.bookmarkedBy.delete(userId);
        return { isBookmarked: false };
      } else {
        memPost.bookmarkedBy.add(userId);
        return { isBookmarked: true };
      }
    }
  },

  /**
   * Mengambil daftar komentar untuk suatu postingan
   */
  async listComments(postId: string) {
    if (memPosts.has(postId)) {
      const memList = Array.from(memComments.values())
        .filter((c) => c.postId === postId && !c.isHidden)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      if (memList.length > 0) {
        return memList.map((c) => ({
          id: c.id,
          postId: c.postId,
          userId: c.userId,
          authorName: c.isAnonymous ? "Teman Berkelana" : c.authorName,
          content: c.content,
          isAnonymous: c.isAnonymous,
          createdAt: c.createdAt.toISOString(),
        }));
      }
    }

    try {
      const comments = await communityDb.communityComment.findMany({
        where: { postId, isHidden: false },
        orderBy: { createdAt: "asc" },
      });

      if (comments.length === 0 && memPosts.has(postId)) {
        const memList = Array.from(memComments.values())
          .filter((c) => c.postId === postId && !c.isHidden)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        return memList.map((c) => ({
          id: c.id,
          postId: c.postId,
          userId: c.userId,
          authorName: c.isAnonymous ? "Teman Berkelana" : c.authorName,
          content: c.content,
          isAnonymous: c.isAnonymous,
          createdAt: c.createdAt.toISOString(),
        }));
      }

      return comments.map((c: any) => ({
        id: c.id,
        postId: c.postId,
        userId: c.userId,
        authorName: c.isAnonymous ? "Teman Berkelana" : "Pengguna ZYBA",
        content: c.content,
        isAnonymous: c.isAnonymous,
        createdAt: c.createdAt.toISOString(),
      }));
    } catch {
      const comments = Array.from(memComments.values())
        .filter((c) => c.postId === postId && !c.isHidden)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      return comments.map((c) => ({
        id: c.id,
        postId: c.postId,
        userId: c.userId,
        authorName: c.isAnonymous ? "Teman Berkelana" : c.authorName,
        content: c.content,
        isAnonymous: c.isAnonymous,
        createdAt: c.createdAt.toISOString(),
      }));
    }
  },

  /**
   * Menambahkan komentar ke postingan
   */
  async createComment(params: {
    postId: string;
    userId: string;
    userName: string;
    content: string;
    isAnonymous?: boolean;
  }) {
    const { postId, userId, userName, content, isAnonymous = false } = params;

    try {
      const created = await communityDb.communityComment.create({
        data: {
          postId,
          userId,
          content: content.trim(),
          isAnonymous,
        },
      });

      return {
        id: created.id,
        postId: created.postId,
        userId: created.userId,
        authorName: isAnonymous ? "Teman Berkelana" : userName,
        content: created.content,
        isAnonymous: created.isAnonymous,
        createdAt: created.createdAt.toISOString(),
      };
    } catch {
      const post = memPosts.get(postId);
      if (post) {
        post.commentsCount += 1;
      }

      const newId = `comment_${Date.now()}`;
      const newComment: CommunityCommentRecord = {
        id: newId,
        postId,
        userId,
        authorName: userName,
        authorHandle: "user",
        content: content.trim(),
        isAnonymous,
        isHidden: false,
        createdAt: new Date(),
      };

      memComments.set(newId, newComment);

      return {
        id: newComment.id,
        postId: newComment.postId,
        userId: newComment.userId,
        authorName: isAnonymous ? "Teman Berkelana" : userName,
        content: newComment.content,
        isAnonymous: newComment.isAnonymous,
        createdAt: newComment.createdAt.toISOString(),
      };
    }
  },

  /**
   * Melaporkan postingan / komentar untuk dimoderasi
   */
  async createReport(params: {
    reporterId: string;
    targetType: "POST" | "COMMENT";
    targetId: string;
    postId?: string;
    reportedUserId?: string;
    reason: string;
    details?: string;
  }) {
    const {
      reporterId,
      targetType,
      targetId,
      postId,
      reportedUserId = "unknown",
      reason,
      details,
    } = params;

    try {
      const created = await communityDb.communityReport.create({
        data: {
          reporterId,
          targetType,
          targetId,
          postId,
          reportedUserId,
          reason,
          details,
        },
      });
      return { id: created.id, status: created.status };
    } catch {
      const newId = `report_${Date.now()}`;
      const report: CommunityReportRecord = {
        id: newId,
        reporterId,
        targetType,
        targetId,
        postId,
        reportedUserId,
        reason,
        details,
        status: "PENDING",
        createdAt: new Date(),
      };
      memReports.set(newId, report);
      return { id: newId, status: "PENDING" };
    }
  },
};
