import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream text-brown-900 flex flex-col justify-between p-6 sm:p-12 selection:bg-orange-100">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brown-900 text-cream flex items-center justify-center font-display font-extrabold text-lg">
            Z
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-brown-900">
            ZYBA
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Masuk Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full py-12 space-y-8">
        <div className="space-y-4">
          <Badge variant="warm" pill>
            GEN Z WELLNESS SUPPORT
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brown-900 tracking-tight leading-tight">
            Ruang aman yang lapang, hangat, dan tenang.
          </h1>
          <p className="font-body text-base sm:text-lg text-brown-700 leading-relaxed max-w-2xl">
            Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Bebas biaya, tanpa tekanan, dan dirancang untuk ritme hidupmu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard">
            <Button variant="warm" size="lg">
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
            </Button>
          </Link>
          <Link href="/guidebook">
            <Button variant="secondary" size="lg">
              <HeartHandshake className="w-4 h-4" strokeWidth={1.8} />
              <span>Bantuan Krisis</span>
            </Button>
          </Link>
        </div>

        {/* Foundation Card Showcase untuk verifikasi token */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8">
          <Card variant="content" elevation={1} className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-brown-900">
              <Sparkles className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
            </div>
            <h2 className="font-display font-bold text-base text-brown-900">
              Refleksi Terbuka
            </h2>
            <p className="font-body text-sm text-brown-700 leading-relaxed">
              Curahkan isi hatimu pada Zyba Companion dengan dukungan persona empatik.
            </p>
          </Card>

          <Card variant="content" elevation={1} className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-brown-900">
              <ShieldCheck className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
            </div>
            <h2 className="font-display font-bold text-base text-brown-900">
              Privasi Mutlak
            </h2>
            <p className="font-body text-sm text-brown-700 leading-relaxed">
              Data terpisah dalam arsitektur terisolasi dengan proteksi keselamatan penuh.
            </p>
          </Card>

          <Card variant="content" elevation={1} className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cream border border-brown-900/10 flex items-center justify-center text-brown-900">
              <HeartHandshake className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
            </div>
            <h2 className="font-display font-bold text-base text-brown-900">
              100% Bebas Biaya
            </h2>
            <p className="font-body text-sm text-brown-700 leading-relaxed">
              Seluruh wawasan, latihan napas, dan pendampingan dapat diakses tanpa kuncian berbayar.
            </p>
          </Card>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full pt-8 border-t border-brown-900/10 flex flex-col sm:flex-row items-center justify-between text-xs text-brown-700/70 gap-4">
        <span>© 2026 ZYBA — The Tactile Sanctuary</span>
        <div className="flex gap-4">
          <Link href="/guidebook" className="hover:text-brown-900 underline">
            Panduan & Bantuan Krisis
          </Link>
          <Link href="/settings" className="hover:text-brown-900 underline">
            Privasi & Keamanan
          </Link>
        </div>
      </footer>
    </div>
  );
}

