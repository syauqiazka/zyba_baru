"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Headphones, Sparkles, Wind, Waves } from "lucide-react";

interface AudioTrack {
  id: string;
  title: string;
  desc: string;
  durationMin: number;
  toneFreq: number;
}

interface AudioRelaxPlayerProps {
  tracks: AudioTrack[];
}

export function AudioRelaxPlayer({ tracks }: AudioRelaxPlayerProps) {
  const [activeTrackId, setActiveTrackId] = useState<string>(tracks[0]?.id || "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscRef2 = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (_) {}
      oscRef.current = null;
    }
    if (oscRef2.current) {
      try {
        oscRef2.current.stop();
        oscRef2.current.disconnect();
      } catch (_) {}
      oscRef2.current = null;
    }
    setIsPlaying(false);
  };

  const startAudio = (freq: number) => {
    stopAudio();
    if (typeof window === "undefined") return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Binaural/harmonik ganda untuk ambience lembut tanpa klik
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = "sine";
      // Sedikit detuning (1.5 Hz binaural beat) untuk merangsang gelombang theta otak
      osc2.frequency.setValueAtTime(freq + 1.5, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.12, ctx.currentTime + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      oscRef.current = osc1;
      oscRef2.current = osc2;
      gainRef.current = gain;
      setIsPlaying(true);
    } catch (err) {
      console.warn("Gagal memulai audio generator:", err);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else if (activeTrack) {
      startAudio(activeTrack.toneFreq);
    }
  };

  const selectTrack = (track: AudioTrack) => {
    setActiveTrackId(track.id);
    if (isPlaying) {
      startAudio(track.toneFreq);
    }
  };

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(
        isPlaying ? volume * 0.12 : 0,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isPlaying]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-gradient-to-br from-white via-cream/30 to-emerald-50/40 p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(27,36,30,0.06)] space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#3E7B54] flex items-center justify-center shrink-0 shadow-2xs">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-brown-900">
                Audio Relaksasi & Gelombang Batin
              </h3>
              {isPlaying && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold animate-pulse motion-reduce:animate-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E7B54]" />
                  Mengalun
                </span>
              )}
            </div>
            <p className="text-xs text-brown-700/70 mt-0.5">
              Generator frekuensi harmonik binaural untuk meredakan ketegangan sistem saraf
            </p>
          </div>
        </div>

        {/* Master Play Control & Volume */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Waveform Animation Bars */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-6 px-2">
              <span className="w-1 bg-[#3E7B54] rounded-full animate-[bounce_1s_infinite_100ms] motion-reduce:animate-none h-3" />
              <span className="w-1 bg-[#3E7B54] rounded-full animate-[bounce_1s_infinite_300ms] motion-reduce:animate-none h-6" />
              <span className="w-1 bg-[#3E7B54] rounded-full animate-[bounce_1s_infinite_200ms] motion-reduce:animate-none h-4" />
              <span className="w-1 bg-[#3E7B54] rounded-full animate-[bounce_1s_infinite_400ms] motion-reduce:animate-none h-5" />
            </div>
          )}

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-brown-900/10 shadow-2xs">
            <button
              type="button"
              onClick={() => setVolume((v) => (v > 0 ? 0 : 0.4))}
              className="text-brown-700/60 hover:text-brown-900 transition-colors"
              title={volume === 0 ? "Batal bisu" : "Bisukan"}
              aria-label="Toggle mute"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4 text-orange-600" /> : <Volume2 className="w-4 h-4 text-[#3E7B54]" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-[#3E7B54] cursor-pointer"
              title={`Volume: ${Math.round(volume * 100)}%`}
              aria-label="Volume audio"
            />
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className="px-5 py-2.5 rounded-full bg-[#3E7B54] hover:bg-[#346B48] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Putar Nada</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Track Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tracks.map((t) => {
          const isSelected = t.id === activeTrackId;
          const isThisPlaying = isSelected && isPlaying;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTrack(t)}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? "bg-white border-[#3E7B54] shadow-xs ring-2 ring-[#3E7B54]/15"
                  : "bg-white/80 border-brown-900/10 hover:bg-white hover:border-[#3E7B54]/40 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-brown-900 truncate">
                  {t.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-[#3E7B54] font-bold">
                  {t.toneFreq} Hz
                </span>
              </div>

              <p className="text-[11px] text-brown-700/70 leading-relaxed line-clamp-2">
                {t.desc}
              </p>

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-brown-900/5 text-[10px] text-brown-700/50">
                <span>{t.durationMin} menit sesi</span>
                <span className="font-semibold text-[#3E7B54] group-hover:underline">
                  {isThisPlaying ? "Sedang Mengalun" : isSelected ? "Trek Terpilih" : "Pilih Trek"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
