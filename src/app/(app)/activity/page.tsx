"use client";

import React, { useState, useEffect } from "react";
import { BreathingGarden } from "@/components/wellness/BreathingGarden";
import { SanctuaryGarden } from "@/components/wellness/SanctuaryGarden";
import { MealScannerCard } from "@/components/wellness/MealScannerCard";
import { Mascot } from "@/components/ui/Mascot";
import {
  Heart,
  Check,
  Clock,
  Flame,
  Wind,
  Footprints,
  Dumbbell,
  Moon,
  Plus,
  Salad,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  X,
  Droplets,
  BookOpen,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  desc: string;
  recommendedMin: number;
  category: "mindful" | "body" | "rest" | "nutrition";
  timeSlot?: "pagi" | "siang" | "sore" | "malam";
  timeString?: string;
  isCompleted?: boolean;
}

const DEFAULT_SCHEDULED_ACTIVITIES: ActivityItem[] = [
  // PAGI (06:00 - 10:00)
  {
    id: "sched-1",
    type: "WALKING",
    title: "Minum Air Putih 500 ml & Hirup Udara Segar",
    desc: "Bangunkan sistem metabolisme tubuh dan segarkan paru-paru di pagi hari.",
    recommendedMin: 5,
    category: "nutrition",
    timeSlot: "pagi",
    timeString: "06:30",
  },
  {
    id: "sched-2",
    type: "WORKOUT",
    title: "Peregangan Tubuh & Leher Pagi",
    desc: "Rilis simpul ketegangan otot setelah tidur agar tubuh siap beraktivitas.",
    recommendedMin: 5,
    category: "body",
    timeSlot: "pagi",
    timeString: "07:15",
  },
  {
    id: "sched-3",
    type: "BREATHING",
    title: "Tarik Nafas Hening 1 Menit (Mindful Morning)",
    desc: "Satu menit hening menyelaraskan niat hari ini tanpa tergesa-gesa.",
    recommendedMin: 2,
    category: "mindful",
    timeSlot: "pagi",
    timeString: "08:00",
  },

  // SIANG (11:00 - 14:00)
  {
    id: "sched-4",
    type: "WALKING",
    title: "Makan Siang Sadar Tanpa Menatap Layar",
    desc: "Fokus menikmati rasa makanan, kunyah perlahan untuk kesehatan pencernaan.",
    recommendedMin: 20,
    category: "nutrition",
    timeSlot: "siang",
    timeString: "12:30",
  },
  {
    id: "sched-5",
    type: "REST",
    title: "Jeda Mata 20-20-20 & Relaksasi Otak",
    desc: "Pandang objek berjarak 6 meter selama 20 detik untuk mengistirahatkan mata.",
    recommendedMin: 5,
    category: "rest",
    timeSlot: "siang",
    timeString: "13:30",
  },

  // SORE (15:00 - 18:00)
  {
    id: "sched-6",
    type: "WALKING",
    title: "Jalan Santai / Gerak Fisik 15 Menit",
    desc: "Melangkah ringan di sekitar ruangan atau luar rumah untuk melancarkan sirkulasi.",
    recommendedMin: 15,
    category: "body",
    timeSlot: "sore",
    timeString: "16:30",
  },
  {
    id: "sched-7",
    type: "WALKING",
    title: "Hidrasi Sore & Istirahatkan Pikiran",
    desc: "Minum segelas air dingin atau teh herbal hangat untuk menyegarkan konsentrasi.",
    recommendedMin: 5,
    category: "nutrition",
    timeSlot: "sore",
    timeString: "17:15",
  },

  // MALAM (19:00 - 22:00)
  {
    id: "sched-8",
    type: "BREATHING",
    title: "Latihan Pernapasan 4-7-8 Sebelum Rehat",
    desc: "Aktifkan saraf parasimpatis agar detak jantung tenang menuju tidur nyenyak.",
    recommendedMin: 4,
    category: "mindful",
    timeSlot: "malam",
    timeString: "21:00",
  },
  {
    id: "sched-9",
    type: "SLEEP",
    title: "Digital Sunset (Matikan Notifikasi Gawai)",
    desc: "Redupkan lampu dan simpan ponsel 30 menit sebelum tidur untuk kualitas tidur prima.",
    recommendedMin: 15,
    category: "rest",
    timeSlot: "malam",
    timeString: "22:00",
  },
];

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<"planner" | "nutrition" | "breathing">("planner");
  const [activities, setActivities] = useState<ActivityItem[]>(DEFAULT_SCHEDULED_ACTIVITIES);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [toastMsg, setToastMsg] = useState("");

  // Modal Tambah Rencana Kustom
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState<"pagi" | "siang" | "sore" | "malam">("pagi");
  const [newTimeString, setNewTimeString] = useState("08:30");
  const [newCategory, setNewCategory] = useState<"mindful" | "body" | "rest" | "nutrition">("mindful");
  const [newDuration, setNewDuration] = useState(10);

  // Load state riil dari DB dan localStorage
  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const data = await res.json();
        if (data.recentMeals) {
          setRecentMeals(data.recentMeals);
        }
      }
    } catch (err) {
      console.warn("Gagal memuat aktivitas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "nutrition" || tab === "breathing") {
        setActiveTab(tab as any);
      }
    }

    // Load completed routines & custom activities from localStorage
    try {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      const savedCompleted = localStorage.getItem(`zyba_activity_planner_completed_${today}`);
      if (savedCompleted) {
        setCompletedIds(JSON.parse(savedCompleted));
      }

      const savedCustom = localStorage.getItem(`zyba_activity_planner_custom_${today}`);
      if (savedCustom) {
        const customItems: ActivityItem[] = JSON.parse(savedCustom);
        setActivities([...DEFAULT_SCHEDULED_ACTIVITIES, ...customItems]);
      }
    } catch {}
  }, []);

  const handleToggleActivity = async (act: ActivityItem) => {
    const isNowDone = !completedIds[act.id];
    const newCompleted = { ...completedIds, [act.id]: isNowDone };
    setCompletedIds(newCompleted);

    try {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      localStorage.setItem(`zyba_activity_planner_completed_${today}`, JSON.stringify(newCompleted));

      if (isNowDone) {
        // Sync ke backend activityLog
        const res = await fetch("/api/activity/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: act.type === "BREATHING" ? "BREATHING" : act.type === "WALKING" ? "WALKING" : "WORKOUT",
            durationMin: act.recommendedMin,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setToastMsg(`Rencana selesai! Skor Zyba kamu diperbarui: ${data.newZybaScore}`);
          setTimeout(() => setToastMsg(""), 4000);
        }
      }
    } catch (err) {
      console.warn("Gagal simpan status planner:", err);
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
        setToastMsg(`Sesi bernapas selesai! Skor Zyba: ${data.newZybaScore}`);
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch (_) {}
  };

  const handleAddCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ActivityItem = {
      id: "custom-" + Date.now(),
      type: newCategory === "mindful" ? "BREATHING" : newCategory === "body" ? "WORKOUT" : "WALKING",
      title: newTitle.trim(),
      desc: `Rencana kustom pribadi untuk menjaga ritme keseharianmu.`,
      recommendedMin: Number(newDuration) || 10,
      category: newCategory,
      timeSlot: newTimeSlot,
      timeString: newTimeString || "09:00",
    };

    const updatedActivities = [...activities, newItem];
    setActivities(updatedActivities);

    // Save to localStorage
    try {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      const customOnly = updatedActivities.filter((a) => a.id.startsWith("custom-"));
      localStorage.setItem(`zyba_activity_planner_custom_${today}`, JSON.stringify(customOnly));
    } catch {}

    setNewTitle("");
    setShowAddModal(false);
    setToastMsg("Rencana aktivitas baru berhasil ditambahkan!");
    setTimeout(() => setToastMsg(""), 3500);
  };

  const completedTotal = activities.filter((a) => completedIds[a.id]).length;
  const progressPercent = Math.round((completedTotal / Math.max(1, activities.length)) * 100);

  const filteredActivities = activities.filter((act) => {
    if (selectedTimeFilter !== "all" && act.timeSlot !== selectedTimeFilter) return false;
    if (selectedCategoryFilter !== "all" && act.category !== selectedCategoryFilter) return false;
    return true;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "mindful":
        return { label: "Pikiran", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "body":
        return { label: "Raga", color: "bg-orange-50 text-orange-800 border-orange-200" };
      case "nutrition":
        return { label: "Nutrisi", color: "bg-teal-50 text-teal-800 border-teal-200" };
      case "rest":
        return { label: "Rehat", color: "bg-indigo-50 text-indigo-800 border-indigo-200" };
      default:
        return { label: cat, color: "bg-gray-50 text-gray-800 border-gray-200" };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-[#3E7B54] text-white px-5 py-3 shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Row: Impeccable Craft */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900">
            Smart Activity & Nutrition Planner
          </h1>
          <p className="text-xs sm:text-sm text-brown-700/80 max-w-xl">
            Rencana harian terpadu: jadwal mindful, analisis piring nutrisi AI Zibi, dan latihan pernapasan hening tanpa paksaan.
          </p>
        </div>

        {/* Daily Consistency Widget */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-brown-900/10 shadow-2xs self-start sm:self-auto">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-brown-900">Ritme Terjaga</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 font-bold tabular-nums">
                {completedTotal} / {activities.length} Selesai
              </span>
            </div>
            <p className="text-[10px] text-brown-700/60 mt-0.5">
              Setiap langkah kecil merawat keseimbangan batin
            </p>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation Switcher (Scroll horizontal mulus di mobile) */}
      <div className="flex items-center gap-2 border-b border-brown-900/10 pb-3 w-full max-w-full overflow-x-auto no-scrollbar flex-nowrap scroll-smooth touch-pan-x">
        <button
          type="button"
          onClick={() => setActiveTab("planner")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "planner"
              ? "bg-[#3E7B54] text-white shadow-xs"
              : "bg-white text-brown-700 hover:text-brown-900 border border-brown-900/8 hover:bg-[#F5F8F5]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda & Planner Harian</span>
          <span
            className={`px-2 py-0.2 rounded-full text-[10px] tabular-nums ${
              activeTab === "planner" ? "bg-white/20 text-white" : "bg-brown-900/5 text-brown-700"
            }`}
          >
            {completedTotal}/{activities.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("nutrition")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "nutrition"
              ? "bg-[#3E7B54] text-white shadow-xs"
              : "bg-white text-brown-700 hover:text-brown-900 border border-brown-900/8 hover:bg-[#F5F8F5]"
          }`}
        >
          <Salad className="w-4 h-4" />
          <span>Foto Makanan & Nutrisi AI</span>
          <span
            className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "nutrition" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
            }`}
          >
            AI Vision
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("breathing")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "breathing"
              ? "bg-[#3E7B54] text-white shadow-xs"
              : "bg-white text-brown-700 hover:text-brown-900 border border-brown-900/8 hover:bg-[#F5F8F5]"
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Taman Pernapasan 4-7-8</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: AGENDA & PLANNER HARIAN (Komprehensif & Interaktif)
          ======================================================== */}
      {activeTab === "planner" && (
        <div className="space-y-6">
          {/* Progress Banner & Action Bar */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700/70 block">
                  Capaian Ritme Sadar Hari Ini
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mt-0.5">
                  {completedTotal} dari {activities.length} Aktivitas Selesai ({progressPercent}%)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#3E7B54] text-white text-xs font-bold shadow-xs hover:bg-[#346B48] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambah Rencana Baru</span>
              </button>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-4 h-2.5 w-full rounded-full bg-brown-900/5 overflow-hidden">
              <div
                className="h-full bg-[#3E7B54] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Filters: Waktu & Kategori */}
            <div className="mt-5 pt-4 border-t border-brown-900/8 flex flex-wrap items-center justify-between gap-3">
              {/* Filter Waktu */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-brown-700 mr-1">Waktu:</span>
                {[
                  { id: "all", label: "Semua Jam" },
                  { id: "pagi", label: "Pagi (06-10)" },
                  { id: "siang", label: "Siang (11-14)" },
                  { id: "sore", label: "Sore (15-18)" },
                  { id: "malam", label: "Malam (19-22)" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTimeFilter(t.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      selectedTimeFilter === t.id
                        ? "bg-[#3E7B54] text-white shadow-2xs"
                        : "bg-[#F5F8F5] text-brown-700 hover:text-brown-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Filter Aspek */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-brown-700 mr-1">Aspek:</span>
                {[
                  { id: "all", label: "Semua" },
                  { id: "mindful", label: "Pikiran" },
                  { id: "body", label: "Raga" },
                  { id: "nutrition", label: "Nutrisi" },
                  { id: "rest", label: "Rehat" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(c.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                      selectedCategoryFilter === c.id
                        ? "bg-brown-900 text-white shadow-2xs"
                        : "bg-[#F5F8F5] text-brown-700 hover:text-brown-900"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Timeline Rencana Aktivitas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActivities.map((act) => {
              const isDone = Boolean(completedIds[act.id]);
              const badge = getCategoryBadge(act.category);

              return (
                <div
                  key={act.id}
                  className={`rounded-2xl border p-4.5 transition-all duration-200 flex flex-col justify-between gap-3 ${
                    isDone
                      ? "bg-[#EAF4EC]/60 border-[#C8E4CD]"
                      : "bg-white border-brown-900/10 hover:border-[#3E7B54]/40 hover:shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isDone ? "bg-[#3E7B54] text-white" : "bg-[#F5F8F5] text-[#28583B]"
                        }`}
                      >
                        {act.timeSlot === "pagi" ? (
                          <Sunrise className="w-4 h-4" />
                        ) : act.timeSlot === "siang" ? (
                          <Sun className="w-4 h-4" />
                        ) : act.timeSlot === "sore" ? (
                          <Sunset className="w-4 h-4" />
                        ) : (
                          <Moon className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xs font-bold text-brown-700/80 tabular-nums">
                            {act.timeString || "08:00"}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>

                        <h4
                          className={`text-xs font-bold leading-snug ${
                            isDone ? "line-through text-brown-700/60" : "text-brown-900"
                          }`}
                        >
                          {act.title}
                        </h4>

                        <p className="text-[11px] text-brown-700/70 leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    </div>

                    {/* Checkbox Squircle Button (Bukan buletan radio) */}
                    <button
                      type="button"
                      onClick={() => handleToggleActivity(act)}
                      className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                        isDone
                          ? "bg-[#3E7B54] border-[#3E7B54] text-white shadow-2xs"
                          : "border-brown-900/25 bg-white hover:border-[#3E7B54] hover:bg-emerald-50/60 text-transparent"
                      }`}
                      aria-label={isDone ? "Tandai belum selesai" : "Tandai selesai"}
                    >
                      <Check className="w-4 h-4 stroke-[2.8]" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-brown-900/5 flex items-center justify-between text-[10px] text-brown-700/60">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" />
                      Estimasi: {act.recommendedMin} menit
                    </span>
                    <span className="font-bold text-[#3E7B54]">
                      {isDone ? "✓ Selesai" : "Siap Dilakukan"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="rounded-3xl border border-brown-900/10 bg-white p-12 text-center space-y-3">
              <Mascot pose="happy" size={80} animate={false} decorative={true} />
              <h4 className="font-serif text-lg font-bold text-brown-900">
                Tidak ada rencana dalam filter ini
              </h4>
              <p className="text-xs text-brown-700/70">
                Ubah filter waktu atau tambahkan rencana baru untuk mengisinya.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: FOTO MAKANAN & NUTRISI AI (MEAL SNAP & FEEDBACK)
          ======================================================== */}
      {activeTab === "nutrition" && (
        <MealScannerCard
          initialMeals={recentMeals}
          onMealSaved={() => fetchActivities()}
        />
      )}

      {/* ========================================================
          TAB 3: TAMAN PERNAPASAN 4-7-8 & RELAKSASI
          ======================================================== */}
      {activeTab === "breathing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <BreathingGarden onSessionComplete={handleBreathingFinished} />

            <div className="rounded-3xl border border-brown-900/10 bg-gradient-to-br from-cream/90 via-white to-emerald-50/30 p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-5">
              <div className="shrink-0 flex items-center justify-center">
                <Mascot pose="happy" size={130} />
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#3E7B54]">
                  <Heart className="w-3.5 h-3.5" />
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
          </div>

          <div className="lg:col-span-5 space-y-6">
            <SanctuaryGarden
              daysWatered={completedTotal > 0 ? 5 : 4}
              totalGoal={7}
              isWateredToday={completedTotal > 0}
            />

            <div className="rounded-3xl border border-brown-900/10 bg-white p-6 shadow-xs space-y-3">
              <h3 className="font-serif text-base font-bold text-brown-900">
                Manfaat Ritme Konsisten
              </h3>
              <p className="text-xs text-brown-700/80 leading-relaxed">
                Menjaga rutinitas kecil setiap hari melatih plastisitas otak untuk tetap tenang dalam tekanan dan meningkatkan kualitas tidur di malam hari.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH RENCANA KUSTOM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-brown-900/10 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-brown-900/8">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF4EC] text-[#28583B]">
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brown-900">
                  Tambah Rencana Pribadi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-brown-700/60 hover:text-brown-900 hover:bg-brown-900/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brown-900 mb-1">
                  Nama Aktivitas / Rencana
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Baca buku 15 menit, Minum teh hangat..."
                  className="w-full h-10 px-3.5 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1">
                    Waktu Hari
                  </label>
                  <select
                    value={newTimeSlot}
                    onChange={(e: any) => setNewTimeSlot(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                  >
                    <option value="pagi">Pagi (06-10)</option>
                    <option value="siang">Siang (11-14)</option>
                    <option value="sore">Sore (15-18)</option>
                    <option value="malam">Malam (19-22)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1">
                    Jam Target
                  </label>
                  <input
                    type="time"
                    value={newTimeString}
                    onChange={(e) => setNewTimeString(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1">
                    Aspek / Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                  >
                    <option value="mindful">Pikiran (Mindful)</option>
                    <option value="body">Raga (Fisik)</option>
                    <option value="nutrition">Nutrisi & Hidrasi</option>
                    <option value="rest">Rehat & Istirahat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1">
                    Durasi (menit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value, 10) || 5)}
                    className="w-full h-10 px-3 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brown-700 hover:bg-brown-900/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3E7B54] text-white text-xs font-bold shadow-xs hover:bg-[#346B48] transition-all"
                >
                  Simpan Rencana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
