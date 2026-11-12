"use client";

import React, { useState } from "react";
import { HeartHandshake, PhoneCall, X } from "lucide-react";
import { CRISIS_RESOURCES, type CrisisResource } from "@/lib/crisisDetection";

interface CrisisGateBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function CrisisGateBanner({ onDismiss, className = "" }: CrisisGateBannerProps) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      role="alert"
      className={`relative rounded-2xl border border-brown-900/20 bg-cream p-5 text-brown-900 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brown-900/10 text-brown-900">
            <HeartHandshake className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-brown-900">
              Kamu Berharga dan Tidak Sendirian
            </h4>
            <p className="mt-0.5 text-xs text-brown-700">
              Kami mendengarmu. Jika kamu sedang merasa sangat berat atau membutuhkan teman bicara saat ini, bantuan profesional gratis selalu siap mendampingimu.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setClosed(true);
            onDismiss?.();
          }}
          className="rounded-lg p-1 text-brown-700/60 hover:bg-brown-900/5 hover:text-brown-900"
          aria-label="Tutup pesan bantuan"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {CRISIS_RESOURCES.slice(0, 3).map((item: CrisisResource) => (
          <a
            key={item.name}
            href={item.telLink}
            className="flex items-center justify-between rounded-xl border border-brown-900/10 bg-white/90 p-3 text-xs transition-colors hover:border-brown-900/30 hover:bg-white"
          >
            <div>
              <div className="font-semibold text-brown-900">{item.name}</div>
              <div className="text-[11px] text-brown-700/80">{item.phone} • {item.available}</div>
            </div>
            <PhoneCall className="h-3.5 w-3.5 text-brown-700 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
