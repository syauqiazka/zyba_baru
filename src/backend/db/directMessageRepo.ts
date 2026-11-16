import { communityDb } from "./communityClient";
import { accountDb } from "./accountClient";
import { publishDirectMessage } from "../realtime/ablyServer";

export interface DirectConversationItem {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerHandle: string;
  lastMessageSnippet: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface DirectMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
  isMine: boolean;
}

// Resilient storage fallback: empty array for authentic user data
const memoryConversations: DirectConversationItem[] = [];
const memoryMessages: Record<string, DirectMessageItem[]> = {};

export const directMessageRepo = {
  /**
   * Mengambil daftar percakapan langsung pengguna
   */
  async listConversations(userId: string): Promise<DirectConversationItem[]> {
    try {
      const participations = await communityDb.directParticipant.findMany({
        where: { userId },
        include: {
          conversation: {
            include: {
              participants: true,
              messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
        orderBy: {
          conversation: {
            lastMessageAt: "desc",
          },
        },
      });

      if (participations.length === 0) {
        return memoryConversations;
      }

      // Kumpulkan ID partner untuk query nama lintas database (Prisma 3 multi-db)
      const partnerUserIds = participations.map((p) => {
        const partner = p.conversation.participants.find((pt) => pt.userId !== userId);
        return partner ? partner.userId : userId;
      });

      const partnerUsers = await accountDb.user
        .findMany({
          where: { id: { in: partnerUserIds } },
          select: { id: true, name: true, email: true },
        })
        .catch(() => []);

      const userMap = new Map(partnerUsers.map((u) => [u.id, u]));

      const results: DirectConversationItem[] = [];

      for (const p of participations) {
        const partner = p.conversation.participants.find((pt) => pt.userId !== userId);
        const partnerId = partner?.userId || "teman-anonim";
        const partnerInfo = userMap.get(partnerId);

        const lastMsg = p.conversation.messages[0];

        // Hitung unread count
        const unreadCount = await communityDb.directMessage.count({
          where: {
            conversationId: p.conversationId,
            senderId: { not: userId },
            readAt: null,
          },
        });

        results.push({
          id: p.conversationId,
          partnerId,
          partnerName: partnerInfo?.name || "Sahabat Suaka",
          partnerHandle: partnerInfo?.name?.toLowerCase().replace(/\s+/g, "_") || "sahabat_zyba",
          lastMessageSnippet: lastMsg?.content || "Memulai percakapan baru.",
          lastMessageAt: (lastMsg?.createdAt || p.conversation.lastMessageAt).toISOString(),
          unreadCount,
        });
      }

      return results;
    } catch (err) {
      console.warn("[DM-Repo] Gagal query database, fallback memory:", err);
      return memoryConversations;
    }
  },

  /**
   * Mengambil pesan dalam satu percakapan
   */
  async listMessages(conversationId: string, currentUserId: string): Promise<DirectMessageItem[]> {
    try {
      const messages = await communityDb.directMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
      });

      // Tandai pesan terbaca
      await communityDb.directMessage
        .updateMany({
          where: {
            conversationId,
            senderId: { not: currentUserId },
            readAt: null,
          },
          data: {
            readAt: new Date(),
          },
        })
        .catch(() => {});

      if (messages.length === 0 && memoryMessages[conversationId]) {
        return memoryMessages[conversationId];
      }

      // Ambil nama pengirim dari Account DB
      const senderIds = Array.from(new Set(messages.map((m) => m.senderId)));
      const senders = await accountDb.user
        .findMany({
          where: { id: { in: senderIds } },
          select: { id: true, name: true },
        })
        .catch(() => []);
      const senderMap = new Map(senders.map((s) => [s.id, s.name]));

      return messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: senderMap.get(m.senderId) || (m.senderId === currentUserId ? "Kamu" : "Teman ZYBA"),
        content: m.content,
        createdAt: m.createdAt.toISOString(),
        readAt: m.readAt ? m.readAt.toISOString() : null,
        isMine: m.senderId === currentUserId,
      }));
    } catch (err) {
      console.warn("[DM-Repo] Fallback ke memory messages:", err);
      return memoryMessages[conversationId] || [];
    }
  },

  /**
   * Mengirim pesan baru & mempublikasikannya ke Ably secara realtime
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string
  ): Promise<DirectMessageItem> {
    const nowIso = new Date().toISOString();

    let createdMsg: DirectMessageItem = {
      id: "msg-" + Date.now(),
      conversationId,
      senderId,
      senderName,
      content,
      createdAt: nowIso,
      readAt: null,
      isMine: true,
    };

    try {
      const saved = await communityDb.directMessage.create({
        data: {
          conversationId,
          senderId,
          content,
        },
      });

      await communityDb.directConversation
        .update({
          where: { id: conversationId },
          data: { lastMessageAt: new Date() },
        })
        .catch(() => {});

      createdMsg = {
        id: saved.id,
        conversationId: saved.conversationId,
        senderId: saved.senderId,
        senderName,
        content: saved.content,
        createdAt: saved.createdAt.toISOString(),
        readAt: null,
        isMine: true,
      };
    } catch (err) {
      console.warn("[DM-Repo] Simpan DB gagal, simpan ke memori:", err);
      if (!memoryMessages[conversationId]) {
        memoryMessages[conversationId] = [];
      }
      memoryMessages[conversationId].push(createdMsg);
    }

    // Publikasikan ke Ably Realtime
    await publishDirectMessage(conversationId, {
      id: createdMsg.id,
      conversationId: createdMsg.conversationId,
      senderId: createdMsg.senderId,
      senderName,
      content: createdMsg.content,
      createdAt: createdMsg.createdAt,
    });

    return createdMsg;
  },

  /**
   * Membuka atau membuat percakapan 1-on-1 baru
   */
  async getOrCreateConversation(userId: string, recipientUserId: string): Promise<string> {
    try {
      // Cari apakah sudah ada percakapan dengan kedua partisipan ini
      const existing = await communityDb.directConversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId } } },
            { participants: { some: { userId: recipientUserId } } },
          ],
        },
      });

      if (existing) {
        return existing.id;
      }

      // Buat baru
      const created = await communityDb.directConversation.create({
        data: {
          participants: {
            create: [{ userId }, { userId: recipientUserId }],
          },
        },
      });

      return created.id;
    } catch (err) {
      console.warn("[DM-Repo] Gagal create conversation di DB, gunakan demo:", err);
      return "conv-demo-1";
    }
  },
};
