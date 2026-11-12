"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

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
      setErrorMsg(err.message || "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1012] text-white flex flex-col justify-between selection:bg-[#9BC53D] selection:text-black">
      {/* Top subtle bar */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[#9BC53D]">
            ZYBA
          </span>
        </Link>

        <Link
          href="/guidebook"
          className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 bg-[#171A1E] border border-zinc-800/80 px-3 py-1.5 rounded-xl shadow-xs"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[#9BC53D]" />
          <span>Bantuan Krisis 24/7</span>
        </Link>
      </header>

      {/* Main Split Login Card - Identical to Reference Video */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[1040px] bg-[#16191D] border border-zinc-800/90 rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* SISI KIRI: Formulir Login */}
          <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between order-2 md:order-1">
            <div>
              {/* Brand Logo */}
              <div className="mb-6">
                <span className="text-2xl font-bold tracking-tight text-[#9BC53D]">
                  ZYBA
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Welcome back!
              </h1>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Pick up where you left off, and keep things moving.
              </p>

              {/* Error Message */}
              {errorMsg && (
                <div
                  role="alert"
                  className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs"
                >
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@gmail.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#202529] border border-zinc-700/60 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-[#9BC53D] focus:ring-1 focus:ring-[#9BC53D] transition-colors text-sm"
                  />
                </div>

                {/* Password Input with Show/Hide toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 pr-14 rounded-xl bg-[#202529] border border-zinc-700/60 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-[#9BC53D] focus:ring-1 focus:ring-[#9BC53D] transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md bg-[#202529] border-zinc-700 text-[#9BC53D] focus:ring-0 accent-[#9BC53D] cursor-pointer"
                    />
                    <span className="text-zinc-400">Remember me</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[#9BC53D] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#9BC53D] hover:bg-[#8BB236] text-[#121619] font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#9BC53D]/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? "Logging in..." : "Log in"}</span>
                  <span className="text-base">→</span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="w-full border-t border-zinc-800" />
                <span className="absolute bg-[#16191D] px-3 text-[11px] text-zinc-500 lowercase tracking-wider">
                  or
                </span>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={() => alert("Fitur Google OAuth akan segera aktif.")}
                className="w-full py-3.5 px-4 rounded-xl bg-[#202529] hover:bg-[#282F35] border border-zinc-700/60 text-white font-medium text-sm transition-colors flex items-center justify-center gap-3"
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
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Footer Signup Link */}
            <div className="text-center text-xs text-zinc-400 mt-8">
              <span>Don't have an Account? </span>
              <Link
                href="/onboarding"
                className="text-[#9BC53D] font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* SISI KANAN: Maskot Asli Beranimasi Sesuai Video (Tidak Diubah Sekecil Pun) */}
          <div className="relative w-full h-72 sm:h-96 md:h-full min-h-[360px] md:min-h-[580px] bg-[#1E2328] order-1 md:order-2 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/images/mascot/login-landscape.png"
              className="w-full h-full object-cover select-none pointer-events-none"
            >
              <source src="/videos/login-mascot.webm" type="video/webm" />
              <source src="/videos/login-mascot.mp4" type="video/mp4" />
              {/* Fallback image */}
              <img
                src="/images/mascot/login-landscape.png"
                alt="Zyba Axolotl Sanctuary Mascot"
                className="w-full h-full object-cover"
              />
            </video>
          </div>
        </div>
      </main>

      {/* Footer subtle copy */}
      <footer className="py-4 text-center text-[11px] text-zinc-600">
        ZYBA — Gen Z Wellness Sanctuary. Seluruh layanan gratis & terlindungi.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E1012] flex items-center justify-center text-zinc-400 text-sm">
          Memuat suaka ZYBA...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
