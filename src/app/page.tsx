import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Smile,
  Compass,
  MessageCircle,
  Wind,
  Heart,
  Users,
} from "lucide-react";
import { MascotHero, Mascot } from "@/components/ui/Mascot";
import { MASCOT_NAME } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream text-brown-900 selection:bg-orange-200">
      {/* Floating Sanctuary Top Nav */}
      <header className="px-6 py-5 border-b border-brown-900/10 bg-cream/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-brown-900 shadow-sm">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-brown-900">
                ZYBA
              </span>
              <span className="hidden sm:inline ml-2 text-[10px] font-semibold uppercase tracking-widest text-brown-700/60 border-l border-brown-900/15 pl-2">
                Sanctuary
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/guidebook"
              className="text-xs font-semibold text-brown-700 hover:text-brown-900 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              Bantuan Krisis
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-orange-500 px-4 text-xs font-bold text-brown-900 shadow-xs hover:bg-orange-600 transition-all focus:outline-none"
            >
              <span>Mulai Ruang Aman</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (65:35 Composition) */}
      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-20">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri 65%: Copy & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-100/60 px-3.5 py-1 text-xs font-bold text-orange-950">
              <Sparkles className="h-3.5 w-3.5 text-orange-600" />
              Gen Z Wellness Support • 100% Bebas Biaya
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brown-900 leading-[1.12]">
              Ruang Aman untuk Menyembuhkan Pikiran yang Riuh.
            </h1>

            <p className="text-base sm:text-lg text-brown-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Dirancang untuk menghadirkan ketenangan linen yang hangat, tanpa tekanan streak membara, dan tanpa biaya langganan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/onboarding"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 text-sm font-bold text-brown-900 shadow-sm hover:bg-orange-600 transition-all focus:outline-none"
              >
                <span>Mulai Perjalananmu</span>
                <ArrowRight className="h-4 w-4 stroke-[2]" />
              </Link>
              <Link
                href="/guidebook"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-brown-900/15 bg-white/90 px-6 text-sm font-semibold text-brown-900 hover:bg-brown-900/5 transition-all"
              >
                <HeartHandshake className="h-4 w-4 text-brown-700" />
                <span>Panduan & Hotline Krisis</span>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan 35%: Maskot Resmi Hero (Bebas tanpa kotak pembatas) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <MascotHero
              size={348}
              priority={true}
              decorative={false}
              className="relative z-10"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-medium text-brown-700">
                Temui <strong className="font-bold text-brown-900">{MASCOT_NAME}</strong>, sahabat mindful ZYBA kamu
              </span>
            </div>
          </div>
        </section>

        {/* AI Companion Spotlight: Zibi */}
        <section className="rounded-3xl border border-brown-900/10 bg-white/80 p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70 block mb-1">
                AI Companion Empatik
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-900">
                Temui {MASCOT_NAME}, Sahabat yang Selalu Mendengar
              </h2>
              <p className="mt-3 text-sm text-brown-700 leading-relaxed">
                Tidak ada lagi rasa kesepian atau takut dihakimi. {MASCOT_NAME} hadir sebagai pendamping batin yang hangat, sabar, dan siap diajak curhat kapan pun kamu butuh ruang tenang 24/7.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brown-900 px-6 py-3 text-xs font-bold text-cream hover:bg-brown-900/90 transition-all shadow-xs"
                >
                  <span>Mulai Curhat Bersama {MASCOT_NAME}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative p-6 rounded-3xl bg-cream/70 border border-brown-900/10 w-full max-w-sm text-center">
                <Mascot pose="listening" size={170} animate={true} decorative={true} className="mx-auto mb-3" />
                <p className="font-serif text-base font-bold text-brown-900">{MASCOT_NAME} &bull; Axolotl Suaka</p>
                <p className="text-xs text-brown-700 mt-1">&quot;Di sini aman. Ceritakan apa pun yang sedang kamu rasakan...&quot;</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Pilar Inti ZYBA */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-brown-900/10 bg-white/90 p-6 md:p-8 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-950 mb-4">
              <Smile className="h-5 w-5 text-orange-600 stroke-[2]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brown-900">
              Check-In 15 Pertanyaan
            </h3>
            <p className="mt-2 text-xs md:text-sm text-brown-700 leading-relaxed">
              Mengevaluasi kondisi mental, fisik, dan sosialmu dalam format 5 langkah santai tanpa kelelahan kognitif.
            </p>
          </div>

          <div className="rounded-3xl border border-brown-900/10 bg-white/90 p-6 md:p-8 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-950 mb-4">
              <Sparkles className="h-5 w-5 text-orange-600 stroke-[2]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brown-900">
              Hearth Flame Sanctuary
            </h3>
            <p className="mt-2 text-xs md:text-sm text-brown-700 leading-relaxed">
              Konsistensi yang hangat seperti lilin tenang. Jika terlewat, lilin hanya meredup lembut tanpa rasa bersalah.
            </p>
          </div>

          <div className="rounded-3xl border border-brown-900/10 bg-white/90 p-6 md:p-8 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-950 mb-4">
              <Wind className="h-5 w-5 text-orange-600 stroke-[2]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brown-900">
              Breathing Garden 4-7-8
            </h3>
            <p className="mt-2 text-xs md:text-sm text-brown-700 leading-relaxed">
              Latihan relaksasi nafas ilmiah untuk menenangkan sistem saraf otonom saat cemas atau sulit tidur.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brown-900/10 py-8 px-6 text-center text-xs text-brown-700/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} ZYBA Wellness Support. The Tactile Sanctuary.</span>
          <div className="flex items-center gap-4">
            <Link href="/guidebook" className="hover:text-brown-900 underline underline-offset-4">
              Bantuan Krisis
            </Link>
            <Link href="/onboarding" className="hover:text-brown-900 underline underline-offset-4">
              Mulai Akun
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
