"use client";

import React from "react";
import Link from "next/link";
import {
  Wind,
  Headphones,
  BookOpen,
  Sparkles,
  MessageCircle,
  Users,
  ArrowRight,
} from "lucide-react";

interface RecommendedItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  href: string;
  bgTint: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: RecommendedItem[] = [
  {
    id: "rec-1",
    title: "Breathing Garden (4-7-8)",
    category: "Aktivitas",
    desc: "Latihan nafas ritmis meredakan cemas seketika.",
    href: "/activity",
    bgTint: "bg-[#FDF2EC]/70 hover:bg-[#FDF2EC]",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
    icon: Wind,
  },
  {
    id: "rec-2",
    title: "Taman Suara Alam",
    category: "Audio",
    desc: "Audio desir hujan & angin untuk menenangkan tidur.",
    href: "/activity",
    bgTint: "bg-[#EFF6FA]/70 hover:bg-[#EFF6FA]",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
    icon: Headphones,
  },
  {
    id: "rec-3",
    title: "Jurnal Ruang Sehat",
    category: "Refleksi",
    desc: "Tuangkan uneg-uneg batin di ruang privat aman.",
    href: "/wellness-journey",
    bgTint: "bg-[#F7F3EB]/70 hover:bg-[#F7F3EB]",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-800",
    icon: BookOpen,
  },
  {
    id: "rec-4",
    title: "Mengenali Burnout Batin",
    category: "Wawasan",
    desc: "Bacaan ilmiah 3 menit memahami lelah mental.",
    href: "/resources",
    bgTint: "bg-[#EBF3EC]/70 hover:bg-[#EBF3EC]",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    icon: Sparkles,
  },
  {
    id: "rec-5",
    title: "Teman Cerita Zibi",
    category: "Companion",
    desc: "Curhat hal kecil yang mengganjal hari ini.",
    href: "/companion",
    bgTint: "bg-[#FAF1F3]/70 hover:bg-[#FAF1F3]",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    icon: MessageCircle,
  },
  {
    id: "rec-6",
    title: "Komunitas Suaka",
    category: "Sosial",
    desc: "Berbagi cerita hangat secara anonim bersama teman.",
    href: "/community",
    bgTint: "bg-[#F5F8F4]/70 hover:bg-[#F5F8F4]",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
    icon: Users,
  },
];

export function RecommendedCarousel() {
  return (
    <div className="space-y-3.5">
      {/* Header (Sesuai Sketsa: "Recommended for you") */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
            Eksplorasi Pendukung
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-brown-900">
            Direkomendasikan Untukmu
          </h2>
        </div>
        <span className="text-xs text-brown-700/70 font-medium">
          Disesuaikan ritme harimu
        </span>
      </div>

      {/* Grid / Horizontal Row of 5-6 Rounded Cards (Sesuai Sketsa User dengan panah -> di kanan bawah) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`group flex flex-col justify-between rounded-2xl border border-brown-900/10 p-4 shadow-2xs transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5 ${item.bgTint}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} shadow-2xs`}
                  >
                    <Icon className="h-4 w-4 stroke-[2]" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brown-700/70 bg-white/80 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-brown-700/80">
                  {item.desc}
                </p>
              </div>

              {/* Arrow Icon in Bottom Right (Persis Sketsa User: kotak dengan panah -> di pojok kanan bawah) */}
              <div className="mt-4 flex items-center justify-end pt-2 border-t border-brown-900/5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brown-900 shadow-2xs group-hover:bg-[#3E7B54] group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

