"use client";

import React from "react";
import { Check } from "lucide-react";

interface ChoiceCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function ChoiceCard({
  label,
  description,
  selected,
  onSelect,
  icon,
  className = "",
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full items-center justify-between rounded-xl p-3.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
        selected
          ? "border-2 border-orange-500 bg-orange-100 text-brown-900 shadow-sm"
          : "border border-brown-900/10 bg-white text-brown-900 hover:border-orange-500/40 hover:bg-orange-500/[0.04]"
      } ${className}`}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              selected ? "bg-orange-200/60 text-brown-900" : "bg-brown-900/5 text-brown-700"
            }`}
          >
            {icon}
          </div>
        )}
        <div>
          <div className={`text-sm font-medium ${selected ? "font-semibold text-brown-900" : "text-brown-900"}`}>
            {label}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-brown-700/80">{description}</p>
          )}
        </div>
      </div>

      {/* Squircle Indicator (Bukan buletan radio) */}
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
          selected
            ? "border-orange-500 bg-orange-500 text-brown-900 shadow-2xs"
            : "border-brown-900/20 bg-white group-hover:border-orange-500/50"
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5 stroke-[2.8]" />}
      </div>
    </button>
  );
}

interface ScaleRatingProps {
  value: number | null;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  className?: string;
}

export function ScaleRating({
  value,
  onChange,
  min = 1,
  max = 5,
  lowLabel = "Rendah",
  highLabel = "Tinggi",
  className = "",
}: ScaleRatingProps) {
  const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        {points.map((pt) => {
          const isSelected = value === pt;
          return (
            <button
              key={pt}
              type="button"
              onClick={() => onChange(pt)}
              className={`flex h-11 flex-1 items-center justify-center rounded-xl font-display text-sm font-semibold tabular-nums transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${
                isSelected
                  ? "border-2 border-orange-500 bg-orange-100 font-bold text-brown-900 shadow-sm"
                  : "border border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40 hover:bg-orange-500/[0.04]"
              }`}
              aria-pressed={isSelected}
              aria-label={`Skala ${pt} dari ${max}`}
            >
              {pt}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between px-1 text-[11px] text-brown-700/70">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

