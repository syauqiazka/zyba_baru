"use client";

import React from "react";
import { MoodLevel } from "@/generated/account-client";
import { Check } from "lucide-react";

interface MoodPebbleProps {
  mood: MoodLevel;
  selected: boolean;
  onSelect: (mood: MoodLevel) => void;
  label?: string;
  size?: "sm" | "md";
}

// SVG ekspresi garis minimalis (Bebas Emoji sesuai AGENTS.md Bagian 3.1 & DESIGN.md §6.7)
function MoodFaceIcon({ mood, className }: { mood: MoodLevel; className?: string }) {
  switch (mood) {
    case MoodLevel.DEPRESSED:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="9" x2="10" y2="9" strokeLinecap="round" />
          <line x1="14" y1="9" x2="16" y2="9" strokeLinecap="round" />
          <path d="M8 16C9 14.5 10.5 14 12 14C13.5 14 15 14.5 16 16" strokeLinecap="round" />
        </svg>
      );
    case MoodLevel.SAD:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9 16C10 14.8 11 14.5 12 14.5C13 14.5 14 14.8 15 16" strokeLinecap="round" />
        </svg>
      );
    case MoodLevel.NEUTRAL:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
        </svg>
      );
    case MoodLevel.HAPPY:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="9" cy="9.5" r="1" fill="currentColor" />
          <circle cx="15" cy="9.5" r="1" fill="currentColor" />
          <path d="M8 14.5C9.5 16.5 14.5 16.5 16 14.5" strokeLinecap="round" />
        </svg>
      );
    case MoodLevel.OVERJOYED:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 9.5C8.8 8.5 9.8 8.5 10.5 9.5" strokeLinecap="round" />
          <path d="M13.5 9.5C14.2 8.5 15.2 8.5 16 9.5" strokeLinecap="round" />
          <path d="M8 13.5C9 17 15 17 16 13.5H8Z" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
        </svg>
      );
  }
}

const moodMeta: Record<
  MoodLevel,
  { label: string; baseBg: string; activeBorder: string; textCol: string }
> = {
  [MoodLevel.DEPRESSED]: {
    label: "Tertekan",
    baseBg: "bg-sage-100/70 border-brown-700/20",
    activeBorder: "border-brown-900 bg-sage-100",
    textCol: "text-brown-900",
  },
  [MoodLevel.SAD]: {
    label: "Sedih",
    baseBg: "bg-sky-100/70 border-sky-200",
    activeBorder: "border-sky-600 bg-sky-100",
    textCol: "text-sky-950",
  },
  [MoodLevel.NEUTRAL]: {
    label: "Biasa",
    baseBg: "bg-sand-200/70 border-sand-300",
    activeBorder: "border-brown-700 bg-sand-200",
    textCol: "text-brown-900",
  },
  [MoodLevel.HAPPY]: {
    label: "Tenang",
    baseBg: "bg-orange-100/70 border-orange-200",
    activeBorder: "border-orange-500 bg-orange-100",
    textCol: "text-orange-950",
  },
  [MoodLevel.OVERJOYED]: {
    label: "Gembira",
    baseBg: "bg-orange-200/70 border-orange-300",
    activeBorder: "border-orange-600 bg-orange-200",
    textCol: "text-orange-950",
  },
};

export function MoodPebble({
  mood,
  selected,
  onSelect,
  label,
  size = "md",
}: MoodPebbleProps) {
  const meta = moodMeta[mood];

  return (
    <button
      type="button"
      onClick={() => onSelect(mood)}
      className={`group flex flex-col items-center gap-1.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
        selected ? "scale-105" : "hover:scale-102"
      }`}
      aria-pressed={selected}
      aria-label={label || meta.label}
    >
      <div
        className={`relative flex items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
          size === "md" ? "h-14 w-14" : "h-11 w-11"
        } ${
          selected
            ? `${meta.activeBorder} shadow-sm ring-2 ring-orange-500/30`
            : `${meta.baseBg} hover:border-orange-500/40`
        }`}
      >
        <MoodFaceIcon
          mood={mood}
          className={`${size === "md" ? "h-7 w-7" : "h-5 w-5"} ${meta.textCol} transition-transform group-hover:scale-110`}
        />

        {selected && (
          <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-brown-900 shadow-sm">
            <Check className="h-2.5 w-2.5 stroke-[2.5]" />
          </div>
        )}
      </div>

      <span
        className={`text-xs transition-colors ${
          selected
            ? "font-semibold text-brown-900"
            : "text-brown-700/80 group-hover:text-brown-900"
        }`}
      >
        {label || meta.label}
      </span>
    </button>
  );
}

