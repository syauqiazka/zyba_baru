"use client";

import React from "react";
import {
  CompanionProvider,
  useCompanion,
} from "@/components/companion/CompanionContext";
import { CompanionSidebar } from "@/components/companion/CompanionSidebar";
import { QuotaModal } from "@/components/companion/QuotaModal";

function CompanionLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    conversations,
    deleteConversation,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isQuotaModalOpen,
    setIsQuotaModalOpen,
    cooldownRemainingSec,
  } = useCompanion();

  return (
    <div className="flex h-full sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] w-full bg-white rounded-none sm:rounded-3xl border-0 sm:border border-botanical-500/15 overflow-hidden shadow-xs">
      {/* Sidebar rendered once */}
      <CompanionSidebar
        conversations={conversations}
        onDeleteConversation={deleteConversation}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Canvas */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-cream/30">
        {children}
      </main>

      {/* Quota Exceeded & Cooldown Modal */}
      <QuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        cooldownRemainingSec={cooldownRemainingSec}
      />
    </div>
  );
}

export default function CompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CompanionProvider>
      <CompanionLayoutContent>{children}</CompanionLayoutContent>
    </CompanionProvider>
  );
}
