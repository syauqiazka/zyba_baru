"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PersonaId } from "@/backend/ai/personas";
import { ConversationItem } from "./CompanionSidebar";

interface CompanionContextType {
  conversations: ConversationItem[];
  remainingQuota: number;
  selectedPersona: PersonaId;
  setSelectedPersona: (p: PersonaId) => void;
  refreshConversations: () => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isQuotaModalOpen: boolean;
  setIsQuotaModalOpen: (open: boolean) => void;
  decrementQuota: () => void;
}

const CompanionContext = createContext<CompanionContextType | null>(null);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [remainingQuota, setRemainingQuota] = useState(20);
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("KINA");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/companion/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (typeof data.remainingQuota === "number") {
          setRemainingQuota(data.remainingQuota);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil percakapan:", err);
    }
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/companion/conversations/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setConversations((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err) {
        console.error("Gagal menghapus percakapan:", err);
      }
    },
    []
  );

  const decrementQuota = useCallback(() => {
    setRemainingQuota((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <CompanionContext.Provider
      value={{
        conversations,
        remainingQuota,
        selectedPersona,
        setSelectedPersona,
        refreshConversations: fetchConversations,
        deleteConversation,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isQuotaModalOpen,
        setIsQuotaModalOpen,
        decrementQuota,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) {
    throw new Error("useCompanion must be used within a CompanionProvider");
  }
  return ctx;
}

