"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Camera,
  Heart,
  Check,
  AlertCircle,
  MessageSquareWarning,
  Flame,
  Salad,
  Apple,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";

interface MealLogItem {
  id: string;
  foodName: string;
  calories: number;
  proteinGrams?: number | null;
  carbsGrams?: number | null;
  fatGrams?: number | null;
  fiberGrams?: number | null;
  healthScore?: number | null;
  notes?: string | null;
  imageUrl?: string | null;
  complaintNotes?: string | null;
  isCorrected?: boolean;
  createdAt: string | Date;
}

interface MealScannerCardProps {
  initialMeals?: MealLogItem[];
  onMealSaved?: () => void;
}

const PRESET_MEALS = [
  {
    name: "Nasi Ayam Panggang & Lalapan",
    note: "Nasi putih, dada ayam panggang, sambal terasi sedikit, timun dan kemangi segar",
  },
  {
    name: "Gado-Gado Segar & Tahu Tempe",
    note: "Sayur kangkung, tauge, tahu rebus, tempe bacem, bumbu kacang lembut",
  },
  {
    name: "Bowl Buah Segar & Oatmeal",
    note: "Oatmeal gandum, pisang iris, stroberi, madu hutan, biji chia",
  },
  {
    name: "Nasi Padang Rendang & Sayur Nangka",
    note: "Nasi separuh, daging rendang empuk, daun singkong rebus, kuah gulai sedikit",
  },
];

