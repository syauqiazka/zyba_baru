"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import mascotPoses from "@/lib/mascotPoses.json";
import { MASCOT_NAME } from "@/lib/brand";

export type MascotPose = keyof typeof mascotPoses;

export interface MascotProps {
  pose?: MascotPose;
  size?: number; // default 160, dibatasi maks 197
  decorative?: boolean; // default true
  className?: string;
  animate?: boolean; // default true (animasi napas 4s)
}

// Dimensi kanvas seragam dari semua file uniform/
const UNIFORM_ORIGINAL_WIDTH = 197;
const UNIFORM_ORIGINAL_HEIGHT = 189;
const MAX_UNIFORM_SIZE = 197;

// Dimensi kanvas hero_menyapa.png
const HERO_ORIGINAL_WIDTH = 348;
const HERO_ORIGINAL_HEIGHT = 391;
const MAX_HERO_WIDTH = 348;

export function getMascotFilePath(pose: MascotPose = "default"): string {
  const fileKey = mascotPoses[pose] || mascotPoses.default;
  return `/mascot/uniform/${fileKey}.png`;
}

/**
 * Komponen Maskot Utama ZYBA
 * Menampilkan SATU pose maskot resmi dengan Next.js Image.
 */
export function Mascot({
  pose = "default",
  size = 160,
  decorative = true,
  className = "",
  animate = true,
}: MascotProps) {
  // Batasi ukuran maksimal 197 CSS px sesuai Aturan Keras 3
  const clampedSize = Math.max(24, Math.min(size, MAX_UNIFORM_SIZE));
  const calculatedHeight = Math.round(
    clampedSize * (UNIFORM_ORIGINAL_HEIGHT / UNIFORM_ORIGINAL_WIDTH)
  );

  const imageSrc = getMascotFilePath(pose);
  const altText = decorative ? "" : `Maskot ZYBA, ${MASCOT_NAME}`;

  return (
    <div
      className={`relative inline-block select-none ${
        animate ? "animate-mascot-breathe" : ""
      } ${className}`}
      style={{
        width: clampedSize,
        height: calculatedHeight,
      }}
      aria-hidden={decorative ? "true" : undefined}
    >
      <Image
        src={imageSrc}
        alt={altText}
        width={UNIFORM_ORIGINAL_WIDTH}
        height={UNIFORM_ORIGINAL_HEIGHT}
        className="w-full h-full object-contain pointer-events-none"
        sizes={`${clampedSize}px`}
        unoptimized
      />
    </div>
  );
}

/**
 * Varian MascotCrossfade untuk pose yang berubah dinamis (mis. status Companion)
 * Menumpuk pose aktif dan pose sebelumnya dengan transisi opacity 300ms.
 */
export function MascotCrossfade({
  pose = "default",
  size = 160,
  decorative = true,
  className = "",
  animate = true,
}: MascotProps) {
  const [currentPose, setCurrentPose] = useState<MascotPose>(pose);
  const [prevPose, setPrevPose] = useState<MascotPose | null>(null);

  useEffect(() => {
    if (pose !== currentPose) {
      setPrevPose(currentPose);
      setCurrentPose(pose);
      const timer = setTimeout(() => {
        setPrevPose(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pose, currentPose]);

  const clampedSize = Math.max(24, Math.min(size, MAX_UNIFORM_SIZE));
  const calculatedHeight = Math.round(
    clampedSize * (UNIFORM_ORIGINAL_HEIGHT / UNIFORM_ORIGINAL_WIDTH)
  );
  const altText = decorative ? "" : `Maskot ZYBA, ${MASCOT_NAME}`;

  return (
    <div
      className={`relative inline-block select-none ${
        animate ? "animate-mascot-breathe" : ""
      } ${className}`}
      style={{
        width: clampedSize,
        height: calculatedHeight,
      }}
      aria-hidden={decorative ? "true" : undefined}
    >
      {prevPose && (
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none">
          <Image
            src={getMascotFilePath(prevPose)}
            alt=""
            width={UNIFORM_ORIGINAL_WIDTH}
            height={UNIFORM_ORIGINAL_HEIGHT}
            className="w-full h-full object-contain"
            sizes={`${clampedSize}px`}
            unoptimized
          />
        </div>
      )}
      <div className="absolute inset-0 transition-opacity duration-300 opacity-100">
        <Image
          src={getMascotFilePath(currentPose)}
          alt={altText}
          width={UNIFORM_ORIGINAL_WIDTH}
          height={UNIFORM_ORIGINAL_HEIGHT}
          className="w-full h-full object-contain"
          sizes={`${clampedSize}px`}
          unoptimized
        />
      </div>
    </div>
  );
}

export interface MascotHeroProps {
  size?: number; // default 348, dibatasi maks 348
  priority?: boolean;
  decorative?: boolean;
  className?: string;
  animate?: boolean;
}

/**
 * Komponen Khusus Hero Landing Page (memakai hero_menyapa.png)
 * Dibatasi maksimal 348 x 391 CSS px.
 */
export function MascotHero({
  size = 348,
  priority = true,
  decorative = false,
  className = "",
  animate = true,
}: MascotHeroProps) {
  const clampedWidth = Math.max(64, Math.min(size, MAX_HERO_WIDTH));
  const calculatedHeight = Math.round(
    clampedWidth * (HERO_ORIGINAL_HEIGHT / HERO_ORIGINAL_WIDTH)
  );
  const altText = decorative ? "" : `Maskot ZYBA, ${MASCOT_NAME}`;

  return (
    <div
      className={`relative inline-block select-none ${
        animate ? "animate-mascot-breathe" : ""
      } ${className}`}
      style={{
        width: clampedWidth,
        height: calculatedHeight,
      }}
      aria-hidden={decorative ? "true" : undefined}
    >
      <Image
        src="/mascot/hero.png"
        alt={altText}
        width={HERO_ORIGINAL_WIDTH}
        height={HERO_ORIGINAL_HEIGHT}
        className="w-full h-full object-contain pointer-events-none"
        sizes={`${clampedWidth}px`}
        priority={priority}
        unoptimized
      />
    </div>
  );
}

