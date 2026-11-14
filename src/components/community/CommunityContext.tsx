"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CommunityContextType {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentTopic?: string;
  setCurrentTopic: (topic?: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isFloatingComposeOpen: boolean;
  setIsFloatingComposeOpen: (open: boolean) => void;
  isMessagesOpen: boolean;
  setIsMessagesOpen: (open: boolean) => void;
  activeConversationId?: string;
  setActiveConversationId: (id?: string) => void;
  openConversation: (convId?: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  userName: string;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [currentTab, setCurrentTab] = useState("for-you");
  const [currentTopic, setCurrentTopic] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFloatingComposeOpen, setIsFloatingComposeOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userName, setUserName] = useState("Teman ZYBA");

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

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const openConversation = (convId?: string) => {
    setActiveConversationId(convId);
    setIsMessagesOpen(true);
  };

  return (
    <CommunityContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentTopic,
        setCurrentTopic,
        searchQuery,
        setSearchQuery,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isFloatingComposeOpen,
        setIsFloatingComposeOpen,
        isMessagesOpen,
        setIsMessagesOpen,
        activeConversationId,
        setActiveConversationId,
        openConversation,
        refreshKey,
        triggerRefresh,
        userName,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return ctx;
}

