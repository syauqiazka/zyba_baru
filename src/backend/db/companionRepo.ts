/**
 * ZYBA Companion Database Repository
 * Menghubungkan ke Prisma companionDb dengan in-memory fallback transparan
 * ketika PostgreSQL offline di development atau testing.
 */

import { companionDb } from "./companionClient";

export interface ConversationRecord {
  id: string;
  userId: string;
  title: string;
  emotionTag: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages: MessageRecord[];
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  userId?: string;
  role: "user" | "assistant" | "system";
  content: string;
  modelUsed?: string | null;
  attachmentType?: string | null;
  attachmentUrl?: string | null;
  audioDurationSec?: number | null;
  flaggedForRisk?: boolean;
  ttsAudioUrl?: string | null;
  createdAt: Date;
}

// Global in-memory store for fallback
const globalStore = globalThis as unknown as {
  _memConversations?: Map<string, ConversationRecord>;
  _memQuotas?: Map<string, number>;
};

if (!globalStore._memConversations) {
  globalStore._memConversations = new Map();
}
if (!globalStore._memQuotas) {
  globalStore._memQuotas = new Map();
}

const memConversations = globalStore._memConversations;
const memQuotas = globalStore._memQuotas;

export const companionRepo = {
  async listConversations(userId: string) {
    try {
      const records = await companionDb.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 50,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              content: true,
              createdAt: true,
              role: true,
            },
          },
        },
      });

      return records.map((c) => ({
        id: c.id,
        title: c.title,
        emotionTag: c.emotionTag,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        lastMessage: c.messages[0]?.content || null,
        lastMessageAt: c.messages[0]?.createdAt.toISOString() || c.updatedAt.toISOString(),
      }));
    } catch (dbErr) {
      console.warn("[companionRepo.listConversations] DB offline, using memory fallback");
      const userConvs = Array.from(memConversations.values())
        .filter((c) => c.userId === userId)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      return userConvs.map((c) => {
        const lastMsg = c.messages[c.messages.length - 1];
        return {
          id: c.id,
          title: c.title,
          emotionTag: c.emotionTag,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
          lastMessage: lastMsg?.content || null,
          lastMessageAt: lastMsg?.createdAt.toISOString() || c.updatedAt.toISOString(),
        };
      });
    }
  },

  async createConversation(userId: string, title: string, emotionTag?: string | null) {
    try {
      const newConv = await companionDb.conversation.create({
        data: {
          userId,
          title,
          emotionTag: emotionTag || null,
        },
      });
      return { id: newConv.id, title: newConv.title };
    } catch (dbErr) {
      console.warn("[companionRepo.createConversation] DB offline, using memory fallback");
      const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date();
      const record: ConversationRecord = {
        id,
        userId,
        title,
        emotionTag: emotionTag || null,
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      memConversations.set(id, record);
      return { id, title };
    }
  },

  async getConversation(id: string, userId: string) {
    try {
      const conv = await companionDb.conversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 100,
          },
        },
      });

      if (!conv || conv.userId !== userId) return null;

      return {
        id: conv.id,
        title: conv.title,
        emotionTag: conv.emotionTag,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
        messages: conv.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          modelUsed: m.modelUsed,
          attachmentType: m.attachmentType,
          attachmentUrl: m.attachmentUrl,
          audioDurationSec: m.audioDurationSec,
          flaggedForRisk: m.flaggedForRisk,
          ttsAudioUrl: m.ttsAudioUrl,
          createdAt: m.createdAt.toISOString(),
        })),
      };
    } catch (dbErr) {
      console.warn("[companionRepo.getConversation] DB offline, using memory fallback");
      const conv = memConversations.get(id);
      if (!conv || conv.userId !== userId) return null;

      return {
        id: conv.id,
        title: conv.title,
        emotionTag: conv.emotionTag,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
        messages: conv.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          modelUsed: m.modelUsed || null,
          attachmentType: m.attachmentType || null,
          attachmentUrl: m.attachmentUrl || null,
          audioDurationSec: m.audioDurationSec || null,
          flaggedForRisk: m.flaggedForRisk || false,
          ttsAudioUrl: m.ttsAudioUrl || null,
          createdAt: m.createdAt.toISOString(),
        })),
      };
    }
  },

  async deleteConversation(id: string, userId: string) {
    try {
      await companionDb.message.deleteMany({ where: { conversationId: id } });
      await companionDb.conversation.delete({ where: { id } });
      return true;
    } catch (dbErr) {
      console.warn("[companionRepo.deleteConversation] DB offline, using memory fallback");
      const conv = memConversations.get(id);
      if (conv && conv.userId === userId) {
        memConversations.delete(id);
        return true;
      }
      return false;
    }
  },

  async addMessage(data: {
    conversationId: string;
    userId: string;
    role: "user" | "assistant";
    content: string;
    modelUsed?: string;
    flaggedForRisk?: boolean;
    ttsAudioUrl?: string;
  }) {
    try {
      const msg = await companionDb.message.create({
        data: {
          conversationId: data.conversationId,
          role: data.role,
          content: data.content,
          modelUsed: data.modelUsed,
          flaggedForRisk: data.flaggedForRisk || false,
          ttsAudioUrl: data.ttsAudioUrl,
        },
      });

      await companionDb.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      });

      return {
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        modelUsed: msg.modelUsed,
        flaggedForRisk: msg.flaggedForRisk,
        createdAt: msg.createdAt.toISOString(),
      };
    } catch (dbErr) {
      console.warn("[companionRepo.addMessage] DB offline, using memory fallback");
      const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date();
      const msgRecord: MessageRecord = {
        id,
        conversationId: data.conversationId,
        userId: data.userId,
        role: data.role,
        content: data.content,
        modelUsed: data.modelUsed || null,
        flaggedForRisk: data.flaggedForRisk || false,
        ttsAudioUrl: data.ttsAudioUrl || null,
        createdAt: now,
      };

      const conv = memConversations.get(data.conversationId);
      if (conv) {
        conv.messages.push(msgRecord);
        conv.updatedAt = now;
      }

      return {
        id: msgRecord.id,
        role: msgRecord.role,
        content: msgRecord.content,
        modelUsed: msgRecord.modelUsed || undefined,
        flaggedForRisk: msgRecord.flaggedForRisk,
        createdAt: msgRecord.createdAt.toISOString(),
      };
    }
  },

  async getRecentMessages(conversationId: string, limit = 10) {
    try {
      const messages = await companionDb.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return messages.reverse();
    } catch (dbErr) {
      const conv = memConversations.get(conversationId);
      if (!conv) return [];
      return conv.messages.slice(-limit);
    }
  },
};
