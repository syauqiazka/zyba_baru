"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { BreathingOrb } from "@/components/wellness/BreathingOrb";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      if (!res.ok) throw new Error(data.error || "Email atau kata sandi tidak cocok.");

      router.push(data.redirectUrl || redirectUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk.");
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
            Bantuan Krisis
          </Link>
        </div>
      </header>

      {/* Main Split Portal */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Kolom Kiri: Zen Mindful Anchor (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70 block mb-2">
                Pintu Masuk Sanctuary
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 leading-tight">
                Selamat Datang Kembali di Ruang Tenangmu
              </h1>
              <p className="mt-3 text-xs md:text-sm text-brown-700 leading-relaxed">
                Setiap kali kamu kembali, kamu mengambil satu langkah sadar untuk merawat diri sendiri.
              </p>
            </div>

            <div className="rounded-3xl border border-brown-900/10 bg-white/70 p-6 backdrop-blur-md shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700/60 block mb-3 text-center">
                Irama Nafas Sejenak
              </span>
              <BreathingOrb size="sm" showText={false} />
            </div>

            <div className="rounded-2xl border border-brown-900/10 bg-cream/80 p-4 text-xs text-brown-700 leading-relaxed">
              <span className="font-bold text-brown-900">Privasi Tanpa Kompromi:</span> Seluruh data emosi, asesmen, dan percakapanmu dienkripsi dan terlindungi penuh.
            </div>
          </div>

          {/* Kolom Kanan: Tactile Login Form (7 cols) */}
          <div className="md:col-span-7">
            <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-10 shadow-[0_8px_30px_rgba(44,34,30,0.06)] backdrop-blur-xl">
              <h2 className="font-serif text-2xl font-bold text-brown-900">
                Masuk ke Akun ZYBA
              </h2>
              <p className="mt-1 text-xs text-brown-700 mb-6">
                Masukkan email dan kata sandi yang telah kamu daftarkan.
              </p>

              {errorMsg && (
                <div className="mb-5 rounded-xl border border-brown-900/20 bg-orange-50 p-3 text-xs text-brown-900">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
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
                      placeholder="Kata sandi akunmu"
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-brown-900 shadow-sm hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 disabled:opacity-50"
                >
                  {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
                  <ArrowRight className="h-4 w-4 stroke-[2]" />
                </button>
              </form>

              <div className="mt-8 border-t border-brown-900/10 pt-6 text-center text-xs text-brown-700">
                Belum memiliki akun ZYBA?{" "}
                <Link
                  href="/onboarding"
                  className="font-bold text-brown-900 hover:text-orange-600 underline underline-offset-4"
                >
                  Daftar di sini gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <LoginForm />
    </Suspense>
  );
}
