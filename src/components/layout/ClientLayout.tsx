"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SanctuaryNav } from "@/components/navigation/SanctuaryNav";
import { BottomSanctuary } from "@/components/navigation/BottomSanctuary";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const hideMobileDock = pathname === "/mood-check-in";

  return (
    <div className="min-h-screen bg-cream text-brown-900 selection:bg-orange-200">
      {/* Modern Floating Sanctuary Island Header (Desktop >= 768px) */}
      <SanctuaryNav />

      {/* Main Content: Full-width expansive sanctuary canvas with clean vertical rhythm */}
      <main className={`w-full min-h-screen pt-4 md:pt-24 px-4 sm:px-6 transition-all ${
        hideMobileDock ? "pb-24 md:pb-12" : "pb-28 md:pb-12"
      }`}>
        <div className="max-w-[1200px] mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Floating Bottom Sanctuary Dock (Mobile < 768px, hidden on focused flows) */}
      {!hideMobileDock && <BottomSanctuary />}
    </div>
  );
}

