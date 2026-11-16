"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, User } from "lucide-react";
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

      {/* 2. Sleek Mobile Top Sanctuary Bar (Mobile only, < 768px) */}
      <header className="md:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-brown-900/8 bg-[#F5F8F5]/90 px-4 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3E7B54] text-white shadow-2xs">
            <span className="font-display text-sm font-black">Z</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display text-sm font-extrabold tracking-tight text-brown-900">
                ZYBA
              </span>
              <span className="rounded bg-emerald-100 px-1 py-0.2 text-[8px] font-bold text-emerald-800 uppercase">
                Suaka
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/guidebook"
            className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-100/70 px-2.5 py-1 text-[11px] font-semibold text-orange-950 shadow-2xs"
            title="Bantuan Krisis 24/7"
          >
            <ShieldCheck className="h-3 w-3 text-orange-600" />
            <span>Krisis 119</span>
          </Link>

          <Link
            href="/settings"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-brown-900/10 bg-white text-brown-800 shadow-2xs hover:bg-cream"
            aria-label="Pengaturan Akun"
          >
            <User className="h-4 w-4 stroke-[1.8]" />
          </Link>
        </div>
      </header>

      {/* 3. Main Content Canvas: Offset by sidebar width on desktop */}
      <main
        className={`w-full md:ml-64 md:w-[calc(100%-16rem)] min-h-screen transition-all ${
          hideMobileDock
            ? "pt-4 sm:pt-6 md:pt-12 px-3.5 sm:px-8 lg:px-10 pb-24 md:pb-16"
            : "pt-4 sm:pt-6 md:pt-12 px-3.5 sm:px-8 lg:px-10 pb-36 md:pb-16"
        }`}
      >
        <div className="mx-auto w-full max-w-[1240px]">
          {children}
        </div>
      </main>

      {/* 4. Floating Bottom Sanctuary Dock (Mobile < 768px) */}
      {!hideMobileDock && <BottomSanctuary />}
    </div>
  );
}
