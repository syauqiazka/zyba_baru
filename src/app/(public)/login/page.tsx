"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatedMascot, MascotState } from "@/components/mascot/AnimatedMascot";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMascotState("error");
        throw new Error(data.error || "Email atau kata sandi tidak cocok.");
      }

      setMascotState("success");
      setTimeout(() => {
        router.push(data.redirectUrl || redirectUrl);
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F5] text-brown-900 selection:bg-emerald-200 flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-brown-900/8 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#3E7B54] text-white shadow-xs">
              <span className="font-serif text-lg font-black">Z</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-brown-900">
                ZYBA
              </span>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
                Sanctuary
              </span>
            </div>
          </Link>

          <Link
            href="/guidebook"
            className="text-xs font-semibold text-brown-700 hover:text-brown-900 transition-colors flex items-center gap-1.5 bg-white/80 border border-brown-900/8 px-3 py-1.5 rounded-xl shadow-2xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-peach-600 stroke-[2]" />
            <span>Bantuan Krisis 24/7</span>
          </Link>
        </div>
      </header>

      {/* Main Split Login Card (Inspired by User Reference & Character Sheet) */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-brown-900/8 bg-white shadow-[0_12px_40px_rgba(27,36,30,0.06)] grid grid-cols-1 md:grid-cols-12">
          {/* LEFT HALF: Form Input (md:col-span-6) */}
          <div className="p-7 sm:p-10 md:col-span-6 flex flex-col justify-between order-2 md:order-1">
            <div>
              {/* Brand mark */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>Pintu Masuk Ruang Tenang</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brown-900">
                Selamat Datang Kembali!
              </h1>
              <p className="mt-1.5 text-xs text-brown-700 leading-relaxed">
                Lanjutkan perjalanan pemulihan batinmu di suaka yang aman dan privat.
              </p>

              {errorMsg && (
                <div className="mt-4 rounded-xl border border-peach-200 bg-peach-50 p-3 text-xs text-brown-900">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setMascotState("email")}
                      onBlur={() => setMascotState("idle")}
                      placeholder="nama@email.com"
                      className="w-full rounded-2xl border border-brown-900/15 bg-[#F5F8F5] px-4 py-3 pl-10 text-xs text-brown-900 placeholder:text-brown-700/40 focus:border-[#3E7B54] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E7B54]/20 transition-all"
                    />
                    <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-brown-700/50" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-brown-900">
                      Kata Sandi
                    </label>
                    <span className="text-[11px] text-brown-700/70 hover:text-brown-900 cursor-pointer">
                      Lupa kata sandi?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setMascotState("password")}
                      onBlur={() => setMascotState("idle")}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-brown-900/15 bg-[#F5F8F5] px-4 py-3 pl-10 pr-10 text-xs text-brown-900 placeholder:text-brown-700/40 focus:border-[#3E7B54] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E7B54]/20 transition-all"
                    />
                    <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-brown-700/50" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-brown-700/50 hover:text-brown-900 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded-md border-brown-900/20 text-[#3E7B54] focus:ring-[#3E7B54]"
                    />
                    <span className="text-xs text-brown-700">Ingat saya</span>
                  </label>
                </div>

                {/* Submit Button (Habitdo Botanical Green) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#3E7B54] text-white text-xs font-bold shadow-xs hover:bg-[#346B48] active:scale-[0.99] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3E7B54]/50 disabled:opacity-50"
                >
                  {loading ? (
                    "Membuka Suaka..."
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brown-900/8" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-brown-700/60 uppercase tracking-wider">
                  atau
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full flex h-11 items-center justify-center gap-2 rounded-2xl border border-brown-900/10 bg-white text-xs font-semibold text-brown-900 shadow-2xs hover:bg-[#F5F8F5] transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>
            </div>

            {/* Footer Registration Link */}
            <div className="mt-6 text-center text-xs text-brown-700">
              Belum memiliki akun ZYBA?{" "}
              <Link
                href="/onboarding"
                className="font-bold text-[#3E7B54] hover:underline"
              >
                Daftar di sini gratis
              </Link>
            </div>
          </div>

          {/* RIGHT HALF: Scenic Botanical Illustration with 2D Animated Mascot (md:col-span-6) */}
          <div className="relative min-h-[300px] md:min-h-[540px] md:col-span-6 overflow-hidden bg-gradient-to-b from-[#DCEEF8] via-[#EDF5FA] to-[#E3F2E6] flex flex-col justify-between p-6 sm:p-8 order-1 md:order-2 border-b md:border-b-0 md:border-l border-brown-900/8">
            {/* CSS Keyframes for Clouds & Sun Glow */}
            <style jsx>{`
              @keyframes cloudFloatLeft {
                0% {
                  transform: translateX(0px);
                }
                50% {
                  transform: translateX(12px);
                }
                100% {
                  transform: translateX(0px);
                }
              }
              @keyframes cloudFloatRight {
                0% {
                  transform: translateX(0px);
                }
                50% {
                  transform: translateX(-14px);
                }
                100% {
                  transform: translateX(0px);
                }
              }
              .animate-cloud-1 {
                animation: cloudFloatLeft 8s ease-in-out infinite;
              }
              .animate-cloud-2 {
                animation: cloudFloatRight 10s ease-in-out infinite;
              }
            `}</style>

            {/* Top Scenic Elements: Clouds & Golden Sun */}
            <div className="relative z-10">
              {/* Golden Sun Orb */}
              <div className="absolute right-8 top-4 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-[#FFE59E] to-[#FCD34D] opacity-90 shadow-[0_0_32px_rgba(252,211,77,0.4)]" />

              {/* Floating Cloud 1 */}
              <svg
                className="absolute left-4 top-2 h-14 w-28 text-white/90 animate-cloud-1 drop-shadow-xs"
                viewBox="0 0 100 50"
                fill="currentColor"
              >
                <path d="M20 35 C10 35 5 28 10 20 C14 12 26 12 32 16 C38 6 54 6 62 14 C70 10 82 14 84 22 C92 24 94 34 84 36 Z" />
              </svg>

              {/* Floating Cloud 2 */}
              <svg
                className="absolute right-24 top-12 h-10 w-24 text-white/80 animate-cloud-2 drop-shadow-xs hidden sm:block"
                viewBox="0 0 100 50"
                fill="currentColor"
              >
                <path d="M20 35 C10 35 5 28 10 20 C14 12 26 12 32 16 C38 6 54 6 62 14 C70 10 82 14 84 22 C92 24 94 34 84 36 Z" />
              </svg>
            </div>

            {/* Middle & Foreground Landscape Layer: Rolling Hills, Stylized Trees & Path */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 400 540"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Far Distant Blue Mountains */}
              <path
                d="M-20 280 Q70 190 160 270 T360 260 Q410 240 430 270 L430 540 L-20 540 Z"
                fill="#8CBBD6"
                opacity="0.45"
              />
              <path
                d="M30 300 Q150 210 250 290 T430 280 L430 540 L30 540 Z"
                fill="#72A7C7"
                opacity="0.4"
              />

              {/* Rolling Hills (Midground in Botanical Greens) */}
              <path
                d="M-20 330 Q80 260 200 320 T420 310 L420 540 L-20 540 Z"
                fill="#83C293"
              />
              <path
                d="M-20 380 Q120 320 260 380 T430 360 L430 540 L-20 540 Z"
                fill="#65AA77"
              />

              {/* Winding Yellow/Sand Walking Path (From Ref Photo 1) */}
              <path
                d="M210 350 Q230 400 200 440 Q160 480 180 540 L280 540 Q290 480 340 440 Q370 410 310 350 Z"
                fill="#FAF2DE"
              />

              {/* Stylized Rounded Trees (Left side) */}
              {/* Tree 1 Trunk & Foliage */}
              <rect x="76" y="320" width="8" height="40" rx="4" fill="#6A5343" />
              <circle cx="80" cy="305" r="22" fill="#E8B949" />
              <circle cx="62" cy="325" r="16" fill="#71B583" />
              <circle cx="95" cy="328" r="14" fill="#88C798" />
            </svg>

            {/* THE 2D ANIMATED LIVING MASCOT (Sits on the path, moves & reacts) */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-end pb-4 sm:pb-6">
              {/* Speech bubble hint depending on state */}
              <div className="mb-2 transition-all duration-300">
                {mascotState === "password" ? (
                  <div className="rounded-2xl bg-white/95 px-3.5 py-1.5 shadow-sm border border-brown-900/8 text-[11px] font-bold text-[#28583B] animate-bounce">
                    🤫 Aku tutup mata dulu ya!
                  </div>
                ) : mascotState === "email" ? (
                  <div className="rounded-2xl bg-white/95 px-3.5 py-1.5 shadow-sm border border-brown-900/8 text-[11px] font-bold text-[#28583B]">
                    👀 Halo! Mau masuk sekarang?
                  </div>
                ) : mascotState === "success" ? (
                  <div className="rounded-2xl bg-white/95 px-3.5 py-1.5 shadow-sm border border-brown-900/8 text-[11px] font-bold text-emerald-800">
                    🎉 Yay! Selamat datang kembali!
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/90 px-3.5 py-1.5 shadow-2xs border border-brown-900/8 text-[11px] font-semibold text-brown-700">
                    🌿 Ruang amanmu menantimu
                  </div>
                )}
              </div>

              {/* Mascot 2D Vector Component */}
              <div className="cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => setMascotState(mascotState === "idle" ? "success" : "idle")}>
                <AnimatedMascot state={mascotState} size="lg" />
              </div>

              {/* Bottom Sanctuary Tag */}
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-xs px-3 py-1 border border-brown-900/8 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#3E7B54] animate-pulse" />
                <span className="text-[10px] font-bold text-brown-900 tracking-wide uppercase">
                  Zybi — Penjaga Suaka Batin
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-brown-900/8 text-center text-xs text-brown-700/70">
        ZYBA Sanctuary • Gen Z Wellness Support • Bebas Biaya 100%
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F8F5] flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#3E7B54] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
