"use client";

import React from "react";
import Image from "next/image";
import { MoodLevel } from "@/generated/account-client";
import { Check } from "lucide-react";

interface MoodPebbleProps {
  mood: MoodLevel;
  selected: boolean;
  onSelect: (mood: MoodLevel) => void;
  label?: string;
  size?: "sm" | "md";
}

const moodMeta: Record<
  MoodLevel,
  {
    label: string;
    imageSrc: string;
    description: string;
    activeBorder: string;
    activeBg: string;
    activeRing: string;
    textCol: string;
    empathyQuote: string;
  }
> = {
  [MoodLevel.DEPRESSED]: {
    label: "Tertekan",
    imageSrc: "/mascot/moods/tertekan.png",
    description: "Cemas & terbebani",
    activeBorder: "border-brown-900",
    activeBg: "bg-sage-100",
    activeRing: "ring-brown-800/25",
    textCol: "text-brown-900",
    empathyQuote: "Zibi di sini bersamamu. Tarik napas perlahan, kamu tidak sendirian.",
  },
  [MoodLevel.SAD]: {
    label: "Sedih",
    imageSrc: "/mascot/moods/sedih.png",
    description: "Hati sendu",
    activeBorder: "border-sky-600",
    activeBg: "bg-sky-50",
    activeRing: "ring-sky-500/25",
    textCol: "text-sky-950",
    empathyQuote: "Peluk hangat dari Zibi. Wajar bersedih, air matamu bukan kelemahan.",
  },
  [MoodLevel.NEUTRAL]: {
    label: "Biasa",
    imageSrc: "/mascot/moods/biasa.png",
    description: "Mengalir apa adanya",
    activeBorder: "border-sand-500",
    activeBg: "bg-sand-100/90",
    activeRing: "ring-sand-400/25",
    textCol: "text-brown-900",
    empathyQuote: "Hari yang tenang. Mari kita nikmati setiap langkah kecil hari ini apa adanya.",
  },
  [MoodLevel.HAPPY]: {
    label: "Tenang",
    imageSrc: "/mascot/moods/tenang.png",
    description: "Damai & hening",
    activeBorder: "border-[#3E7B54]",
    activeBg: "bg-emerald-50",
    activeRing: "ring-emerald-500/25",
    textCol: "text-[#1B241E]",
    empathyQuote: "Senang melihat ketenangan batinmu hari ini. Tetap jaga keseimbangan ya.",
  },
  [MoodLevel.OVERJOYED]: {
    label: "Gembira",
    imageSrc: "/mascot/moods/gembira.png",
    description: "Penuh sukacita",
    activeBorder: "border-orange-500",
    activeBg: "bg-orange-50",
    activeRing: "ring-orange-500/30",
    textCol: "text-orange-950",
    empathyQuote: "Yay! Energinya menyenangkan sekali! Zibi ikut tersenyum dan bahagia untukmu!",
  },
};

export { moodMeta };

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
      className={`group flex flex-col items-center gap-1.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
        selected ? "scale-105 sm:scale-110" : "hover:scale-105 active:scale-95"
      }`}
      aria-pressed={selected}
      aria-label={label || meta.label}
    >
      <div
        className={`relative flex items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
          size === "md"
            ? "h-14 w-14 sm:h-16 sm:w-16"
            : "h-12 w-12 sm:h-13 sm:w-13"
        } ${
          selected
            ? `${meta.activeBorder} ${meta.activeBg} shadow-md ring-4 ${meta.activeRing}`
            : "border-brown-900/10 bg-white/90 hover:border-orange-500/40 hover:bg-cream"
        }`}
      >
        <div className="relative w-full h-full p-1.5 flex items-center justify-center">
          <Image
            src={meta.imageSrc}
            alt={`Ekspresi Zibi ${meta.label}`}
            width={64}
            height={64}
            className={`w-auto h-full object-contain transition-transform duration-300 select-none ${
              selected
                ? "scale-110 drop-shadow-md"
                : "group-hover:scale-110 group-hover:-translate-y-0.5"
            }`}
          />
        </div>

        {selected && (
          <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-500 text-brown-900 shadow-sm animate-in zoom-in-50 duration-200">
            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
          </div>
        )}
      </div>

      <span
        className={`text-[10px] sm:text-xs text-center leading-tight transition-colors truncate max-w-full ${
          selected
            ? `font-bold ${meta.textCol} scale-105`
            : "font-medium text-brown-700/80 group-hover:text-brown-900"
        }`}
      >
        {label || meta.label}
      </span>
    </button>
  );
}
