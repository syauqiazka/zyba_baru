"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Eye,
  EyeOff,
  Check,
  Lock,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";
import { MASCOT_NAME } from "@/lib/brand";
import { BreathingOrb } from "@/components/wellness/BreathingOrb";
import {
  KinaIllustration,
  OllieIllustration,
  RubiIllustration,
  BrunoIllustration,
} from "@/components/illustrations/PersonaIllustrations";

const PERSONA_PREVIEWS = [
  {
    id: "KINA",
    name: "Kina",
    role: "Pendengar Hangat",
    quote: "Ceritakan apa pun yang terasa berat hari ini. Aku ada di sini mendengarmu.",
    illustration: KinaIllustration,
  },
  {
    id: "OLLIE",
    name: "Ollie",
    role: "Refleksi Terstruktur",
    quote: "Mari kita urai kerumitan pikiranmu perlahan, langkah demi langkah.",
    illustration: OllieIllustration,
  },
  {
    id: "RUBI",
    name: "Rubi",
    role: "Penyemangat Ceria",
    quote: "Bahkan di hari paling mendung, selalu ada secercah hangat yang bisa kita syukuri!",
    illustration: RubiIllustration,
  },
  {
    id: "BRUNO",
    name: "Bruno",
    role: "Jangkar Tenang",
    quote: "Tarik nafas dalam-dalam. Bersamaku, kamu aman untuk berhenti sejenak.",
    illustration: BrunoIllustration,
  },
];

