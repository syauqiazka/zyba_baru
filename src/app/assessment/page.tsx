"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  KinaIllustration,
  OllieIllustration,
  RubiIllustration,
  BrunoIllustration,
} from "@/components/illustrations/PersonaIllustrations";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Bell,
  Heart,
  Sparkles,
  PhoneCall,
  Smile,
  AlertCircle,
} from "lucide-react";
import { detectRisk } from "@/lib/crisisDetection";

const STEPS = [
  { id: 1, label: "Persona & Profil" },
  { id: 2, label: "Kata Sandi" },
  { id: 3, label: "Verifikasi" },
  { id: 4, label: "Biometrik" },
  { id: 5, label: "Notifikasi" },
  { id: 6, label: "Kuisioner" },
  { id: 7, label: "Kompilasi" },
  { id: 8, label: "Selesai" },
];

const PERSONAS = [
  {
    key: "KINA",
    name: "Kina",
    desc: "Empatik, lembut, dan mendengarkan keluh kesahmu tanpa menghakimi.",
    illustration: KinaIllustration,
  },
  {
    key: "OLLIE",
    name: "Ollie",
    desc: "Bijak, analitis, dan membantumu menyusun sudut pandang baru yang rasional.",
    illustration: OllieIllustration,
  },
  {
    key: "RUBI",
    name: "Rubi",
    desc: "Hangat, ceria, dan memberi energi positif untuk bangkit dari kelesuan.",
    illustration: RubiIllustration,
  },
  {
    key: "BRUNO",
    name: "Bruno",
    desc: "Kokoh, tenang, dan melindungi ruang amanmu seperti figur pelindung.",
    illustration: BrunoIllustration,
  },
];

