"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Check, Volume2, VolumeX, Wind, Sparkles } from "lucide-react";

interface BreathingGardenProps {
  onSessionComplete?: (durationMin: number) => void;
}

type BreathPhase = "idle" | "inhale" | "hold" | "exhale" | "completed";

const PHASE_CONFIG: Record<
  Exclude<BreathPhase, "idle" | "completed">,
  { label: string; sublabel: string; duration: number; ringColor: string; bgPulse: string }
> = {
  inhale: {
    label: "Tarik Napas",
    sublabel: "Tarik napas perlahan lewat hidung, rasakan dadamu mengembang...",
    duration: 4,
    ringColor: "#3E7B54",
    bgPulse: "scale-115 bg-emerald-100/70 shadow-[0_0_50px_rgba(62,123,84,0.18)]",
  },
  hold: {
    label: "Tahan Napas",
    sublabel: "Pertahankan keheningan sejenak, biarkan oksigen meresap...",
    duration: 7,
    ringColor: "#F2884B",
    bgPulse: "scale-115 bg-amber-50/80 shadow-[0_0_50px_rgba(242,136,75,0.2)]",
  },
  exhale: {
    label: "Hembuskan",
    sublabel: "Lepaskan beban perlahan lewat mulut, kendurkan bahumu...",
    duration: 8,
    ringColor: "#2D5A3D",
    bgPulse: "scale-90 bg-cream/80 shadow-none",
  },
};

const TOTAL_CYCLES = 3;

