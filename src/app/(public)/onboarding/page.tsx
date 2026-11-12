"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Bot,
  Compass,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

const carouselSlides = [
  {
    badge: "RUANG TENANG",
    title: "Ruang aman yang lapang, hangat, dan tenang.",
    description:
      "Serahkan beban harimu di lembaran jurnal digital tanpa distraksi. ZYBA dirancang untuk membantu menata emosi dan menenangkan pikiranmu.",
    icon: Sparkles,
    bgIcon: "bg-orange-100",
  },
  {
    badge: "AI COMPANION",
    title: "Sahabat empatik yang siap mendengarkan 24/7.",
    description:
      "Pilih persona teman batinmu: Kina yang lembut, Ollie yang bijaksana, Rubi yang ceria, atau Bruno yang mengayomi. Tanpa penghakiman.",
    icon: Bot,
    bgIcon: "bg-green-100",
  },
  {
    badge: "RITME SEHAT",
    title: "Latihan napas & rencana harian tanpa tekanan.",
    description:
      "Pulihkan fokus dengan Breathing Garden 4-7-8 dan aktivitas mikro yang realistis untuk ritme kehidupan Gen Z.",
    icon: Compass,
    bgIcon: "bg-cream",
  },
  {
    badge: "KOMUNITAS SUPORTIF",
    title: "Saling terhubung dalam lingkaran aman.",
    description:
      "Berbagi pengalaman atau membaca cerita teman sefrekuensi secara anonim maupun terbuka, terbebas dari tuntutan popularitas.",
    icon: Users,
    bgIcon: "bg-orange-100",
  },
  {
    badge: "100% BEBAS BIAYA",
    title: "Sepenuhnya gratis dan privasi terjaga mutlak.",
    description:
      "Seluruh fitur, audio relaksasi, dan wawasan terbuka penuh tanpa paywall atau langganan berbayar.",
    icon: ShieldCheck,
    bgIcon: "bg-green-100",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "bg-brown-900/10" };
    if (pass.length < 8) return { score: 1, text: "Terlalu pendek", color: "bg-danger" };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*]/.test(pass);
    if (hasNum && hasSpecial) return { score: 3, text: "Kuat", color: "bg-green-500" };
    return { score: 2, text: "Sedang", color: "bg-orange-500" };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal melakukan pendaftaran.");
        setLoading(false);
        return;
      }

      setShowOtpModal(true);
      setLoading(false);
      setCooldown(60);
    } catch {
      setError("Terjadi kendala jaringan saat mendaftar.");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Kode verifikasi tidak sesuai.");
        setOtpLoading(false);
        return;
      }

      // Berhasil diverifikasi -> lanjut ke gerbang /assessment 8-step
      router.push("/assessment");
    } catch {
      setOtpError("Terjadi kendala saat verifikasi kode.");
      setOtpLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const SlideIcon = carouselSlides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-cream text-brown-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brown-900 text-cream flex items-center justify-center font-display font-extrabold text-base">
            Z
          </div>
          <span className="font-display font-bold text-lg text-brown-900">ZYBA</span>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="sm">
            Sudah Punya Akun? Masuk
          </Button>
        </Link>
      </header>

      {/* Main Grid: Left Carousel, Right Signup */}
      <main className="max-w-5xl mx-auto w-full my-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 5-Slide Carousel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card variant="anchor" elevation={1} className="relative overflow-hidden bg-white/90 min-h-[360px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="warm" pill>
                    {carouselSlides[currentSlide].badge}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {carouselSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Pindah ke slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentSlide === idx ? "w-6 bg-orange-500" : "w-2 bg-brown-900/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className={`w-12 h-12 rounded-2xl ${carouselSlides[currentSlide].bgIcon} flex items-center justify-center mb-4`}>
                    <SlideIcon className="w-6 h-6 text-brown-900" strokeWidth={1.8} />
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight leading-snug">
                    {carouselSlides[currentSlide].title}
                  </h1>
                  <p className="font-body text-sm sm:text-base text-brown-700 leading-relaxed mt-3">
                    {carouselSlides[currentSlide].description}
                  </p>
                </div>
              </div>

              {/* Carousel Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-brown-900/10">
                <button
                  onClick={prevSlide}
                  aria-label="Slide sebelumnya"
                  className="w-10 h-10 rounded-full border border-brown-900/15 flex items-center justify-center text-brown-700 hover:bg-cream transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
                </button>
                <span className="text-xs font-semibold text-brown-700">
                  {currentSlide + 1} dari {carouselSlides.length}
                </span>
                <button
                  onClick={nextSlide}
                  aria-label="Slide berikutnya"
                  className="w-10 h-10 rounded-full border border-brown-900/15 flex items-center justify-center text-brown-700 hover:bg-cream transition-colors"
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column: Register Form (5 cols) */}
          <div className="lg:col-span-5">
            <Card variant="content" elevation={2} className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-display text-xl font-bold text-brown-900">
                  Mulai Perjalananmu
                </h2>
                <p className="font-body text-xs text-brown-700">
                  Daftar akun gratis untuk menyimpan asesmen dan jurnalmu.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-xs font-medium text-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5">
                <Input
                  id="reg-name"
                  type="text"
                  label="Nama Panggilan"
                  placeholder="Contoh: Rian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  id="reg-email"
                  type="email"
                  label="Alamat Email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <Input
                    id="reg-pass"
                    type="password"
                    label="Kata Sandi"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="h-1.5 flex-1 rounded-full bg-brown-900/10 overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: `${(strength.score / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-brown-700">
                        {strength.text}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="warm"
                  size="lg"
                  fullWidth
                  disabled={loading}
                >
                  <span>{loading ? "Menyiapkan Akun..." : "Daftar & Terima Kode"}</span>
                  <ArrowRight className="w-4 h-4 text-brown-900" strokeWidth={1.8} />
                </Button>
              </form>

              <div className="text-center pt-2">
                <Link
                  href="/guidebook"
                  className="inline-flex items-center gap-1.5 text-xs text-brown-700 hover:text-brown-900 underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Butuh bantuan darurat sekarang? Buka Panduan Krisis
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-brown-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <Card variant="content" elevation={3} className="max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto flex items-center justify-center text-brown-900">
                <CheckCircle2 className="w-6 h-6 text-brown-900" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-xl font-bold text-brown-900">
                Verifikasi Email Kamu
              </h3>
              <p className="font-body text-xs sm:text-sm text-brown-700 leading-relaxed">
                Kami telah mengirimkan 6 digit kode verifikasi ke alamat <strong>{email}</strong>.
              </p>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-xs font-medium text-danger text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp-input"
                  className="block text-center text-xs font-bold uppercase tracking-widest text-brown-700/80 mb-2"
                >
                  Masukkan 6 Digit Kode
                </label>
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  autoFocus
                  required
                  className="w-full text-center tracking-[12px] text-2xl font-display font-extrabold h-14 rounded-xl bg-cream border border-brown-900/20 text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>

              <Button
                type="submit"
                variant="warm"
                size="lg"
                fullWidth
                disabled={otpLoading || otpCode.length < 6}
              >
                <span>{otpLoading ? "Memverifikasi..." : "Verifikasi & Mulai Asesmen"}</span>
                <ArrowRight className="w-4 h-4 text-brown-900" strokeWidth={1.8} />
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-brown-900/10">
              <p className="text-xs text-brown-700">
                Tidak menerima email?{" "}
                <button
                  disabled={cooldown > 0}
                  onClick={() => {
                    handleRegister(new Event("submit") as any);
                  }}
                  className="font-bold text-brown-900 underline disabled:opacity-50 disabled:cursor-not-allowed hover:text-orange-500"
                >
                  {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang kode"}
                </button>
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-brown-700/60 pt-4">
        ZYBA — The Tactile Sanctuary. 100% Bebas Biaya & Tanpa Tekanan.
      </footer>
    </div>
  );
}