const ONBOARDING_SLIDES = [
  {
    id: "welcome",
    pose: "default" as const,
    badge: "Langkah Awal",
    title: "Selamat Datang di Ruang Aman ZYBA",
    desc: `Kenalkan, aku ${MASCOT_NAME}. Aku hadir menemani perjalanan kesehatan pikiran dan jiwamu secara sadar, tanpa tekanan.`,
  },
  {
    id: "growth",
    pose: "happy" as const,
    badge: "Kemenangan Kecil",
    title: "Rayakan Setiap Langkah Kecilmu",
    desc: "Tidak ada target streak yang membebani. Setiap jeda nafas dan check-in jujur adalah wujud kepedulian tulus untuk dirimu.",
  },
  {
    id: "listen",
    pose: "listening" as const,
    badge: "Selalu Hadir",
    title: "Selalu Siap Mendengar Kapan Pun",
    desc: "Saat pikiran terasa riuh dan harimu berat, kami selalu di sini untuk menyimak ceritamu dalam ruang hening yang aman.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState(0);

  // Form states
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // OTP Verification state
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const activePersona = PERSONA_PREVIEWS[selectedPersona];
  const PersonaIcon = activePersona.illustration;

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "register" && !name.trim()) {
      setErrorMsg("Nama lengkap atau panggilan wajib diisi.");
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal masuk");
        router.push(data.redirectUrl || "/dashboard");
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mendaftar");

        setRegisteredEmail(email);
        setStep("otp");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setErrorMsg("Masukkan 6 digit kode verifikasi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kode verifikasi salah atau kedaluwarsa.");

      router.push("/assessment");
    } catch (err: any) {
      setErrorMsg(err.message || "Verifikasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-brown-900 selection:bg-orange-200">
      {/* Top Ambient Bar */}
      <header className="px-6 py-5 border-b border-brown-900/10 bg-cream/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-brown-900 shadow-sm">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
              </svg>
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-brown-900">
              ZYBA
            </span>
          </Link>

          <Link
            href="/guidebook"
            className="text-xs font-semibold text-brown-700 hover:text-brown-900 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
            Bantuan Krisis 24/7
          </Link>
        </div>
      </header>

      {/* Main Split Sanctuary Layout (ui-ux-pro-max: Organic Biophilic + Soft UI Evolution) */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Kiri: Hero & Living Sanctuary Orb (65% / 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-100/60 px-3 py-1 text-xs font-bold text-orange-950 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                The Tactile Sanctuary • 100% Gratis
              </div>
              <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brown-900 leading-[1.15]">
                Ruang Tenang untuk Pikiran yang Riuh.
              </h1>
              <p className="mt-4 text-sm md:text-base text-brown-700 leading-relaxed max-w-xl">
                Pendamping kesehatan mental berbasis AI dengan 4 persona empatik. Lakukan check-in harian, rasakan nafas sadar, dan pulihkan ritme hidupmu tanpa tekanan gamifikasi.
              </p>
            </div>

            {/* Mascot Interactive Onboarding Carousel (default / happy / listening) */}
            <div className="rounded-3xl border border-brown-900/10 bg-white/70 p-6 md:p-8 backdrop-blur-md shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 flex items-center justify-center">
                  <Mascot
                    pose={ONBOARDING_SLIDES[activeSlide].pose}
                    size={160}
                    animate={true}
                    decorative={true}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-950 bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    {ONBOARDING_SLIDES[activeSlide].badge}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-brown-900">
                    {ONBOARDING_SLIDES[activeSlide].title}
                  </h3>
                  <p className="text-xs md:text-sm text-brown-700 leading-relaxed">
                    {ONBOARDING_SLIDES[activeSlide].desc}
                  </p>
                </div>
              </div>

              {/* Carousel Indicators & Controls */}
              <div className="mt-6 pt-4 border-t border-brown-900/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {ONBOARDING_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeSlide === idx
                          ? "w-6 bg-orange-500"
                          : "w-2 bg-brown-900/20 hover:bg-brown-900/40"
                      }`}
                      aria-label={`Lihat slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSlide((prev) =>
                        prev === 0 ? ONBOARDING_SLIDES.length - 1 : prev - 1
                      )
                    }
                    className="p-1.5 rounded-lg border border-brown-900/15 text-brown-800 hover:bg-brown-900/5 transition-colors"
                    aria-label="Slide sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSlide((prev) =>
                        (prev + 1) % ONBOARDING_SLIDES.length
                      )
                    }
                    className="p-1.5 rounded-lg border border-brown-900/15 text-brown-800 hover:bg-brown-900/5 transition-colors"
                    aria-label="Slide berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Persona Aura Selector */}
            <div className="rounded-3xl border border-brown-900/10 bg-white/80 p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70 block mb-3">
                Pilih Pendamping Suaramu
              </span>

              {/* 4 Persona Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {PERSONA_PREVIEWS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPersona(idx)}
                    className={`flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all ${
                      selectedPersona === idx
                        ? "border-2 border-orange-500 bg-orange-100 text-brown-900 font-bold shadow-xs scale-102"
                        : "border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40"
                    }`}
                  >
                    <p.illustration className="h-8 w-8 shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-brown-700/70 truncate">{p.role}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Persona Quote Callout */}
              <div className="flex items-start gap-3 rounded-2xl border border-brown-900/10 bg-cream/60 p-3.5">
                <PersonaIcon className="h-10 w-10 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-brown-900">
                    {activePersona.name} ({activePersona.role})
                  </div>
                  <p className="mt-0.5 text-xs italic text-brown-700 leading-relaxed">
                    "{activePersona.quote}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Tactile Auth Sheet (35% / 5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-8 shadow-[0_8px_30px_rgba(44,34,30,0.06)] backdrop-blur-xl">
              {step === "form" ? (
                <>
                  {/* Mode Tabs */}
                  <div className="flex items-center rounded-2xl bg-brown-900/[0.04] p-1 border border-brown-900/5 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setErrorMsg("");
                      }}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                        mode === "register"
                          ? "bg-white text-brown-900 shadow-sm"
                          : "text-brown-700 hover:text-brown-900"
                      }`}
                    >
                      Daftar Akun Baru
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMsg("");
                      }}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                        mode === "login"
                          ? "bg-white text-brown-900 shadow-sm"
                          : "text-brown-700 hover:text-brown-900"
                      }`}
                    >
                      Sudah Ada Akun
                    </button>
                  </div>

                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-bold text-brown-900">
                      {mode === "register" ? "Mulai Ruang Amanmu" : "Selamat Datang Kembali"}
                    </h2>
                    <p className="mt-1 text-xs text-brown-700 leading-relaxed">
                      {mode === "register"
                        ? "Daftar dalam 30 detik. Kami mengirimkan kode OTP ke emailmu."
                        : "Masuk untuk melanjutkan refleksi dan percakapanmu."}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-5 rounded-xl border border-brown-900/20 bg-orange-50 p-3 text-xs text-brown-900">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-4">
                    {mode === "register" && (
                      <div>
                        <label className="block text-xs font-bold text-brown-900 mb-1.5">
                          Nama Lengkap / Panggilan
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 h-4 w-4 text-brown-700/50" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Syauqi"
                            className="h-11 w-full rounded-xl border border-brown-900/15 bg-white/90 pl-10 pr-4 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/50 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-brown-900 mb-1.5">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brown-700/50" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="kamu@email.com"
                          className="h-11 w-full rounded-xl border border-brown-900/15 bg-white/90 pl-10 pr-4 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/50 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brown-900 mb-1.5">
                        Kata Sandi
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brown-700/50" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="h-11 w-full rounded-xl border border-brown-900/15 bg-white/90 pl-10 pr-10 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/50 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-brown-700/60 hover:text-brown-900"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {mode === "register" && password && (
                        <div className="mt-2.5 flex items-center gap-3 text-[11px] text-brown-700">
                          <span className={`inline-flex items-center gap-1 ${hasMinLength ? "text-orange-950 font-semibold" : "text-brown-700/50"}`}>
                            <Check className="h-3 w-3 stroke-[2.5]" /> 8+ Karakter
                          </span>
                          <span className={`inline-flex items-center gap-1 ${hasNumber ? "text-orange-950 font-semibold" : "text-brown-700/50"}`}>
                            <Check className="h-3 w-3 stroke-[2.5]" /> Angka
                          </span>
                          <span className={`inline-flex items-center gap-1 ${hasLetter ? "text-orange-950 font-semibold" : "text-brown-700/50"}`}>
                            <Check className="h-3 w-3 stroke-[2.5]" /> Huruf
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-brown-900 shadow-sm hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 disabled:opacity-50"
                    >
                      {loading
                        ? "Memproses..."
                        : mode === "register"
                        ? "Kirim Kode Verifikasi"
                        : "Masuk ke ZYBA"}
                      <ArrowRight className="h-4 w-4 stroke-[2]" />
                    </button>
                  </form>
                </>
              ) : (
                /* Langkah OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
                      Verifikasi Akun
                    </span>
                    <h2 className="mt-1 font-serif text-2xl font-bold text-brown-900">
                      Periksa Kotak Masukmu
                    </h2>
                    <p className="mt-1 text-xs text-brown-700 leading-relaxed">
                      Kami telah mengirimkan 6 digit kode OTP ke <span className="font-bold text-brown-900">{registeredEmail}</span>.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl border border-brown-900/20 bg-orange-50 p-3 text-xs text-brown-900">
                      {errorMsg}
                    </div>
                  )}

                  {/* 6 Digit Input Boxes */}
                  <div className="flex items-center justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="h-12 w-11 rounded-xl border border-brown-900/20 bg-white text-center text-lg font-bold text-brown-900 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-brown-900 shadow-sm hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 disabled:opacity-50"
                  >
                    {loading ? "Memverifikasi..." : "Lanjutkan ke Asesmen Awal"}
                    <ArrowRight className="h-4 w-4 stroke-[2]" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-xs font-semibold text-brown-700 hover:text-brown-900 underline underline-offset-4"
                    >
                      ← Ubah alamat email
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
