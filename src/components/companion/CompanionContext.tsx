"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { PersonaId } from "@/backend/ai/personas";
import { ConversationItem } from "./CompanionSidebar";

export interface TokenQuotaData {
  tokensUsed: number;
  tokenLimit: number;
  remainingTokens: number;
  isCooldown: boolean;
  cooldownUntil: string | null;
  cooldownRemainingSec: number;
}

interface CompanionContextType {
  conversations: ConversationItem[];
  tokensUsed: number;
  tokenLimit: number;
  remainingTokens: number;
  isCooldown: boolean;
  cooldownUntil: string | null;
  cooldownRemainingSec: number;
  userName: string;
  selectedPersona: PersonaId;
  setSelectedPersona: (p: PersonaId) => void;
  refreshConversations: () => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  updateTokenQuota: (quota: Partial<TokenQuotaData>) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isQuotaModalOpen: boolean;
  setIsQuotaModalOpen: (open: boolean) => void;
  // Backwards compatibility alias:
  remainingQuota: number;
}

const CompanionContext = createContext<CompanionContextType | null>(null);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [tokenLimit, setTokenLimit] = useState(15000);
  const [remainingTokens, setRemainingTokens] = useState(15000);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const [cooldownRemainingSec, setCooldownRemainingSec] = useState(0);
  const [userName, setUserName] = useState("Teman ZYBA");

  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("ZIBI");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);

  // Fetch User Info
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const updateTokenQuota = useCallback((quota: Partial<TokenQuotaData>) => {
    if (typeof quota.tokensUsed === "number") setTokensUsed(quota.tokensUsed);
    if (typeof quota.tokenLimit === "number") setTokenLimit(quota.tokenLimit);
    if (typeof quota.remainingTokens === "number")
      setRemainingTokens(quota.remainingTokens);
    if (typeof quota.isCooldown === "boolean") setIsCooldown(quota.isCooldown);
    if (quota.cooldownUntil !== undefined)
      setCooldownUntil(quota.cooldownUntil);
    if (typeof quota.cooldownRemainingSec === "number")
      setCooldownRemainingSec(quota.cooldownRemainingSec);
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/companion/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);

        if (data.tokenQuota) {
          updateTokenQuota(data.tokenQuota);
        } else if (typeof data.remainingTokens === "number") {
          setRemainingTokens(data.remainingTokens);
          setTokensUsed(data.tokensUsed || 0);
          setTokenLimit(data.tokenLimit || 15000);
          setIsCooldown(Boolean(data.isCooldown));
          setCooldownUntil(data.cooldownUntil || null);
          setCooldownRemainingSec(data.cooldownRemainingSec || 0);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil percakapan:", err);
    }
  }, [updateTokenQuota]);

  // Live timer for 5-hour cooldown countdown
  useEffect(() => {
    if (!isCooldown || cooldownRemainingSec <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCooldown(false);
          setRemainingTokens(tokenLimit);
          setTokensUsed(0);
          setCooldownUntil(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCooldown, cooldownRemainingSec, tokenLimit]);

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

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <CompanionContext.Provider
      value={{
        conversations,
        tokensUsed,
        tokenLimit,
        remainingTokens,
        isCooldown,
        cooldownUntil,
        cooldownRemainingSec,
        userName,
        selectedPersona,
        setSelectedPersona,
        refreshConversations: fetchConversations,
        deleteConversation,
        updateTokenQuota,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isQuotaModalOpen,
        setIsQuotaModalOpen,
        remainingQuota: remainingTokens,
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
