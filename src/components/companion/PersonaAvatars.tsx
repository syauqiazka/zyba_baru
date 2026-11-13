"use client";

import React from "react";
import { Mascot } from "@/components/ui/Mascot";
import { PersonaId } from "@/backend/ai/personas";

export interface PersonaAvatarProps {
  id?: PersonaId | string;
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * PersonaAvatar ZYBA — Menampilkan Maskot Resmi ZYBA (Zibi).
 * Sesuai arahan: Seluruh persona lama (Kina, Ollie, Rubi, Bruno) telah dihapus
 * dan digantikan secara tunggal oleh Maskot Zibi.
 */
export function PersonaAvatar({
  id = "ZIBI",
  size = 40,
  className = "",
  animate = false,
}: PersonaAvatarProps) {
  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <Mascot
        pose="default"
        size={size}
        animate={animate}
        decorative={false}
      />
    </div>
  );
}
