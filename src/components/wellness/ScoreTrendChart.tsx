"use client";

import React, { useState } from "react";
import { WellnessStatItem } from "@/backend/db/wellnessRepo";
import { TrendingUp, Activity, Sparkles, Calendar, Info } from "lucide-react";

interface ScoreTrendChartProps {
  data: WellnessStatItem[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [viewRange, setViewRange] = useState<"7d" | "all">("7d");

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-xs text-brown-700/60 space-y-2 border border-dashed border-brown-900/10 rounded-2xl bg-cream/30">
        <Activity className="w-6 h-6 text-brown-700/40" />
        <p className="font-semibold text-brown-900">Belum ada cukup riwayat data</p>
        <p>Lakukan check-in harian untuk mulai melacak kurva kesehatan batinmu.</p>
      </div>
    );
  }

  // Saring data berdasarkan rentang tampilan
  const displayData = viewRange === "7d" ? data.slice(-7) : data;

  const height = 190;
  const width = 640;
  const paddingX = 40;
  const paddingY = 28;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  // Skor di rentang 0-100
  const points = displayData.map((d, i) => {
    const x = paddingX + (i / Math.max(1, displayData.length - 1)) * innerWidth;
    const y = height - paddingY - (Math.max(0, Math.min(100, d.score)) / 100) * innerHeight;
    return { x, y, ...d };
  });

  // Buat kurva SVG path halus (Bezier curve)
  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, "");

  // Area gradien bawah kurva
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Hitung rata-rata skor
  const avgScore = Math.round(
    displayData.reduce((acc, curr) => acc + curr.score, 0) / Math.max(1, displayData.length)
  );

  return (
    <div className="w-full space-y-4">
      {/* Top Header controls: Range selector & Status Pill */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brown-900">
            <TrendingUp className="w-4 h-4 text-[#3E7B54]" />
            <span>Kurva Keseimbangan Batin</span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#3E7B54] font-bold">
            Rata-rata {avgScore} / 100
          </span>
        </div>

        <div className="flex items-center gap-1 bg-cream/70 p-1 rounded-xl border border-brown-900/10">
          <button
            type="button"
            onClick={() => setViewRange("7d")}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              viewRange === "7d"
                ? "bg-white text-brown-900 shadow-2xs"
                : "text-brown-700/60 hover:text-brown-900"
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => setViewRange("all")}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              viewRange === "all"
                ? "bg-white text-brown-900 shadow-2xs"
                : "text-brown-700/60 hover:text-brown-900"
            }`}
          >
            Semua Riwayat
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-cream/20 to-white border border-brown-900/5 p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-hidden"
        >
          <defs>
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3E7B54" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#3E7B54" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#3E7B54" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontal */}
          {[25, 50, 75].map((val) => {
            const y = height - paddingY - (val / 100) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(27, 36, 30, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-brown-700/40 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Fill Area Under Curve */}
          <path d={areaD} fill="url(#scoreAreaGrad)" />

          {/* Main Curve Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#3E7B54"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 6.5 : 4}
                className={`transition-all cursor-pointer ${
                  hoveredIdx === i
                    ? "fill-white stroke-orange-500 stroke-[3]"
                    : "fill-white stroke-[#3E7B54] stroke-2 hover:stroke-orange-500"
                }`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-brown-700/60"
              >
                {p.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none rounded-xl bg-brown-900 text-white px-3.5 py-2 text-xs font-semibold shadow-xl flex items-center gap-2.5 transition-all z-20 border border-white/10 animate-in fade-in zoom-in-95 duration-150">
            <span className="font-mono text-white/80">{points[hoveredIdx].date}:</span>
            <span className="font-bold text-emerald-300">
              Zyba Score {points[hoveredIdx].score}
            </span>
            <span className="text-[10px] text-orange-200">
              • Tingkat Stres {points[hoveredIdx].stressLevel}/5
            </span>
          </div>
        )}
      </div>

      {/* Chart Footer Insight */}
      <div className="flex items-center justify-between text-[11px] text-brown-700/60 px-1 pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E7B54]" />
            <span>Zyba Score (0-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Titik Evaluasi Harian</span>
          </div>
        </div>

        <span className="text-[10px] text-brown-700/50">
          Arahkan kursor pada lingkaran untuk detail harian
        </span>
      </div>
    </div>
  );
}
