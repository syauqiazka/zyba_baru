"use client";

import React, { useState, useEffect } from "react";
import { BreathingGarden } from "@/components/wellness/BreathingGarden";
import { SanctuaryGarden } from "@/components/wellness/SanctuaryGarden";
import { Mascot } from "@/components/ui/Mascot";
import {
  Sparkles,
  Check,
  Clock,
  Flame,
  Wind,
  Footprints,
  Dumbbell,
  Moon,
  HeartHandshake,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  recommendedMin: number;
  category: "mindful" | "body" | "rest";
  isCompleted?: boolean;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.templates || []);
        setCompletedCount(data.completedCount || 0);
      }
    } catch (err) {
      console.warn("Gagal memuat aktivitas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleToggleActivity = async (act: ActivityItem) => {
    if (updatingId || act.isCompleted) return;
    setUpdatingId(act.id);

    try {
      const res = await fetch("/api/activity/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: act.type,
          durationMin: act.recommendedMin,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActivities((prev) =>
          prev.map((a) => (a.id === act.id ? { ...a, isCompleted: true } : a))
        );
        setCompletedCount((c) => c + 1);
        setToastMsg(`Aktivitas selesai! Zyba Score kamu naik ke ${data.newZybaScore}`);
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch (err) {
      console.error("Gagal mencatat aktivitas:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBreathingFinished = async (durationMin: number) => {
    try {
      const res = await fetch("/api/activity/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "BREATHING",
          durationMin,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActivities((prev) =>
          prev.map((a) => (a.type === "BREATHING" ? { ...a, isCompleted: true } : a))
        );
        setCompletedCount((c) => c + 1);
        setToastMsg(`Sesi bernapas selesai! Zyba Score: ${data.newZybaScore}`);
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch (_) {}
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "BREATHING":
        return <Wind className="w-4 h-4 text-[#3E7B54]" />;
      case "WALKING":
        return <Footprints className="w-4 h-4 text-emerald-700" />;
      case "WORKOUT":
        return <Dumbbell className="w-4 h-4 text-orange-600" />;
      case "SLEEP":
        return <Moon className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#3E7B54]" />;
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (selectedFilter === "all") return true;
    return act.category === selectedFilter;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-[#3E7B54] text-white px-5 py-3 shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Row: Impeccable Craft (No eyebrow, balanced heading) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900">
            Smart Activity Planner
          </h1>
          <p className="text-xs sm:text-sm text-brown-700/70 max-w-xl">
            Langkah-langkah mikro tanpa paksaan untuk menjaga keutuhan ritme tubuh dan kedamaian pikiranmu.
          </p>
        </div>

        {/* Daily Consistency Hearth Flame Widget */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-brown-900/10 shadow-2xs self-start sm:self-auto">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brown-900">Hearth Flame</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100/70 text-orange-800 font-bold">
                Hari ini Aktif
              </span>
            </div>
            <p className="text-[10px] text-brown-700/60 mt-0.5">
              Konsistensi hangat tanpa beban streak
            </p>
          </div>
        </div>
      </div>

      {/* Main 65:35 Asymmetric Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Breathing Sanctuary Garden (65% -> 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <BreathingGarden onSessionComplete={handleBreathingFinished} />

          {/* Kotak Refleksi Zibi Bebas Kotak (Box-Free Mascot Living Sanctuary) */}
          <div className="rounded-3xl border border-brown-900/10 bg-gradient-to-br from-cream/90 via-white to-emerald-50/30 p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-5">
            <div className="shrink-0 flex items-center justify-center">
              <Mascot
                pose="happy"
                size={130}
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#3E7B54]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pesan Teduh dari Zibi</span>
              </div>
              <p className="text-xs text-brown-900/90 leading-relaxed font-serif italic">
                &ldquo;Tarik napas dalam-dalam, hembuskan perlahan. Hari ini tidak perlu terburu-buru, kamu sudah melangkah sejauh ini.&rdquo;
              </p>
              <p className="text-[10px] text-brown-700/60">
                Latihan 3 menit pernapasan menurunkan detak jantung hingga 8-12 bpm.
              </p>
            </div>
          </div>

          {/* Taman Batin (Sanctuary Garden) */}
          <SanctuaryGarden
            daysWatered={completedCount > 0 ? 5 : 4}
            totalGoal={7}
            isWateredToday={completedCount > 0}
          />
        </div>

        {/* Kolom Kanan: Rekomendasi Mikro Harian (35% -> 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="font-serif text-lg font-bold text-brown-900">
                Aktivitas Mikro Hari Ini
              </h2>
              <p className="text-xs text-brown-700/60">
                {completedCount} dari {activities.length} aktivitas selesai
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 bg-cream/70 p-1 rounded-xl border border-brown-900/5">
              {[
                { id: "all", label: "Semua" },
                { id: "mindful", label: "Pikiran" },
                { id: "body", label: "Fisik" },
                { id: "rest", label: "Rehat" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    selectedFilter === f.id
                      ? "bg-white text-brown-900 shadow-2xs"
                      : "text-brown-700/60 hover:text-brown-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-xs text-brown-700/60">
                Memuat rekomendasi aktivitas...
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-brown-700/60">
                Tidak ada aktivitas dalam kategori ini.
              </div>
            ) : (
              filteredActivities.map((act) => {
                const isUpdating = updatingId === act.id;
                return (
                  <div
                    key={act.id}
                    className={`rounded-2xl border p-4 transition-all duration-200 flex items-start justify-between gap-3 ${
                      act.isCompleted
                        ? "bg-emerald-50/40 border-emerald-200/50"
                        : "bg-white border-brown-900/10 hover:border-[#3E7B54]/40 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          act.isCompleted ? "bg-emerald-100" : "bg-cream"
                        }`}
                      >
                        {getIconForType(act.type)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-xs font-bold ${
                              act.isCompleted
                                ? "line-through text-brown-700/50"
                                : "text-brown-900"
                            }`}
                          >
                            {act.title}
                          </h3>
                        </div>

                        <p className="text-[11px] text-brown-700/70 leading-relaxed">
                          {act.desc}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5 text-[10px] text-brown-700/50">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {act.recommendedMin} menit
                          </span>
                          <span>•</span>
                          <span className="capitalize">{act.category}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={Boolean(act.isCompleted) || isUpdating}
                      onClick={() => handleToggleActivity(act)}
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        act.isCompleted
                          ? "bg-[#3E7B54] border-[#3E7B54] text-white cursor-default"
                          : "border-brown-900/20 hover:border-[#3E7B54] hover:bg-emerald-50 text-transparent hover:text-[#3E7B54]"
                      }`}
                      title={act.isCompleted ? "Selesai hari ini" : "Tandai selesai"}
                      aria-label={act.isCompleted ? "Aktivitas telah selesai" : "Tandai aktivitas selesai"}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