export function BreathingGarden({ onSessionComplete }: BreathingGardenProps) {
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [cycle, setCycle] = useState(1);
  const [countdown, setCountdown] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sintesis nada bel tibet halus alami via Web Audio API
  const playGentleBell = (freq = 432) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Fundamental tone + overtone for peaceful harmonic ring
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.6);
      osc2.stop(ctx.currentTime + 1.6);
    } catch (_) {}
  };

  useEffect(() => {
    if (phase === "idle" || phase === "completed") return;

    let timer: NodeJS.Timeout;
    if (countdown > 1) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      // Pergantian fase
      if (phase === "inhale") {
        playGentleBell(528); // 528 Hz - Nada pemulihan
        setPhase("hold");
        setCountdown(PHASE_CONFIG.hold.duration);
      } else if (phase === "hold") {
        playGentleBell(396); // 396 Hz - Nada ketenangan
        setPhase("exhale");
        setCountdown(PHASE_CONFIG.exhale.duration);
      } else if (phase === "exhale") {
        playGentleBell(432); // 432 Hz - Harmoni batin
        if (cycle < TOTAL_CYCLES) {
          setCycle((prev) => prev + 1);
          setPhase("inhale");
          setCountdown(PHASE_CONFIG.inhale.duration);
        } else {
          setPhase("completed");
          onSessionComplete?.(3);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [phase, countdown, cycle, onSessionComplete]);

  const startBreathing = () => {
    setCycle(1);
    setPhase("inhale");
    setCountdown(PHASE_CONFIG.inhale.duration);
    playGentleBell(432);
  };

  const resetBreathing = () => {
    setPhase("idle");
    setCycle(1);
    setCountdown(4);
  };

  // Hitung persentase durasi fase aktif untuk progress ring
  const currentTotalDuration =
    phase !== "idle" && phase !== "completed" ? PHASE_CONFIG[phase].duration : 1;
  const progressRatio = (currentTotalDuration - countdown + 1) / currentTotalDuration;
  const strokeDashoffset = 565 - 565 * Math.min(1, Math.max(0, progressRatio));

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(27,36,30,0.06)] flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[420px]">
      {/* Background Zen Glow */}
      <div className="absolute inset-0 bg-radial from-emerald-50/40 via-transparent to-transparent pointer-events-none" />

      {/* Top Bar: Method Pill & Controls */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#3E7B54] text-xs font-semibold border border-emerald-200/50">
          <Wind className="w-3.5 h-3.5" />
          <span>Ritme Napas 4-7-8</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-all ${
              soundEnabled
                ? "bg-emerald-100 text-[#3E7B54]"
                : "text-brown-700/60 hover:text-brown-900 hover:bg-cream"
            }`}
            title={soundEnabled ? "Nada panduan aktif" : "Aktifkan nada panduan"}
            aria-label="Toggle nada panduan"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {phase !== "idle" && (
            <button
              type="button"
              onClick={resetBreathing}
              className="p-2 rounded-xl text-brown-700/60 hover:text-brown-900 hover:bg-cream transition-all"
              title="Mulai ulang dari siklus 1"
              aria-label="Mulai ulang"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Central Breathing Visualization */}
      <div className="relative my-6 flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
        {/* Animated Organic Backdrop Ring */}
        <div
          className={`absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full transition-all duration-1000 ease-in-out motion-reduce:transform-none ${
            phase === "idle"
              ? "bg-cream/60 border border-dashed border-[#3E7B54]/25"
              : phase === "completed"
              ? "bg-emerald-100 border-2 border-[#3E7B54]"
              : PHASE_CONFIG[phase].bgPulse
          }`}
        />

        {/* SVG Progress Ring */}
        {phase !== "idle" && phase !== "completed" && (
          <svg className="absolute w-64 h-64 sm:w-72 sm:h-72 -rotate-90 pointer-events-none">
            <circle
              cx="50%"
              cy="50%"
              r="90"
              fill="transparent"
              stroke="rgba(27, 36, 30, 0.06)"
              strokeWidth="4"
            />
            <circle
              cx="50%"
              cy="50%"
              r="90"
              fill="transparent"
              stroke={PHASE_CONFIG[phase].ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="565"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        )}

        {/* Center Content Typography */}
        <div className="relative z-10 px-6 max-w-[220px] space-y-1.5">
          {phase === "idle" && (
            <>
              <h3 className="font-serif text-lg font-bold text-brown-900">
                Taman Bernapas
              </h3>
              <p className="text-xs text-brown-700/70 leading-relaxed">
                3 siklus napas terpandu untuk menurunkan hormon stres dan mengistirahatkan pikiran.
              </p>
            </>
          )}

          {(phase === "inhale" || phase === "hold" || phase === "exhale") && (
            <div className="space-y-1">
              <span className="font-mono text-5xl font-black text-brown-900 block tracking-tight">
                {countdown}
              </span>
              <p className="font-serif text-base font-bold text-brown-900">
                {PHASE_CONFIG[phase].label}
              </p>
              <p className="text-[11px] text-brown-700/75 leading-relaxed">
                {PHASE_CONFIG[phase].sublabel}
              </p>
            </div>
          )}

          {phase === "completed" && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-full bg-[#3E7B54] text-white mx-auto flex items-center justify-center shadow-md">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-base font-bold text-brown-900">
                Langkah yang Baik
              </h3>
              <p className="text-xs text-brown-700/70 leading-relaxed">
                Napasmu kini lebih selaras. Rasakan ketenangan lembut di rongga dadamu.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cycle Dots & Action Controls */}
      <div className="w-full mt-2 z-10 flex flex-col items-center gap-3.5">
        {phase !== "idle" && phase !== "completed" && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brown-700/60 uppercase tracking-wider">
              Siklus {cycle} dari {TOTAL_CYCLES}
            </span>
            <div className="flex gap-1.5 items-center">
              {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i + 1 === cycle
                      ? "w-4 h-2 bg-[#3E7B54]"
                      : i + 1 < cycle
                      ? "w-2 h-2 bg-[#3E7B54]/60"
                      : "w-2 h-2 bg-brown-900/15"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "idle" && (
          <button
            type="button"
            onClick={startBreathing}
            className="px-6 py-3 rounded-full bg-[#3E7B54] hover:bg-[#346B48] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all hover:shadow active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mulai Sesi Bernapas</span>
          </button>
        )}

        {phase === "completed" && (
          <button
            type="button"
            onClick={resetBreathing}
            className="px-6 py-2.5 rounded-full bg-cream hover:bg-cream/80 text-brown-900 font-bold text-xs flex items-center gap-2 border border-brown-900/10 transition-all shadow-2xs hover:border-[#3E7B54]/30"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#3E7B54]" />
            <span>Ulangi Sesi</span>
          </button>
        )}
      </div>
    </div>
  );
}
