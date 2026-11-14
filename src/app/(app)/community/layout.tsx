"use client";

import React from "react";
import Script from "next/script";
import {
  CommunityProvider,
  useCommunity,
} from "@/components/community/CommunityContext";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { FloatingComposeModal } from "@/components/community/FloatingComposeModal";
import { DirectMessagesDrawer } from "@/components/community/DirectMessagesDrawer";

function CommunityLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    currentTab,
    setCurrentTab,
    currentTopic,
    setCurrentTopic,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isFloatingComposeOpen,
    setIsFloatingComposeOpen,
    isMessagesOpen,
    setIsMessagesOpen,
    activeConversationId,
    triggerRefresh,
    userName,
  } = useCommunity();

  const handleSelectTab = (tab: string, topic?: string) => {
    setCurrentTab(tab);
    setCurrentTopic(topic);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F8F5]">
      {/* Ably Realtime Client Script */}
      <Script src="https://cdn.ably.com/lib/ably.min-2.js" strategy="afterInteractive" />

      {/* Top Header Bar across full width (Inspired by Convo reference) */}
      <CommunityHeader />

      {/* 3-Column Community Architecture (AGENTS.md 7.6 & Convo reference layout) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
        <div className="flex gap-6 lg:gap-8 items-start w-full">
          {/* 1. Community Left Sidebar rendered ONCE */}
          <CommunitySidebar
            currentTab={currentTab}
            currentTopic={currentTopic}
            onSelectTab={handleSelectTab}
            onOpenCompose={() => setIsFloatingComposeOpen(true)}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* 2. Middle & Right Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>

      {/* Floating Compose Card (kanan-bawah, tanpa backdrop gelap penuh) */}
      <FloatingComposeModal
        isOpen={isFloatingComposeOpen}
        onClose={() => setIsFloatingComposeOpen(false)}
        onPostCreated={triggerRefresh}
        userName={userName}
      />

      {/* Realtime Direct Messages Drawer (Ably powered) */}
      <DirectMessagesDrawer
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        initialConversationId={activeConversationId}
      />
    </div>
  );
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommunityProvider>
      <CommunityLayoutContent>{children}</CommunityLayoutContent>
    </CommunityProvider>
  );
}

