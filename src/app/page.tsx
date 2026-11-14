import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Wind,
  Sparkles,
  MessageCircle,
  Flame,
  Users2,
  CheckCircle2,
} from "lucide-react";
import { MascotHero, Mascot } from "@/components/ui/Mascot";
import { MASCOT_NAME } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F2E7] text-brown-900 selection:bg-orange-200 selection:text-brown-900">
      {/* Floating Sanctuary Top Nav */}
      <header className="px-6 py-4 border-b border-brown-900/10 bg-[#F7F2E7]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
                Sanctuary
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/guidebook"
              className="text-xs font-semibold text-brown-700 hover:text-brown-900 transition-colors flex items-center gap-1.5 px-3 py-1.5"
            >
              <ShieldCheck className="h-4 w-4 text-[#3E7B54]" />
              <span className="hidden sm:inline">Bantuan Krisis</span>
            </Link>

            <Link
              href="/login"
              className="text-xs font-bold text-brown-900 hover:text-[#3E7B54] transition-colors px-3 py-1.5"
            >
              Masuk
            </Link>

            <Link
              href="/onboarding"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-orange-500 px-4 text-xs font-bold text-brown-900 shadow-2xs hover:bg-orange-600 transition-all focus:outline-hidden"
            >
              <span>Mulai Ruang Aman</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (Atmospheric & Tactile Composition) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-24">
        
        {/* HERO: Asymmetrical 65:35 with Box-Free Mascot Zibi */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* SISI KIRI (7 Kolom): Tipografi Berkarakter Kuat */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brown-900 leading-[1.12]">
              Ketika dunia di luar terlalu bising, ZYBA hadir sebagai jeda heningmu.
            </h1>

            <p className="text-base sm:text-lg text-brown-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Dirancang untuk menghadirkan ketenangan linen yang hangat, tanpa streak api yang menekan, dan 100% bebas biaya selamanya.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/onboarding"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-orange-500 px-8 text-sm font-bold text-brown-900 shadow-xs hover:bg-orange-600 transition-all"
              >
                <span>Mulai Perjalanan Batin</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/guidebook"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-brown-900/15 bg-white/80 px-6 text-sm font-semibold text-brown-900 hover:bg-white transition-all shadow-2xs"
              >
                <HeartHandshake className="h-4 w-4 text-[#3E7B54]" />
                <span>Panduan & Direktori Krisis</span>
              </Link>
            </div>

            {/* Micro assurances */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-brown-700/70 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3E7B54]" />
                Privasi Terlindungi
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3E7B54]" />
                Bebas Bayar-Bayaran
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3E7B54]" />
                Tanpa Beban Streak
              </span>
            </div>
          </div>

          {/* SISI KANAN (5 Kolom): Maskot Resmi Zibi Bebas Kotak */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <MascotHero
              size={330}
              priority={true}
              decorative={false}
              className="relative z-10 drop-shadow-[0_12px_28px_rgba(62,123,84,0.14)]"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-medium text-brown-700">
                Temui <strong className="font-bold text-brown-900">{MASCOT_NAME}</strong>, sahabat mindful ZYBA kamu
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Suaka Curhat Bersama Zibi (Editorial Layout, Box-Free) */}
        <section className="rounded-[32px] border border-brown-900/10 bg-white p-8 sm:p-12 lg:p-14 shadow-[0_8px_30px_-6px_rgba(59,42,32,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left 7 Columns: Editorial Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 tracking-tight leading-snug">
                Tempat aman untuk bercerita tanpa takut dihakimi.
              </h2>
              <p className="text-sm sm:text-base text-brown-700 leading-relaxed">
                Di sini, kamu tidak perlu berpura-pura baik-baik saja. Zibi hadir sebagai pendamping mindful berbasis AI yang sabar mendengarkan setiap keluh kesahmu, memilah benang kusut overthinking, dan memeluk perasaanmu dengan penuh kasih 24/7.
              </p>
              
              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 rounded-full bg-brown-900 px-6 py-3 text-xs font-bold text-[#F7F2E7] hover:bg-brown-900/90 transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-orange-400" />
                  <span>Curhat Bersama {MASCOT_NAME} Sekarang</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Zibi Menyapa Alami (Tanpa Kotak/Border Pembatas) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
              <Mascot
                pose="listening"
                size={190}
                animate={true}
                decorative={true}
                className="relative z-10 drop-shadow-[0_8px_20px_rgba(62,123,84,0.12)]"
              />
              <div className="mt-3 max-w-xs">
                <p className="font-serif text-sm font-bold text-brown-900">
                  &quot;Aku di sini mendengarkanmu. Ceritakan apa pun yang terasa berat...&quot;
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: 4 Ruang Utama Suaka (Editorial Asymmetry, Clean Dividers, No Slop Cards) */}
        <section className="space-y-8">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 tracking-tight">
              Empat Ruang untuk Menemukan Keseimbangan Batin.
            </h2>
            <p className="text-sm sm:text-base text-brown-700 mt-2 leading-relaxed">
              Setiap sudut di ZYBA dirancang dengan pertimbangan mindful, menjauhkan kecemasan dan mengembalikan kendali hidup ke tanganmu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Ruang 1: Check-in Harian & Skor */}
            <div className="p-8 rounded-[28px] bg-white border border-brown-900/10 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3E7B54] mb-2 block">
                  01 &bull; Evaluasi Batin
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-2">
                  Check-In 15 Pertanyaan
                </h3>
                <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                  Menilai kondisi mental, fisik, dan sosialmu dalam format 5 langkah santai tanpa kelelahan kognitif. Skor Zyba dihitung secara dinamis dan jujur.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brown-900/10 flex items-center justify-between text-xs font-semibold text-[#3E7B54]">
                <span>Alur terstruktur &bull; Satu kali sehari</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Ruang 2: Hearth Flame */}
            <div className="p-8 rounded-[28px] bg-white border border-brown-900/10 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 mb-2 block">
                  02 &bull; Konsistensi Lembut
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-2">
                  Hearth Flame Sanctuary
                </h3>
                <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                  Menjaga api lilin kesadaranmu tetap hangat. Jika kamu terlewat satu hari, api hanya meredup lembut tanpa streak merah yang membikin bersalah.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brown-900/10 flex items-center justify-between text-xs font-semibold text-orange-600">
                <span>Bebas rasa bersalah &bull; Mindful habit</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Ruang 3: Taman Nafas 4-7-8 */}
            <div className="p-8 rounded-[28px] bg-white border border-brown-900/10 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3E7B54] mb-2 block">
                  03 &bull; Relaksasi Fisiologis
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-2">
                  Breathing Garden 4-7-8
                </h3>
                <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                  Latihan pernapasan ilmiah yang merangsang saraf parasimpatis untuk meredakan serangan panik, kecemasan akut, atau insomnia.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brown-900/10 flex items-center justify-between text-xs font-semibold text-[#3E7B54]">
                <span>Ritme biologis &bull; Ramah reduced-motion</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Ruang 4: Komunitas Suaka */}
            <div className="p-8 rounded-[28px] bg-white border border-brown-900/10 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700 mb-2 block">
                  04 &bull; Lingkar Saling Menguatkan
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-2">
                  Zyba Community
                </h3>
                <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                  Ruang berbagi cerita anonim dengan teman sebaya yang memahami pergulatanmu. Saling memberi semangat tanpa algoritma adiktif dan tanpa toksisitas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brown-900/10 flex items-center justify-between text-xs font-semibold text-brown-900">
                <span>Anonim &bull; Moderasi terlindungi</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-brown-900/10 py-10 px-6 text-xs text-brown-700/70 mt-20 bg-white/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="font-serif font-bold text-brown-900 text-sm">ZYBA</span>
            <span className="block text-[11px] mt-0.5">&copy; {new Date().getFullYear()} ZYBA Wellness Support &bull; The Tactile Sanctuary.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/guidebook" className="hover:text-brown-900 transition-colors">
              Bantuan Krisis 24/7
            </Link>
            <Link href="/login" className="hover:text-brown-900 transition-colors">
              Masuk
            </Link>
            <Link href="/onboarding" className="hover:text-brown-900 transition-colors">
              Mulai Akun Baru
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