const MOOD_OPTIONS = [
  { key: "DEPRESSED", label: "Terpuruk", color: "bg-[#A99BE0]" },
  { key: "SAD", label: "Sedih", color: "bg-[#EE8A5E]" },
  { key: "NEUTRAL", label: "Datar", color: "bg-[#6B5645]" },
  { key: "HAPPY", label: "Nyaman", color: "bg-[#E8C24A]" },
  { key: "OVERJOYED", label: "Semangat", color: "bg-[#8FAE5D]" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Profil
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("KINA");

  // Step 4: Biometrik
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Step 5: Notifikasi
  const [companionNotif, setCompanionNotif] = useState(true);
  const [wellnessNotif, setWellnessNotif] = useState(true);
  const [communityNotif, setCommunityNotif] = useState(false);

  // Step 6: Questionnaire Form (State string untuk numerik sesuai AGENTS.md §7.1)
  const [goal, setGoal] = useState("Mengurangi overthinking & cemas");
  const [gender, setGender] = useState("Memilih tidak menyebutkan");
  const [age, setAge] = useState("20");
  const [weightKg, setWeightKg] = useState("55");
  const [initialMood, setInitialMood] = useState("NEUTRAL");
  const [helpHistory, setHelpHistory] = useState("Hanya cerita ke teman");
  const [physicalSymptoms, setPhysicalSymptoms] = useState("Sulit tidur / insomnia");
  const [sleepQuality, setSleepQuality] = useState("3");
  const [stressLevel, setStressLevel] = useState("6");
  const [medication, setMedication] = useState("Tidak ada");
  const [mentalSymptoms, setMentalSymptoms] = useState("Overthinking malam hari");
  const [expressionText, setExpressionText] = useState("");

  // Risk detection state on free text
  const [riskAlert, setRiskAlert] = useState(false);

  // Preload user info on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (data.user.name) setName(data.user.name);
          if (data.user.companionPersona) setSelectedPersona(data.user.companionPersona);
        }
      })
      .catch(() => {});
  }, []);

  // Monitor expression text for crisis risk
  useEffect(() => {
    if (expressionText) {
      const risk = detectRisk(expressionText);
      setRiskAlert(risk.flagged);
    } else {
      setRiskAlert(false);
    }
  }, [expressionText]);

  // Handle compiling step timer
  useEffect(() => {
    if (currentStep === 7) {
      const timer = setTimeout(() => {
        setCurrentStep(8);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep !== 7 && currentStep !== 8) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const payload = {
        username,
        companionPersona: selectedPersona,
        notifications: {
          companionNotif,
          wellnessNotif,
          communityNotif,
        },
        questionnaire: {
          goal,
          gender,
          age,
          weightKg,
          initialMood,
          helpHistory,
          physicalSymptoms,
          sleepQuality,
          stressLevel,
          medication,
          mentalSymptoms,
          expressionText,
        },
      };

      const res = await fetch("/api/assessment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Gagal menyimpan asesmen. Silakan coba kembali.");
        setSubmitting(false);
      }
    } catch {
      alert("Terjadi kendala jaringan saat menyimpan asesmen.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-brown-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar with Mobile Progress */}
      <header className="max-w-4xl mx-auto w-full pb-6">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brown-900 text-cream flex items-center justify-center font-display font-extrabold text-sm">
              Z
            </div>
            <span className="font-display font-bold text-base text-brown-900">
              Inisiasi Ruang Tenang
            </span>
          </div>

          <Badge variant="warm" pill>
            Langkah {currentStep} dari 8
          </Badge>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-brown-900/10 overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="max-w-4xl mx-auto w-full my-auto py-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Desktop Stepper (4 cols) */}
          <div className="hidden md:block md:col-span-4 space-y-3">
            <Card variant="content" elevation={1} className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brown-700/80">
                TAHAP ASESMEN
              </span>
              <div className="space-y-1.5">
                {STEPS.map((s) => {
                  const isDone = currentStep > s.id;
                  const isCurrent = currentStep === s.id;

                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isCurrent
                          ? "bg-orange-100 text-brown-900 font-bold"
                          : isDone
                          ? "text-brown-700 hover:bg-cream"
                          : "text-brown-700/50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          isDone
                            ? "bg-green-100 text-brown-900"
                            : isCurrent
                            ? "bg-orange-500 text-brown-900"
                            : "bg-brown-900/10 text-brown-700"
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 text-brown-900" strokeWidth={2} /> : s.id}
                      </div>
                      <span>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Main Interaction Card (8 cols) */}
          <div className="md:col-span-8">
            <Card variant="content" elevation={2} className="min-h-[460px] flex flex-col justify-between">
              {/* STEP 1: Persona & Profil */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <Badge variant="warm" pill>LANGKAH 1</Badge>
                    <h2 className="font-display text-2xl font-bold text-brown-900">
                      Pilih Sahabat Batinmu & Profil
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-brown-700">
                      Persona ini akan menemani percakapanmu di Zyba Companion.
                    </p>
                  </div>

                  {/* Persona Selector Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PERSONAS.map((p) => {
                      const Icon = p.illustration;
                      const isSelected = selectedPersona === p.key;

                      return (
                        <div
                          key={p.key}
                          onClick={() => setSelectedPersona(p.key)}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center gap-3.5 select-none ${
                            isSelected
                              ? "border-2 border-orange-500 bg-orange-100/70 shadow-xs"
                              : "border-brown-900/10 bg-white hover:border-orange-500/40 hover:bg-orange-500/[0.04]"
                          }`}
                        >
                          <Icon size={44} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-display font-bold text-sm text-brown-900">
                                {p.name}
                              </h3>
                              {isSelected && <Check className="w-4 h-4 text-orange-500" strokeWidth={2.5} />}
                            </div>
                            <p className="text-[11px] text-brown-700/80 leading-normal line-clamp-2 mt-0.5">
                              {p.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Input
                      id="name-input"
                      type="text"
                      label="Nama Panggilan"
                      placeholder="Contoh: Rian"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      id="username-input"
                      type="text"
                      label="Username Unik (Opsional)"
                      placeholder="rian_wellness"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Kata Sandi */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <Badge variant="warm" pill>LANGKAH 2</Badge>
                    <h2 className="font-display text-2xl font-bold text-brown-900">
                      Keamanan Kata Sandi
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-brown-700">
                      Kata sandimu telah dienkripsi dengan algoritma bcrypt tingkat tinggi.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-cream border border-brown-900/10 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-brown-900">
                        <ShieldCheck className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm text-brown-900">
                          Akun Terproteksi Aman
                        </h3>
                        <p className="text-xs text-brown-700">
                          Kredensial loginmu telah terdaftar dan siap digunakan kapan saja.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Verifikasi Status */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <Badge variant="warm" pill>LANGKAH 3</Badge>
                    <h2 className="font-display text-2xl font-bold text-brown-900">
                      Status Identitas Terverifikasi
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-brown-700">
                      Emailmu telah berhasil divalidasi melalui kode OTP aman.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-green-100/50 border border-brown-900/10 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-brown-900">
                      <Check className="w-5 h-5 text-brown-900" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-brown-900">
                        Email Resmi Terhubung
                      </h3>
                      <p className="text-xs text-brown-700">
                        Kamu tidak perlu melakukan verifikasi ulang di sesi berikutnya.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Proteksi Biometrik (Opsional) */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <Badge variant="warm" pill>LANGKAH 4</Badge>
                    <h2 className="font-display text-2xl font-bold text-brown-900">
                      Proteksi Biometrik Cepat
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-brown-700">
                      Gunakan sensor sidik jari atau Face Unlock untuk masuk lebih cepat (opsional).
                    </p>
                  </div>

                  <div
                    onClick={() => setBiometricEnabled((prev) => !prev)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                      biometricEnabled
                        ? "border-2 border-orange-500 bg-orange-100"
                        : "border-brown-900/10 bg-white hover:border-orange-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-brown-900">
                        <Sparkles className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm text-brown-900">
                          Aktifkan Masuk dengan Sidik Jari
                        </h3>
                        <p className="text-xs text-brown-700">
                          {biometricEnabled ? "Diaktifkan di perangkat ini" : "Klik untuk mengaktifkan"}
                        </p>
                      </div>
                    </div>
                    {biometricEnabled && <Check className="w-5 h-5 text-orange-500" strokeWidth={2} />}
                  </div>
                </div>
              )}

              {/* STEP 5: Preferensi Notifikasi */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <Badge variant="warm" pill>LANGKAH 5</Badge>
                    <h2 className="font-display text-2xl font-bold text-brown-900">
                      Pengingat & Notifikasi
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-brown-700">
                      Pilih notifikasi lembut yang ingin kamu terima tanpa rasa terganggu.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-brown-900/10 bg-white cursor-pointer hover:border-orange-500/30">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-brown-900">Sapaan Lembut Companion</span>
                        <p className="text-[11px] text-brown-700">Pengingat hangat saat kamu butuh teman cerita.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={companionNotif}
                        onChange={(e) => setCompanionNotif(e.target.checked)}
                        className="w-5 h-5 rounded accent-orange-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-brown-900/10 bg-white cursor-pointer hover:border-orange-500/30">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-brown-900">Jeda Napas & Check-In</span>
                        <p className="text-[11px] text-brown-700">Pengingat waktu istirahat dan mindful breathing.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={wellnessNotif}
                        onChange={(e) => setWellnessNotif(e.target.checked)}
                        className="w-5 h-5 rounded accent-orange-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-brown-900/10 bg-white cursor-pointer hover:border-orange-500/30">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-brown-900">Kabar Komunitas Zyba</span>
                        <p className="text-[11px] text-brown-700">Notifikasi tanggapan cerita di ruang komunitas.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={communityNotif}
                        onChange={(e) => setCommunityNotif(e.target.checked)}
                        className="w-5 h-5 rounded accent-orange-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 6: Kuesioner Holistik & Expression Analysis */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-200 max-h-[480px] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <Badge variant="warm" pill>LANGKAH 6</Badge>
                    <h2 className="font-display text-2xl font-bold text-brown-900">
                      Kondisi & Refleksi Batinmu
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-brown-700">
                      Jawabanmu membantu membentuk rekomendasi awal yang relevan.
                    </p>
                  </div>

                  {/* Mood Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brown-700/80">
                      Bagaimana perasaanmu sekarang?
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {MOOD_OPTIONS.map((m) => {
                        const isSelected = initialMood === m.key;
                        return (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => setInitialMood(m.key)}
                            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all select-none ${
                              isSelected
                                ? "border-2 border-orange-500 bg-orange-100 shadow-xs"
                                : "border-brown-900/10 bg-white hover:border-orange-500/40"
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full ${m.color}`} />
                            <span className="text-[11px] font-semibold text-brown-900">
                              {m.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Usia & Berat Badan (State String sesuai D11) */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="age-input"
                      type="tel"
                      label="Usia (Tahun)"
                      value={age}
                      onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                      placeholder="20"
                    />
                    <Input
                      id="weight-input"
                      type="tel"
                      label="Perkiraan Berat (Kg)"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value.replace(/\D/g, ""))}
                      placeholder="55"
                    />
                  </div>

                  {/* Tingkat Stres 1 - 10 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brown-700/80">
                        Tingkat Beban Pikiran / Stres: {stressLevel} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(e.target.value)}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brown-700/60 font-semibold">
                      <span>Tenang (1)</span>
                      <span>Sedang (5)</span>
                      <span>Sangat Berat (10)</span>
                    </div>
                  </div>

                  {/* Expression Analysis (Teks Bebas dengan detectRisk) */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brown-700/80">
                      Expression Analysis — Cerita Bebas
                    </span>
                    <Textarea
                      id="expression-text"
                      placeholder="Tuliskan apa pun yang sedang membebani pikiranmu secara bebas... kami mendengarkan."
                      value={expressionText}
                      onChange={(e) => setExpressionText(e.target.value)}
                    />
                    {riskAlert && (
                      <div className="p-3.5 rounded-xl bg-orange-100 border border-orange-500/30 flex items-start gap-2.5 animate-in fade-in duration-200">
                        <AlertCircle className="w-5 h-5 text-brown-900 shrink-0 mt-0.5" strokeWidth={1.8} />
                        <div className="text-xs text-brown-900 space-y-1">
                          <p className="font-semibold">Kami peduli padamu.</p>
                          <p className="leading-relaxed">
                            Jika kamu sedang merasa sangat berat atau membutuhkan seseorang saat ini, bantuan profesional gratis selalu siap mendengarkan di <strong>Sejiwa (119 ext. 8)</strong>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 7: Layar Kompilasi */}
              {currentStep === 7 && (
                <div className="my-auto py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-3xl bg-orange-100 border border-brown-900/10 mx-auto flex items-center justify-center animate-pulse duration-1000">
                    <Sparkles className="w-8 h-8 text-brown-900" strokeWidth={1.8} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl font-bold text-brown-900">
                      Menyiapkan Ruang Tenangmu...
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-brown-700 max-w-sm mx-auto leading-relaxed">
                      Menyelaraskan ritme batin dan menghitung baseline Zyba Score pertamamu.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 8: Selesai */}
              {currentStep === 8 && (
                <div className="my-auto py-8 text-center space-y-6 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center text-brown-900">
                    <Check className="w-8 h-8 text-brown-900" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <Badge variant="vitality" pill>SELESAI</Badge>
                    <h2 className="font-display text-3xl font-extrabold text-brown-900">
                      Selamat Datang di ZYBA
                    </h2>
                    <p className="font-body text-sm text-brown-700 leading-relaxed">
                      Ruang perlindunganmu telah siap. Mulai hari ini dengan sapaan lembut atau luangkan sejenak waktu untuk bernapas.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Card Navigation */}
              <div className="pt-6 border-t border-brown-900/10 flex items-center justify-between">
                {currentStep > 1 && currentStep < 7 ? (
                  <Button variant="outline" size="sm" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 text-brown-900" strokeWidth={1.8} />
                    <span>Kembali</span>
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 7 && (
                  <Button variant="warm" size="md" onClick={handleNext}>
                    <span>{currentStep === 6 ? "Kompilasi Data" : "Lanjutkan"}</span>
                    <ArrowRight className="w-4 h-4 text-brown-900" strokeWidth={1.8} />
                  </Button>
                )}

                {currentStep === 8 && (
                  <Button
                    variant="warm"
                    size="lg"
                    fullWidth
                    disabled={submitting}
                    onClick={handleComplete}
                  >
                    <span>{submitting ? "Membuka Dashboard..." : "Masuk ke Dashboard Sekarang"}</span>
                    <ArrowRight className="w-4 h-4 text-brown-900" strokeWidth={1.8} />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-brown-700/60 pt-4">
        ZYBA — The Tactile Sanctuary. Privasi & Keselamatan Terlindungi.
      </footer>
    </div>
  );
}

