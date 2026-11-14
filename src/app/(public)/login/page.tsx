"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { MascotHero, Mascot } from "@/components/ui/Mascot";
import { MASCOT_NAME } from "@/lib/brand";

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
        throw new Error(data.error || "Email atau kata sandi tidak cocok.");
      }

      router.push(data.redirectUrl || redirectUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk ke suaka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2E7] text-brown-900 flex flex-col justify-between selection:bg-orange-200 selection:text-brown-900">
      {/* Top Sanctuary Bar */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3E7B54] text-white shadow-2xs group-hover:scale-105 transition-transform">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-brown-900">
              ZYBA
            </span>
            <span className="hidden sm:inline ml-2 text-[10px] font-semibold uppercase tracking-widest text-brown-700/60 border-l border-brown-900/15 pl-2">
              Suaka Masuk
            </span>
          </div>
        </Link>

        <Link
          href="/guidebook"
          className="text-xs font-semibold text-brown-700 hover:text-brown-900 transition-colors flex items-center gap-1.5 bg-white/80 border border-brown-900/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[#3E7B54]" />
          <span>Bantuan Krisis 24/7</span>
        </Link>
      </header>

      {/* Main Split Layout: Form di Kiri & Suaka Maskot Zibi di Kanan */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[1020px] bg-white border border-brown-900/10 rounded-[28px] sm:rounded-[32px] shadow-[0_12px_40px_-8px_rgba(59,42,32,0.07)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* SISI KIRI (7 Kolom): Formulir Masuk */}
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between order-2 lg:order-1">
            <div>
              <div className="mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3E7B54] bg-emerald-50 border border-[#3E7B54]/20 px-3 py-1 rounded-full inline-block">
                  Ruang Aman Kamu
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brown-900 tracking-tight mt-3">
                Selamat Datang Kembali
              </h1>
              <p className="text-brown-700 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Lanjutkan perjalanan batinmu dengan tenang. Setiap langkah kecilmu sangat berarti.
              </p>

              {/* Error Message */}
              {errorMsg && (
                <div
                  role="alert"
                  className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs flex items-center gap-2"
                >
                  <span className="font-bold text-amber-800">Perhatian:</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F2E7]/40 border border-brown-900/15 text-brown-900 placeholder:text-brown-700/40 text-sm focus:outline-hidden focus:border-[#3E7B54] focus:ring-2 focus:ring-[#3E7B54]/15 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-brown-900">
                      Kata Sandi
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#3E7B54] hover:underline"
                    >
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F7F2E7]/40 border border-brown-900/15 text-brown-900 placeholder:text-brown-700/40 text-sm focus:outline-hidden focus:border-[#3E7B54] focus:ring-2 focus:ring-[#3E7B54]/15 transition-all"
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
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md border-brown-900/20 text-[#3E7B54] focus:ring-0 accent-[#3E7B54] cursor-pointer"
                    />
                    <span className="text-brown-700 font-medium">Ingat saya di perangkat ini</span>
                  </label>
                </div>

                {/* Primary Button: Warm Coral / Orange with dark brown text (contrast-safe) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-brown-900 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? "Membuka Ruang Suaka..." : "Masuk ke Suaka ZYBA"}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-brown-900/10" />
                <span className="absolute bg-white px-3 text-[11px] font-medium text-brown-700/50">
                  atau
                </span>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={() => alert("Fitur Google OAuth akan segera aktif.")}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-cream/50 border border-brown-900/15 text-brown-900 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-3 shadow-2xs"
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
                <span>Lanjutkan dengan Google</span>
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center text-xs text-brown-700 mt-8 pt-4 border-t border-brown-900/10">
              <span>Belum punya ruang batin di ZYBA? </span>
              <Link
                href="/onboarding"
                className="text-[#3E7B54] font-bold hover:underline"
              >
                Mulai Akun Baru (100% Gratis)
              </Link>
            </div>
          </div>

          {/* SISI KANAN (5 Kolom): Suaka Maskot Resmi Zibi (Bebas Kotak, Tanpa Border, Natural) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#EAF4EC] via-[#F4F8F4] to-[#F7F2E7] border-b lg:border-b-0 lg:border-l border-brown-900/10 p-8 sm:p-10 flex flex-col justify-between items-center text-center order-1 lg:order-2 relative overflow-hidden">
            
            {/* Soft Ambient Botanical Decor (SVG Organic Shapes, Non-Box) */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -ml-10 -mb-10" />

            {/* Top Badge */}
            <div className="relative z-10">
              <span className="text-[11px] font-semibold text-brown-700/80 bg-white/70 backdrop-blur-xs px-3.5 py-1 rounded-full border border-brown-900/10 inline-flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#3E7B54]" />
                Suaka Mindful Gen Z
              </span>
            </div>

            {/* MASKOT RESMI ZIBI: Tampil Alami, Bebas Kotak, Bernafas Lembut */}
            <div className="relative z-10 my-6 sm:my-8 flex flex-col items-center">
              <MascotHero
                size={270}
                priority={true}
                decorative={false}
                className="relative z-10 drop-shadow-[0_8px_20px_rgba(62,123,84,0.12)]"
              />
              
              {/* Pesan Hangat Menyapa */}
              <div className="mt-4 max-w-xs bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-brown-900/10 shadow-xs">
                <p className="text-xs font-serif font-bold text-brown-900">
                  {MASCOT_NAME} siap menemanimu
                </p>
                <p className="text-[11px] text-brown-700/80 mt-0.5 leading-snug">
                  &quot;Tarik nafas perlahan... Cerita dan refleksi batinmu selalu aman di sini.&quot;
                </p>
              </div>
            </div>

            {/* Bottom Sanctuary Reassurance */}
            <div className="relative z-10 text-[11px] text-brown-700/70">
              <span>Privasi terjaga &bull; 100% Bebas biaya &bull; Tanpa streak menekan</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer subtle copy */}
      <footer className="py-4 text-center text-[11px] text-brown-700/60 max-w-7xl mx-auto w-full px-6">
        &copy; {new Date().getFullYear()} ZYBA — The Tactile Sanctuary. Ruang aman kesehatan mental, fisik, dan sosial.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F2E7] flex items-center justify-center text-brown-700 text-sm">
          Menyiapkan suaka ZYBA...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
