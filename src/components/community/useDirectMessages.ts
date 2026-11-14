"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DirectConversationItem, DirectMessageItem } from "@/backend/db/directMessageRepo";

declare global {
  interface Window {
    Ably?: any;
  }
}

export function useDirectMessages(activeConvId?: string) {
  const [conversations, setConversations] = useState<DirectConversationItem[]>([]);
  const [messages, setMessages] = useState<DirectMessageItem[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  const ablyClientRef = useRef<any>(null);
  const activeChannelRef = useRef<any>(null);

  // 1. Fetch Daftar Percakapan
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/community/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        const convList: DirectConversationItem[] = data.conversations || [];
        setConversations(convList);
        const unread = convList.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        setTotalUnread(unread);
      }
    } catch (err) {
      console.warn("Gagal mengambil percakapan:", err);
    } finally {
      setLoadingConv(false);
    }
  }, []);

  // 2. Fetch Pesan untuk Percakapan Aktif
  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/community/messages/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.warn("Gagal memuat pesan:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Inisialisasi daftar percakapan
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Muat pesan saat activeConvId berubah
  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    } else {
      setMessages([]);
    }
  }, [activeConvId, fetchMessages]);

  // 3. Setup Ably Realtime Client & Channel Subscription (Browser Safe)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let client = ablyClientRef.current;
    if (!client && window.Ably) {
      try {
        client = new window.Ably.Realtime({
          authUrl: "/api/community/realtime/token",
          autoConnect: true,
        });
        ablyClientRef.current = client;
      } catch (err) {
        console.warn("[Ably Client] Inisialisasi realtime gagal, beralih ke fallback polling:", err);
      }
    }

    if (!client || !activeConvId) return;

    try {
      const channelName = `direct:${activeConvId}`;
      const channel = client.channels.get(channelName);
      activeChannelRef.current = channel;

      const messageHandler = (msg: any) => {
        const newMsg = msg.data as DirectMessageItem;
        if (newMsg && newMsg.conversationId === activeConvId) {
          setMessages((prev) => {
            // Hindari duplikasi jika pesan sudah ada
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // Perbarui snippet percakapan
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId
                ? {
                    ...c,
                    lastMessageSnippet: newMsg.content,
                    lastMessageAt: newMsg.createdAt,
                  }
                : c
            )
          );
        }
      };

      channel.subscribe("new-message", messageHandler);

      return () => {
        try {
          channel.unsubscribe("new-message", messageHandler);
        } catch (_) {}
      };
    } catch (err) {
      console.warn("[Ably Subscription] Gagal subscribe ke channel realtime:", err);
    }
  }, [activeConvId]);

  // 4. Polling Ringan Fallback (setiap 6 detik)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
      if (activeConvId) {
        fetchMessages(activeConvId);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [activeConvId, fetchConversations, fetchMessages]);

  // 5. Fungsi Kirim Pesan
  const sendMessage = async (convId: string, content: string) => {
    if (!content.trim()) return;

    // Optimistic UI update
    const optimisticMsg: DirectMessageItem = {
      id: "opt-" + Date.now(),
      conversationId: convId,
      senderId: "me",
      senderName: "Kamu",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isMine: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch(`/api/community/messages/${convId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        // Gantikan pesan optimistik dengan respons resmi
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? { ...data.message, isMine: true } : m))
        );
        fetchConversations();
      }
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
  };

  return {
    conversations,
    messages,
    loadingConv,
    loadingMessages,
    totalUnread,
    sendMessage,
    refreshConversations: fetchConversations,
  };
}
