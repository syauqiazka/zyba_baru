"use client";

import React, { useState, useEffect } from "react";
import { Wind } from "lucide-react";

interface BreathingOrbProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function BreathingOrb({
  size = "md",
  className = "",
  showText = true,
}: BreathingOrbProps) {
  const [phase, setPhase] = useState<"Tarik Nafas" | "Tahan" | "Hembuskan">("Tarik Nafas");
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    // Siklus bernafas santai 4-4-6
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            if (currentPhase === "Tarik Nafas") {
              setSeconds(4);
              return "Tahan";
            } else if (currentPhase === "Tahan") {
              setSeconds(6);
              return "Hembuskan";
            } else {
              setSeconds(4);
              return "Tarik Nafas";
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "h-28 w-28",
    md: "h-44 w-44 md:h-52 md:w-52",
    lg: "h-64 w-64 md:h-72 md:w-72",
  }[size];

  const scaleClass =
    phase === "Tarik Nafas"
      ? "scale-110"
      : phase === "Tahan"
      ? "scale-105"
      : "scale-90";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Lingkaran Luar Aura Berpendar Lembut */}
        <div
          className={`absolute rounded-full bg-gradient-to-tr from-orange-400/15 via-sand-300/25 to-sage-200/20 blur-xl transition-all duration-[3000ms] ease-out motion-reduce:transition-none ${sizeClasses} ${scaleClass}`}
        />

        {/* Lingkaran Tengah Tertekstur */}
        <div
          className={`relative flex items-center justify-center rounded-full border border-orange-500/20 bg-gradient-to-b from-white/90 to-orange-50/70 shadow-[0_8px_32px_rgba(224,122,95,0.12)] backdrop-blur-md transition-all duration-[2500ms] ease-out motion-reduce:transition-none ${sizeClasses} ${scaleClass}`}
        >
          {/* Inti Cahaya Mekar */}
          <div className="flex flex-col items-center text-center px-4">
            <Wind className="h-5 w-5 text-orange-600 stroke-[1.8] mb-1" />
            <span className="font-serif text-sm md:text-base font-bold text-brown-900 transition-opacity duration-500">
              {phase}
            </span>
            <span className="text-[11px] font-semibold text-orange-950 mt-0.5">
              {seconds}s
            </span>
          </div>
        </div>
      </div>

      {showText && (
        <p className="mt-4 text-center text-xs text-brown-700/80 max-w-xs leading-relaxed">
          Iramakan nafasmu sejenak. Biarkan detak hari ini melambat secara alami.
        </p>
      )}
    </div>
  );
}