export function MealScannerCard({ initialMeals = [], onMealSaved }: MealScannerCardProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [userNote, setUserNote] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  // Current active analysis result
  const [currentResult, setCurrentResult] = useState<{
    id?: string;
    foodName: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams: number;
    healthScore: number;
    mindfulReview: string;
    recommendation: string;
    isCorrected?: boolean;
    complaintNotes?: string;
  } | null>(null);

  // Meal history
  const [meals, setMeals] = useState<MealLogItem[]>(initialMeals);

  // Correction / Complaint form states
  const [showCorrectionForm, setShowCorrectionForm] = useState<boolean>(false);
  const [correctedFoodName, setCorrectedFoodName] = useState<string>("");
  const [correctedCalories, setCorrectedCalories] = useState<string>("");
  const [complaintNotes, setComplaintNotes] = useState<string>("");
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Format file harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran foto maksimal 5 MB.");
      return;
    }

    setErrorMsg("");
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (overridePreset?: string) => {
    setAnalyzing(true);
    setErrorMsg("");
    setFeedbackSuccessMsg("");

    try {
      const res = await fetch("/api/activity/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType,
          userNote,
          samplePreset: overridePreset,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menganalisis piring makanan.");

      const analysis = data.analysis;
      const log = data.mealLog;

      const newResult = {
        id: log?.id,
        foodName: analysis.foodName,
        calories: analysis.calories,
        proteinGrams: analysis.proteinGrams,
        carbsGrams: analysis.carbsGrams,
        fatGrams: analysis.fatGrams,
        fiberGrams: analysis.fiberGrams,
        healthScore: analysis.healthScore,
        mindfulReview: analysis.mindfulReview,
        recommendation: analysis.recommendation,
        isCorrected: false,
      };

      setCurrentResult(newResult);
      setCorrectedFoodName(analysis.foodName);
      setCorrectedCalories(String(analysis.calories));

      // Append to local list
      if (log) {
        setMeals((prev) => [log, ...prev]);
        onMealSaved?.();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kendala saat menganalisis foto.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleChoosePreset = (preset: { name: string; note: string }) => {
    setUserNote(preset.note);
    setImagePreview(null);
    handleAnalyze(preset.name + " — " + preset.note);
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResult?.id) return;
    if (!complaintNotes.trim()) {
      setErrorMsg("Mohon tuliskan catatan koreksi atau bagian mana yang kurang sesuai.");
      return;
    }

    setSubmittingFeedback(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/activity/meal-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealLogId: currentResult.id,
          correctedFoodName: correctedFoodName.trim() || currentResult.foodName,
          correctedCalories: correctedCalories ? parseInt(correctedCalories, 10) : currentResult.calories,
          complaintNotes: complaintNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan koreksi.");

      const finalCal = correctedCalories ? parseInt(correctedCalories, 10) : currentResult.calories;
      const finalName = correctedFoodName.trim() || currentResult.foodName;

      setCurrentResult((prev) =>
        prev
          ? {
              ...prev,
              foodName: finalName,
              calories: finalCal,
              isCorrected: true,
              complaintNotes: complaintNotes.trim(),
            }
          : null
      );

      setMeals((prev) =>
        prev.map((m) =>
          m.id === currentResult.id
            ? {
                ...m,
                foodName: finalName,
                calories: finalCal,
                isCorrected: true,
                complaintNotes: complaintNotes.trim(),
              }
            : m
        )
      );

      setFeedbackSuccessMsg(data.message || "Koreksi berhasil disimpan! Zibi belajar dari catatanmu.");
      setShowCorrectionForm(false);
      setComplaintNotes("");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengirim koreksi.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & AI Intro */}
      <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brown-900/8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF4EC] text-[#28583B]">
                <Salad className="h-4 w-4" />
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                Penganalisis Piring Nutrisi AI Zibi
              </h2>
            </div>
            <p className="text-xs text-brown-700/80 leading-relaxed max-w-xl">
              Unggah foto piring makananmu atau pilih menu harian. AI Zibi mengestimasi kalori & makronutrien dengan pendekatan mindful tanpa rasa bersalah.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF4EC] border border-[#C8E4CD] text-[#28583B] text-[11px] font-bold shrink-0 shadow-2xs">
            <Heart className="h-3.5 w-3.5" />
            <span>AI Multimodal Adaptif</span>
          </div>
        </div>

        {/* 2. Upload / Selection Area */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sisi Kiri: Drag & Drop / Input Foto */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[190px] ${
                imagePreview
                  ? "border-[#3E7B54] bg-[#F5F8F5]"
                  : "border-brown-900/15 bg-[#F5F8F5] hover:border-[#3E7B54]/60 hover:bg-[#EAF4EC]/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full max-h-[180px] flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Pratinjau Piring Makanan"
                    className="max-h-[140px] w-auto rounded-xl object-contain shadow-xs border border-brown-900/10"
                  />
                  <span className="mt-2 text-[11px] font-bold text-[#3E7B54] flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Klik untuk ganti foto
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#3E7B54] shadow-xs">
                    <Camera className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brown-900 block">
                      Klik atau Tarik Foto Makanan ke Sini
                    </span>
                    <span className="text-[10px] text-brown-700/60 block mt-0.5">
                      Mendukung format JPG, PNG, atau WEBP (Maksimal 5MB)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Catatan Tambahan Porsi */}
            <div>
              <label className="block text-[11px] font-bold text-brown-900 mb-1">
                Catatan Piring / Bahan Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Misal: porsi setengah nasi merah, dada ayam tanpa kulit..."
                className="w-full h-10 px-3.5 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:border-[#3E7B54] focus:ring-1 focus:ring-[#3E7B54]"
              />
            </div>

            {/* Tombol Aksi Analisis */}
            <button
              type="button"
              disabled={analyzing || (!imagePreview && !userNote.trim())}
              onClick={() => handleAnalyze()}
              className="w-full h-11 rounded-2xl bg-[#3E7B54] text-white text-xs font-bold shadow-xs hover:bg-[#346B48] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Zibi sedang menganalisis komposisi nutrisi...</span>
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  <span>Analisis Piring Nutrisi dengan AI Zibi</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Menu Cepat / Presets Makanan Populer */}
          <div className="lg:col-span-6 space-y-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-brown-700/70">
              Atau Pilih Contoh Piring Harian (Tanpa Foto)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_MEALS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={analyzing}
                  onClick={() => handleChoosePreset(preset)}
                  className="p-3 rounded-2xl border border-brown-900/8 bg-[#F5F8F5] text-left hover:bg-white hover:border-[#3E7B54]/40 hover:shadow-2xs transition-all duration-200 group"
                >
                  <span className="block text-xs font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors">
                    {preset.name}
                  </span>
                  <span className="block text-[10px] text-brown-700/70 leading-relaxed mt-0.5 line-clamp-2">
                    {preset.note}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EAF4EC]/70 border border-[#C8E4CD] flex items-center gap-3">
              <Mascot pose="happy" size={54} animate={false} decorative={true} />
              <div className="text-[11px] text-[#28583B] leading-relaxed">
                <strong>Mindful Eating:</strong> Makan adalah momen menyegarkan raga. ZYBA tidak pernah menghitung kalori untuk membebani, melainkan membantu memberi bahan bakar sadar bagi energimu.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hasil Analisis AI Terkini */}
      {currentResult && (
        <div className="rounded-3xl border border-[#C8E4CD] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brown-900/8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-2.5 py-0.5 rounded-full bg-[#EAF4EC] border border-[#C8E4CD]">
                  Hasil Analisis Piring
                </span>
                {currentResult.isCorrected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300">
                    ✓ Terverifikasi Pengguna
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mt-1">
                {currentResult.foodName}
              </h3>
            </div>

            <div className="flex items-baseline gap-1.5 px-4 py-2 rounded-2xl bg-[#F5F8F5] border border-brown-900/8">
              <span className="font-display text-3xl font-extrabold text-brown-900 tabular-nums">
                {currentResult.calories}
              </span>
              <span className="text-xs font-bold text-brown-700">kkal</span>
            </div>
          </div>

          {/* Grid Makronutrien (Normal Lining Numbers) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F5F8F5] border border-brown-900/8">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brown-700/80 block">
                Protein
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-xl font-bold text-brown-900 tabular-nums">
                  {currentResult.proteinGrams}
                </span>
                <span className="text-[11px] text-brown-700">g</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-brown-900/10 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${Math.min(100, (currentResult.proteinGrams / 50) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F8F5] border border-brown-900/8">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brown-700/80 block">
                Karbohidrat
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-xl font-bold text-brown-900 tabular-nums">
                  {currentResult.carbsGrams}
                </span>
                <span className="text-[11px] text-brown-700">g</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-brown-900/10 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (currentResult.carbsGrams / 80) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F8F5] border border-brown-900/8">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brown-700/80 block">
                Lemak
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-xl font-bold text-brown-900 tabular-nums">
                  {currentResult.fatGrams}
                </span>
                <span className="text-[11px] text-brown-700">g</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-brown-900/10 overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full"
                  style={{ width: `${Math.min(100, (currentResult.fatGrams / 40) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F8F5] border border-brown-900/8">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brown-700/80 block">
                Serat
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-xl font-bold text-brown-900 tabular-nums">
                  {currentResult.fiberGrams}
                </span>
                <span className="text-[11px] text-brown-700">g</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-brown-900/10 overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${Math.min(100, (currentResult.fiberGrams / 15) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ulasan Mindful Zibi */}
          <div className="rounded-2xl bg-[#EAF4EC] border border-[#C8E4CD] p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="shrink-0">
              <Mascot pose="happy" size={72} animate={false} decorative={true} />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-[#28583B] flex items-center justify-center sm:justify-start gap-1">
                <Heart className="h-3.5 w-3.5" />
                Catatan Mindful Zibi
              </span>
              <p className="text-xs text-brown-900 leading-relaxed font-serif italic">
                &ldquo;{currentResult.mindfulReview}&rdquo;
              </p>
              <p className="text-[11px] text-[#28583B] pt-0.5">
                💡 <strong>Tips Sehat:</strong> {currentResult.recommendation}
              </p>
            </div>
          </div>

          {/* Pesan Sukses Koreksi jika ada */}
          {feedbackSuccessMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 animate-in fade-in duration-300">
              <Check className="h-4 w-4 shrink-0 text-emerald-600 stroke-[3]" />
              <span>{feedbackSuccessMsg}</span>
            </div>
          )}

          {/* 4. FITUR KOMPLAIN / KOREKSI PENGGUNA (FEEDBACK LOOP AGAR AI BELAJAR) */}
          <div className="pt-2 border-t border-brown-900/8">
            <button
              type="button"
              onClick={() => setShowCorrectionForm(!showCorrectionForm)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] hover:text-[#28583B] transition-colors"
            >
              <MessageSquareWarning className="h-4 w-4" />
              <span>
                {showCorrectionForm
                  ? "Tutup formulir koreksi"
                  : "Estimasi kalori atau porsi kurang tepat? Ajukan Koreksi / Komplain ke AI"}
              </span>
              {showCorrectionForm ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showCorrectionForm && (
              <form onSubmit={handleSubmitCorrection} className="mt-4 p-5 rounded-2xl bg-[#F5F8F5] border border-brown-900/10 space-y-3.5">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-brown-900">
                    Bantu Zibi Belajar & Berkembang
                  </h4>
                  <p className="text-[11px] text-brown-700/70 leading-relaxed">
                    Masukanmu akan disimpan ke riwayat dan dipelajari oleh model Zibi agar estimasi porsi dan bahan makananmu berikutnya semakin presisi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-brown-900 mb-1">
                      Nama Hidangan Sebenarnya
                    </label>
                    <input
                      type="text"
                      value={correctedFoodName}
                      onChange={(e) => setCorrectedFoodName(e.target.value)}
                      placeholder="Nama makanan sebenarnya..."
                      className="w-full h-10 px-3 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brown-900 mb-1">
                      Koreksi Kalori menurutmu (kkal)
                    </label>
                    <input
                      type="number"
                      value={correctedCalories}
                      onChange={(e) => setCorrectedCalories(e.target.value)}
                      placeholder="Contoh: 380"
                      className="w-full h-10 px-3 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brown-900 mb-1">
                    Catatan Koreksi / Komplain (Wajib)
                  </label>
                  <textarea
                    rows={2}
                    value={complaintNotes}
                    onChange={(e) => setComplaintNotes(e.target.value)}
                    placeholder="Contoh: Ayamnya direbus bukan digoreng, porsi nasi hanya 1/2 centong, minyak sangat sedikit..."
                    className="w-full p-3 rounded-xl border border-brown-900/15 bg-white text-xs text-brown-900 focus:outline-none focus:border-[#3E7B54]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-brown-700 hover:bg-brown-900/5 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2 rounded-xl bg-[#3E7B54] text-white text-xs font-bold hover:bg-[#346B48] disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {submittingFeedback ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Menyimpan Masukan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Kirim Koreksi & Latih AI</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. Riwayat Piring Terakhir Hari Ini */}
      {meals.length > 0 && (
        <div className="rounded-3xl border border-brown-900/10 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-brown-900">
              Riwayat Piring Makanan Hari Ini
            </h3>
            <span className="text-xs text-brown-700/60 font-semibold">
              {meals.length} piring tercatat
            </span>
          </div>

          <div className="divide-y divide-brown-900/8">
            {meals.map((meal) => (
              <div key={meal.id} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-brown-900">
                      {meal.foodName}
                    </h4>
                    {meal.isCorrected && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.2 rounded-md border border-amber-200">
                        Dikoreksi
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-brown-700/60 mt-1">
                    <span>Protein: {meal.proteinGrams || "-"}g</span>
                    <span>•</span>
                    <span>Karbo: {meal.carbsGrams || "-"}g</span>
                    <span>•</span>
                    <span>Lemak: {meal.fatGrams || "-"}g</span>
                    {meal.complaintNotes && (
                      <>
                        <span>•</span>
                        <span className="italic text-brown-700/80">
                          Catatan: &ldquo;{meal.complaintNotes}&rdquo;
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-display text-sm font-bold text-brown-900 tabular-nums">
                    {meal.calories} kkal
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
