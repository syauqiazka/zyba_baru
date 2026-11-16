"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Lock,
  Mail,
  User,
  ChevronUp,
} from "lucide-react";
import gsap from "gsap";

export default function OnboardingPage() {
  const router = useRouter();

  // Form states
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

  const mascotFloatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    if (mascotFloatingRef.current) {
      gsap.to(mascotFloatingRef.current.children, {
        y: -10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut",
      });
    }
  }, []);

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Nama lengkap atau panggilan wajib diisi.");
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");

      setRegisteredEmail(email);
      setStep("otp");
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
    <div className="min-h-screen bg-[#F5F8F5] flex flex-col justify-between selection:bg-orange-200 selection:text-brown-900">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* ========================================================
            SISI KIRI (5 Kolom): Panel Gelap Suaka (Tampil di Desktop/Laptop)
            ======================================================== */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#111A14] text-white p-8 sm:p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Ambient Cosmic Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3E7B54] text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-black tracking-tight text-white">
                ZYBA
              </span>
            </Link>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Masuk ke Ruang Suakamu
              </h1>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
                Lanjutkan perjalanan pemulihan batin secara sadar dalam suaka yang tenang, aman, dan tanpa penghakiman.
              </p>
            </div>

            {/* Checklist of Included Perks (Sesuai Foto 5 GitHub / Gambar User) */}
            <div className="pt-2 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>Keunggulan yang Langsung Terbuka</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </span>

              <div className="space-y-2.5 text-xs text-white/80">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 stroke-[2.5] text-emerald-400 shrink-0 mt-0.5" />
                  <span>Akses Zibi Companion AI 24/7 tanpa batas waktu</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 stroke-[2.5] text-emerald-400 shrink-0 mt-0.5" />
                  <span>Jurnal reflektif suaka terenkripsi penuh</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 stroke-[2.5] text-emerald-400 shrink-0 mt-0.5" />
                  <span>Breathing Garden 4-7-8 & latihan relaksasi terpadu</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 stroke-[2.5] text-emerald-400 shrink-0 mt-0.5" />
                  <span>100% Bebas Biaya Selamanya (Bebas Paywall)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 stroke-[2.5] text-emerald-400 shrink-0 mt-0.5" />
                  <span>Komunitas hangat dengan opsi unggahan anonim</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Mascot Figures Container (Foto 5 GitHub 3D Mascot Scene) */}
          <div
            ref={mascotFloatingRef}
            className="relative z-10 pt-8 flex items-end justify-center"
          >
            <div className="relative w-full max-w-[340px] flex flex-col items-center">
              {/* Soft Ambient Rim Light */}
              <div className="absolute -bottom-2 w-56 h-12 bg-emerald-500/25 blur-2xl rounded-full -z-10" />
              <Image
                src="/images/auth/zibi_3d_trio.png"
                alt="Zibi 3D Mascots"
                width={480}
                height={328}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            SISI KANAN (7 Kolom): Formulir Pendaftaran (Sesuai Foto 5 GitHub)
            ======================================================== */}
        <div className="lg:col-span-7 bg-[#F5F8F5] p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
          
          {/* Top Switcher (Mobile Brand + Already have account / Sign in) */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <Link href="/" className="lg:hidden inline-flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#3E7B54] text-white">
                <span className="font-display text-xs font-black">Z</span>
              </div>
              <span className="font-display font-bold text-brown-900">ZYBA</span>
            </Link>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-brown-700/70">Sudah punya akun?</span>
              <Link
                href="/login"
                className="font-bold text-[#3E7B54] hover:underline flex items-center gap-1"
              >
                <span>Masuk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-[420px] w-full mx-auto my-auto py-4 space-y-4">
            
            {step === "form" ? (
              <>
                <div className="space-y-1.5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 tracking-tight">
                    Daftar Akun Baru
                  </h2>
                  <p className="text-xs text-brown-700/70">
                    Mulai ruang tenang pribadimu dalam hitungan detik.
                  </p>
                </div>

                {/* Error Alert */}
                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2"
                  >
                    <span className="font-bold text-amber-800">Perhatian:</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={() => alert("Fitur Google OAuth akan segera aktif.")}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-cream border border-brown-900/10 text-brown-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  <span>Daftar dengan Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-brown-900/10" />
                  <span className="absolute bg-[#F5F8F5] px-3 text-[11px] font-semibold text-brown-700/50">
                    atau gunakan email
                  </span>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brown-900 mb-1.5">
                      Nama Lengkap / Panggilan
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Bagaimana Zibi memanggilmu?"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-brown-900/10 text-brown-900 placeholder:text-brown-700/40 text-xs sm:text-sm focus:outline-none focus:border-[#3E7B54] focus:ring-2 focus:ring-[#3E7B54]/15 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brown-900 mb-1.5">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-brown-900/10 text-brown-900 placeholder:text-brown-700/40 text-xs sm:text-sm focus:outline-none focus:border-[#3E7B54] focus:ring-2 focus:ring-[#3E7B54]/15 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brown-900 mb-1.5">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter..."
                        className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border border-brown-900/10 text-brown-900 placeholder:text-brown-700/40 text-xs sm:text-sm focus:outline-none focus:border-[#3E7B54] focus:ring-2 focus:ring-[#3E7B54]/15 transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-700/50 hover:text-brown-900 transition-colors p-1"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Checklist */}
                    {password && (
                      <div className="mt-2.5 p-3 rounded-xl bg-white border border-brown-900/5 space-y-1.5 text-[11px] text-brown-700/70">
                        <div className="flex items-center gap-1.5">
                          <Check
                            className={`w-3 h-3 ${
                              hasMinLength ? "text-[#3E7B54]" : "text-brown-700/30"
                            }`}
                          />
                          <span className={hasMinLength ? "text-brown-900 font-semibold" : ""}>
                            Minimal 8 karakter
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check
                            className={`w-3 h-3 ${
                              hasLetter ? "text-[#3E7B54]" : "text-brown-700/30"
                            }`}
                          />
                          <span className={hasLetter ? "text-brown-900 font-semibold" : ""}>
                            Mengandung huruf
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check
                            className={`w-3 h-3 ${
                              hasNumber ? "text-[#3E7B54]" : "text-brown-700/30"
                            }`}
                          />
                          <span className={hasNumber ? "text-brown-900 font-semibold" : ""}>
                            Mengandung angka
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !hasMinLength}
                    className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-brown-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    <span>{loading ? "Menyiapkan Ruang Batin..." : "Daftar Akun Gratis"}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </form>
              </>
            ) : (
              /* OTP VERIFICATION STEP */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E7B54] bg-emerald-100 px-3 py-1 rounded-full">
                    Verifikasi Keamanan
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 tracking-tight">
                    Masukkan Kode OTP
                  </h2>
                  <p className="text-xs text-brown-700/70 leading-relaxed">
                    Kami telah mengirimkan 6 digit kode keamanan ke <strong>{registeredEmail}</strong>.
                  </p>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2"
                  >
                    <span className="font-bold text-amber-800">Perhatian:</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-12 h-14 rounded-2xl bg-white border border-brown-900/15 text-center text-xl font-mono font-bold text-brown-900 focus:outline-none focus:border-[#3E7B54] focus:ring-2 focus:ring-[#3E7B54]/15 transition-all shadow-2xs"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#3E7B54] hover:bg-[#346B48] active:scale-98 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? "Memverifikasi..." : "Lanjutkan ke Penilaian Awal"}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-xs font-bold text-brown-700/70 hover:text-brown-900 underline"
                    >
                      Salah alamat email? Ubah di sini
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer Disclaimer & Crisis Support Link */}
          <div className="pt-6 border-t border-brown-900/8 text-center space-y-2 text-[11px] text-brown-700/60">
            <p>
              Dengan mendaftar, kamu menyetujui Ketentuan Layanan & Kebijakan Privasi Suaka ZYBA.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-brown-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3E7B54]" />
              <span>Butuh bantuan darurat? Akses </span>
              <Link href="/guidebook" className="underline hover:text-[#3E7B54]">
                Hotline Bantuan Krisis 24/7
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
