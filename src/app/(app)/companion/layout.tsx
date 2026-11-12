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
    remainingQuota,
    deleteConversation,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isQuotaModalOpen,
    setIsQuotaModalOpen,
  } = useCompanion();

  return (
    <div className="flex h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] w-full bg-white rounded-2xl sm:rounded-3xl border border-botanical-500/15 overflow-hidden shadow-xs">
      {/* Sidebar rendered once */}
      <CompanionSidebar
        conversations={conversations}
        remainingQuota={remainingQuota}
        onDeleteConversation={deleteConversation}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Canvas */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-cream/30">
        {children}
      </main>

      {/* Quota Exceeded Modal */}
      <QuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
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
