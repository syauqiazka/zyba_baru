import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Admin Panel Moderasi | ZYBA Sanctuary",
  description: "Panel moderasi laporan komunitas dan keselamatan suaka ZYBA.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F8F5] text-[#1B241E] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#2D3E33]/10 bg-[#F5F8F5]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D3E33]/70 hover:text-[#1B241E] transition-colors mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
            </Link>

            <div className="h-4 w-px bg-[#2D3E33]/15" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1B241E] text-white">
                <Shield className="h-4 w-4 text-[#3E7B54]" />
              </div>
              <div>
                <span className="font-serif text-base font-semibold tracking-tight text-[#1B241E]">
                  ZYBA
                </span>
                <span className="ml-2 rounded-full bg-[#E8F2EC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3E7B54]">
                  Moderasi Suaka
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#2D3E33]/70">
            <div className="flex items-center gap-1.5 rounded-full bg-white/80 border border-[#2D3E33]/10 px-3 py-1">
              <HeartHandshake className="h-3.5 w-3.5 text-[#3E7B54]" />
              <span className="hidden sm:inline">Keselamatan Jiwa & Suaka Bersama</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
