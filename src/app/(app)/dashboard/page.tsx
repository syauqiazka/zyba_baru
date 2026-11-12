import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Smile, Bot, Compass, HeartPulse, Sparkles, Flame } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="vitality" pill className="mb-2">
            HARI INI
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 tracking-tight">
            Selamat datang di Ruang Tenangmu
          </h1>
          <p className="font-body text-sm sm:text-base text-brown-700 leading-relaxed">
            Ambil napas sejenak, periksa kabarmu hari ini.
          </p>
        </div>

        <Link href="/mood-check-in">
          <Button variant="warm" size="lg">
            <Smile className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
            <span>Check-In Sekarang</span>
          </Button>
        </Link>
      </div>

      {/* 65:35 Asymmetrical Grid (Sesuai DESIGN.md §4.4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (65% width / 8 cols): Sanctuary Overview */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sanctuary Anchor Card (Hero / Zyba Score Banner) */}
          <Card variant="anchor" elevation={1} className="relative overflow-hidden bg-white/90">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 max-w-md">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brown-700/80">
                  KONDISI HARIAN
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900 leading-snug">
                  Ritme batinmu terasa stabil dan tenang.
                </h2>
                <p className="font-body text-sm text-brown-700 leading-relaxed">
                  Lakukan check-in rutin untuk memetakan dinamika mental, fisik, dan sosialmu.
                </p>
              </div>

              {/* Zyba Score Radial or Counter Display */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-cream border border-brown-900/10 min-w-[140px]">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-brown-900">
                  --
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700/80 mt-1">
                  ZYBA SCORE
                </span>
                <span className="text-[10px] text-brown-700/60 mt-0.5">
                  Belum ada data
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/companion" className="group block">
              <Card
                variant="content"
                elevation={1}
                className="h-full hover:border-brown-900/25 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                  <Bot className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-bold text-base text-brown-900 group-hover:text-orange-500 transition-colors">
                  Zyba Companion
                </h3>
                <p className="font-body text-xs sm:text-sm text-brown-700 leading-relaxed mt-1">
                  Teman dialog empatik siap mendengarkan cerita dan keluh kesahmu.
                </p>
              </Card>
            </Link>

            <Link href="/activity" className="group block">
              <Card
                variant="content"
                elevation={1}
                className="h-full hover:border-brown-900/25 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3">
                  <Compass className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-bold text-base text-brown-900 group-hover:text-green-500 transition-colors">
                  Activity Planner
                </h3>
                <p className="font-body text-xs sm:text-sm text-brown-700 leading-relaxed mt-1">
                  Latihan pernapasan 4-7-8 dan rekomendasi mikro harian tanpa beban.
                </p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Column (35% width / 4 cols): Reflection & Hearth Flame */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hearth Flame Card (Konsistensi Harian Tenang) */}
          <Card variant="content" elevation={1} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-brown-900">
                <Flame className="w-4 h-4 text-brown-900" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-brown-900">
                  Hearth Flame
                </h3>
                <p className="text-[11px] text-brown-700/70">
                  Konsistensi hadir untuk diri sendiri
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cream border border-brown-900/10 text-center space-y-1">
              <p className="text-xs font-semibold text-brown-900">
                Nyalakan lilin ketenanganmu hari ini
              </p>
              <p className="text-[11px] text-brown-700/80">
                Lakukan check-in harian untuk menjaga nyala api tetap hangat.
              </p>
            </div>
          </Card>

          {/* Ruang Sehat & Komunitas Snippet */}
          <Card variant="content" elevation={1} className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brown-700/80">
              LINGKARAN DUKUNGAN
            </span>
            <p className="font-body text-xs sm:text-sm text-brown-700 leading-relaxed">
              Kamu tidak sendirian. Temukan cerita dan saling mendukung di Zyba Community.
            </p>
            <Link href="/community" className="inline-block pt-1">
              <Button variant="outline" size="sm">
                Buka Komunitas
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

