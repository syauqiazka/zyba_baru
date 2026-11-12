"use client";

import React from "react";
import { ZenDock } from "./ZenDock";
import { BottomPill } from "./BottomPill";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-cream text-brown-900">
      {/* Floating Zen Dock (Desktop >= 768px) */}
      <ZenDock />

      {/* Main Content: offset md:pl-[108px] agar bebas dari dock melayang */}
      <main className="w-full min-h-screen md:pl-[108px] px-4 sm:px-6 py-6 pb-24 md:pb-8 transition-all">
        <div className="max-w-[1240px] mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Floating Bottom Pill Nav (Mobile < 768px) */}
      <BottomPill />
    </div>
  );
}

