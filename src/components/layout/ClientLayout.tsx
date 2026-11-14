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
  const isChatRoute = pathname.startsWith("/companion");
  const isCommunityRoute = pathname.startsWith("/community");
  const isResourcesRoute = pathname.startsWith("/resources");
  const isDedicatedRoute = isChatRoute || isCommunityRoute || isResourcesRoute;
  const hideMobileDock = pathname === "/mood-check-in" || isDedicatedRoute;
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

  // Jika di Companion atau Community: gunakan full layout tersendiri (menghilangkan sidebar ganda)
  if (isDedicatedRoute) {
    return (
      <div
        className={`w-full bg-[#F5F8F5] text-brown-900 selection:bg-emerald-200 ${
          isChatRoute ? "h-screen overflow-hidden" : "min-h-screen"
        }`}
      >
        <main
          className={`w-full p-0 m-0 ${
            isChatRoute ? "h-full overflow-hidden" : "min-h-screen"
          }`}
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8F5] text-brown-900 selection:bg-emerald-200 overflow-x-hidden">
      {/* 1. Left Sidebar on Desktop (>= 768px) */}
      <SanctuarySidebar userName={userName} />

      {/* 2. Main Content Canvas: Offset by sidebar width on desktop via margin */}
      <main
        className={`w-full md:ml-64 md:w-[calc(100%-16rem)] min-h-screen transition-all ${
          hideMobileDock
            ? "pt-8 md:pt-12 lg:pt-14 px-5 sm:px-8 lg:px-10 pb-28 md:pb-16"
            : "pt-8 md:pt-12 lg:pt-14 px-5 sm:px-8 lg:px-10 pb-32 md:pb-16"
        }`}
      >
        <div className="mx-auto w-full max-w-[1240px]">
          {children}
        </div>
      </main>

      {/* 3. Floating Bottom Sanctuary Dock (Mobile < 768px) */}
      {!hideMobileDock && <BottomSanctuary />}
    </div>
  );
}
