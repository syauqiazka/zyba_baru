"use client";

import React, { useState } from "react";
import { ShieldAlert, Phone, ExternalLink, X } from "lucide-react";

interface CrisisBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function CrisisBanner({ onDismiss, className = "" }: CrisisBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleClose = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={`relative mx-4 my-3 p-4 rounded-2xl bg-[#FCF6EE] border border-[#E9CBA8] shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#F5E1C8] flex items-center justify-center shrink-0 text-[#8F5521]">
          <ShieldAlert className="w-5 h-5 stroke-[1.8]" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm font-serif font-bold text-[#4D2E12]">
            Kami Mendengar & Keselamatanmu Adalah Prioritas Utama
          </h4>
          <p className="text-xs text-[#6F4E2D] mt-1 leading-relaxed">
            Jika kamu sedang berada dalam krisis emosional, merasa sendirian, atau berpikiran untuk
            menyakiti diri sendiri, tolong ketahuilah bahwa kamu tidak sendiri. Ada bantuan
            profesional resmi yang siap mendengarkanmu dengan hangat kapan saja.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            <a
              href="tel:119"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8F5521] text-white text-xs font-semibold hover:bg-[#724218] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 stroke-[1.8]" />
              Hubungi SEJIWA (119 ext 8)
            </a>
            <a
              href="/guidebook"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-[#E9CBA8] text-[#4D2E12] text-xs font-medium hover:bg-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 stroke-[1.8]" />
              Direktori Bantuan Lengkap
            </a>
          </div>
        </div>

        <button
          onClick={handleClose}
          aria-label="Tutup pesan bantuan krisis"
          className="absolute top-3 right-3 p-1 rounded-lg text-[#8F5521]/60 hover:text-[#8F5521] hover:bg-[#F5E1C8]/60 transition-colors"
        >
          <X className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>
    </div>
  );
}
