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

const TIME_SLOTS = [
  {
    id: "pagi",
    label: "Pagi Hari",
    hours: "06:00 – 10:00",
    desc: "Awali hari dengan kesegaran & niat hening",
    icon: Sunrise,
    iconBg: "bg-amber-100/90",
    iconColor: "text-amber-800",
  },
  {
    id: "siang",
    label: "Siang Hari",
    hours: "11:00 – 14:00",
    desc: "Menjaga fokus sadar & asupan nutrisi seimbang",
    icon: Sun,
    iconBg: "bg-emerald-100/90",
    iconColor: "text-[#28583B]",
  },
  {
    id: "sore",
    label: "Sore Hari",
    hours: "15:00 – 18:00",
    desc: "Regangkan raga & pulihkan energi dari lelah",
    icon: Sunset,
    iconBg: "bg-orange-100/90",
    iconColor: "text-orange-800",
  },
  {
    id: "malam",
    label: "Malam Hari",
    hours: "19:00 – 22:00",
    desc: "Lepaskan beban pikiran menuju rehat lelap",
    icon: Moon,
    iconBg: "bg-indigo-100/90",
    iconColor: "text-indigo-800",
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
    <div className="space-y-8 pb-36 sm:pb-36 md:pb-16">
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
          {/* Progress Banner & Filter Bar */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
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
            <div className="h-2 w-full rounded-full bg-brown-900/5 overflow-hidden">
              <div
                className="h-full bg-[#3E7B54] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Filter Waktu & Kategori (Responsif, Scrollable di Mobile) */}
            <div className="pt-3 border-t border-brown-900/8 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Filter Waktu */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <span className="text-[11px] font-bold text-brown-700 mr-1 shrink-0">Waktu:</span>
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
                    className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
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
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <span className="text-[11px] font-bold text-brown-700 mr-1 shrink-0">Aspek:</span>
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
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold shrink-0 transition-all ${
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

          {/* MAIN 2-COLUMN DESKTOP SPLIT / 1-COLUMN MOBILE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT / MAIN COLUMN (8 Cols): Grouped Time Blocks */}
            <div className="lg:col-span-8 space-y-6">
              {TIME_SLOTS.filter((slot) => {
                if (selectedTimeFilter !== "all" && slot.id !== selectedTimeFilter) return false;
                const slotActivities = filteredActivities.filter((a) => a.timeSlot === slot.id);
                return slotActivities.length > 0;
              }).map((slot) => {
                const slotActivities = filteredActivities.filter((a) => a.timeSlot === slot.id);
                const SlotIcon = slot.icon;
                const slotDoneCount = slotActivities.filter((a) => completedIds[a.id]).length;

                return (
                  <div
                    key={slot.id}
                    className="rounded-3xl border border-brown-900/10 bg-white overflow-hidden shadow-2xs transition-all"
                  >
                    {/* Time Slot Header */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#F5F8F5]/80 via-white to-[#F5F8F5]/50 border-b border-brown-900/6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${slot.iconBg} ${slot.iconColor}`}
                        >
                          <SlotIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-sm sm:text-base font-bold text-brown-900">
                              {slot.label}
                            </h3>
                            <span className="text-[10px] sm:text-xs text-brown-700/60 font-medium tabular-nums">
                              ({slot.hours})
                            </span>
                          </div>
                          <p className="text-[11px] text-brown-700/60 hidden sm:block">
                            {slot.desc}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-[#3E7B54] bg-emerald-100/70 px-2.5 py-0.5 rounded-full tabular-nums">
                        {slotDoneCount}/{slotActivities.length} Selesai
                      </span>
                    </div>

                    {/* Activity Item Rows */}
                    <div className="divide-y divide-brown-900/6">
                      {slotActivities.map((act) => {
                        const isDone = Boolean(completedIds[act.id]);
                        const badge = getCategoryBadge(act.category);

                        return (
                          <div
                            key={act.id}
                            onClick={() => handleToggleActivity(act)}
                            className={`group px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-150 cursor-pointer select-none ${
                              isDone
                                ? "bg-emerald-50/30 hover:bg-emerald-50/50"
                                : "hover:bg-[#F5F8F5]/80 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                              {/* Checkbox Squircle */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleActivity(act);
                                }}
                                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 ${
                                  isDone
                                    ? "bg-[#3E7B54] border-[#3E7B54] text-white shadow-2xs"
                                    : "border-brown-900/25 bg-white group-hover:border-[#3E7B54] text-transparent"
                                }`}
                                aria-label={isDone ? "Tandai belum selesai" : "Tandai selesai"}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 stroke-[3] ${
                                    isDone ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                              </button>

                              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-display text-xs font-bold text-brown-900 tabular-nums">
                                    {act.timeString || "08:00"}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${badge.color}`}
                                  >
                                    {badge.label}
                                  </span>
                                  <span className="text-[10px] text-brown-700/60 flex items-center gap-1 font-medium">
                                    <Clock className="w-2.5 h-2.5" />
                                    {act.recommendedMin} menit
                                  </span>
                                </div>

                                <h4
                                  className={`text-xs sm:text-sm font-bold leading-snug transition-colors ${
                                    isDone
                                      ? "line-through text-brown-700/50"
                                      : "text-brown-900 group-hover:text-[#3E7B54]"
                                  }`}
                                >
                                  {act.title}
                                </h4>

                                <p
                                  className={`text-[11px] leading-relaxed hidden sm:block ${
                                    isDone
                                      ? "text-brown-700/40 line-through"
                                      : "text-brown-700/70"
                                  }`}
                                >
                                  {act.desc}
                                </p>
                              </div>
                            </div>

                            {/* Right Action Badge */}
                            <div className="shrink-0">
                              <span
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                                  isDone
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-brown-900/5 text-brown-700 group-hover:bg-[#3E7B54] group-hover:text-white"
                                }`}
                              >
                                {isDone ? "Selesai" : "Mulai"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

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

            {/* RIGHT COLUMN (4 Cols): Desktop Zen Sanctuary Sidebar */}
            <div className="hidden lg:flex lg:col-span-4 flex-col space-y-5 sticky top-20">
              {/* Mascot Zibi Mindful Message */}
              <div className="rounded-3xl border border-brown-900/10 bg-gradient-to-br from-cream/90 via-white to-emerald-50/40 p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-3">
                  <Mascot pose="happy" size={48} animate={false} decorative={true} />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E7B54] block">
                      Teman Suaka ZYBA
                    </span>
                    <h4 className="font-serif text-sm font-bold text-brown-900">
                      Zibi Menemani Harimu
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-brown-800/80 leading-relaxed font-serif italic">
                  &ldquo;Tidak perlu menyelesaikan semua rencana sekaligus jika tubuh terasa lelah. Satu hembusan napas hening adalah awal pemulihan.&rdquo;
                </p>

                <div className="pt-2 border-t border-brown-900/6 flex items-center justify-between text-[11px] font-bold text-brown-700/70">
                  <span>Konsistensi Lembut</span>
                  <span className="text-[#3E7B54]">{progressPercent}% Ritme Hari Ini</span>
                </div>
              </div>

              {/* Quick Launchers */}
              <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-xs space-y-3">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-brown-700/70">
                  Aksi Cepat Suaka
                </h4>

                <button
                  type="button"
                  onClick={() => setActiveTab("breathing")}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-brown-900/8 hover:border-[#3E7B54]/40 hover:bg-[#F5F8F5] transition-all group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors block">
                        Latihan Napas 4-7-8
                      </span>
                      <span className="text-[10px] text-brown-700/60">
                        Redakan cemas dalam 3 menit
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-brown-700/40 group-hover:text-[#3E7B54] font-bold transition-colors">
                    →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("nutrition")}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-brown-900/8 hover:border-[#3E7B54]/40 hover:bg-[#F5F8F5] transition-all group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Salad className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors block">
                        Scan Nutrisi Piring AI
                      </span>
                      <span className="text-[10px] text-brown-700/60">
                        Evaluasi mindful pola makan
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-brown-700/40 group-hover:text-[#3E7B54] font-bold transition-colors">
                    →
                  </span>
                </button>
              </div>
            </div>

          </div>
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
