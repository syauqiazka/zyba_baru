"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, Users, ShieldCheck, HeartHandshake, Check } from "lucide-react";

interface CommunityWidgetsProps {
  onSelectTopic: (topic: string) => void;
}

const TRENDING_TOPICS = [
  { rank: "01", name: "Pikiran Tenang", postsCount: "42 Cerita", growth: "+12%" },
  { rank: "02", name: "Overthinking", postsCount: "38 Cerita", growth: "+8%" },
  { rank: "03", name: "Lingkar Syukur", postsCount: "29 Cerita", growth: "+15%" },
  { rank: "04", name: "Kisah Pulih", postsCount: "19 Cerita", growth: "+6%" },
  { rank: "05", name: "Tidur Nyenyak", postsCount: "14 Cerita", growth: "+4%" },
];

const SUGGESTED_CIRCLES = [
  {
    id: "circle-1",
    name: "Ruang Hening Malam",
    members: "1.2k Sahabat",
    desc: "Tempat berbagi refleksi santai sebelum beristirahat.",
  },
  {
    id: "circle-2",
    name: "Langkah Sadar Harian",
    members: "890 Sahabat",
    desc: "Saling menyemangati untuk hadir utuh hari ini.",
  },
  {
    id: "circle-3",
    name: "Pemulihan Baterai Sosial",
    members: "640 Sahabat",
    desc: "Suaka bagi yang butuh mengisi daya diri sendiri.",
  },
];

export function CommunityWidgets({ onSelectTopic }: CommunityWidgetsProps) {
  const [joinedCircles, setJoinedCircles] = useState<Record<string, boolean>>({});

  const toggleJoin = (circleId: string) => {
    setJoinedCircles((prev) => ({
      ...prev,
      [circleId]: !prev[circleId],
    }));
  };

  return (
    <aside className="hidden xl:block w-72 shrink-0 space-y-5 h-fit sticky top-20">
      {/* 1. Trending Topics (Inspired by Convo reference) */}
      <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-[#3E7B54]" />
          <h3 className="font-serif text-sm font-bold text-brown-900">
            Topik Hangat Hari Ini
          </h3>
        </div>

        <div className="space-y-2.5">
          {TRENDING_TOPICS.map((item) => (
            <button
              key={item.rank}
              type="button"
              onClick={() => onSelectTopic(item.name)}
              className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-cream/70 transition-colors group"
            >
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-brown-700/40 group-hover:text-[#3E7B54] transition-colors">
                  {item.rank}
                </span>
                <div>
                  <p className="text-xs font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors">
                    {item.name}
                  </p>
                  <span className="text-[10px] text-brown-700/60">
                    {item.postsCount}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                {item.growth}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Suggested Community Circles */}
      <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-orange-600" />
          <h3 className="font-serif text-sm font-bold text-brown-900">
            Lingkar Suaka Disarankan
          </h3>
        </div>

        <div className="space-y-3.5">
          {SUGGESTED_CIRCLES.map((circle) => {
            const isJoined = Boolean(joinedCircles[circle.id]);
            return (
              <div
                key={circle.id}
                className="flex items-start justify-between gap-3 p-2 rounded-xl"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-brown-900 truncate">
                    {circle.name}
                  </h4>
                  <p className="text-[10px] text-brown-700/70 line-clamp-2 leading-relaxed">
                    {circle.desc}
                  </p>
                  <span className="inline-block text-[9px] font-medium text-brown-700/50">
                    {circle.members}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleJoin(circle.id)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isJoined
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-[#3E7B54] hover:bg-[#346B48] text-white shadow-2xs"
                  }`}
                >
                  {isJoined ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                      <span>Ikuti</span>
                    </span>
                  ) : (
                    "Gabung"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Safe Sanctuary Prompt */}
      <div className="rounded-3xl border border-brown-900/10 bg-gradient-to-br from-emerald-50/50 to-orange-50/40 p-5">
        <div className="flex items-center gap-2 mb-2 text-brown-900">
          <HeartHandshake className="h-4 w-4 text-orange-600" />
          <span className="font-serif text-xs font-bold">Ruang Saling Jaga</span>
        </div>
        <p className="text-[11px] text-brown-700 leading-relaxed">
          Semua cerita di ZYBA didengarkan tanpa penghakiman. Jika kamu atau temanmu sedang dalam krisis emosional, kami siap membantumu.
        </p>
        <Link
          href="/guidebook"
          className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-orange-950 hover:underline"
        >
          <span>Direktori Bantuan Darurat</span>
          <span>→</span>
        </Link>
      </div>
    </aside>
  );
}

