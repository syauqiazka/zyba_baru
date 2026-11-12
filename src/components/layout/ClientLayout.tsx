"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SanctuarySidebar } from "@/components/navigation/SanctuarySidebar";
import { BottomSanctuary } from "@/components/navigation/BottomSanctuary";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const hideMobileDock = pathname === "/mood-check-in";
  const [userName, setUserName] = useState("Teman ZYBA");

  useEffect(() => {
    // Ambil nama user untuk ditampilkan di sidebar
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F8F5] text-brown-900 selection:bg-emerald-200">
      {/* 1. Left Sidebar on Desktop (>= 768px) */}
      <SanctuarySidebar userName={userName} />

      {/* 2. Main Content Canvas: Offset by sidebar width on desktop */}
      <main
        className={`w-full min-h-screen transition-all md:pl-64 ${
          hideMobileDock ? "pt-4 md:pt-8 px-4 sm:px-8 pb-24 md:pb-12" : "pt-4 md:pt-8 px-4 sm:px-8 pb-28 md:pb-12"
        }`}
      >
        <div className="max-w-[1240px] mx-auto w-full">
          {children}
        </div>
      </main>

      {/* 3. Floating Bottom Sanctuary Dock (Mobile < 768px) */}
      {!hideMobileDock && <BottomSanctuary />}
    </div>
  );
}
