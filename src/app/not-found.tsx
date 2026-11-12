import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12 selection:bg-orange-200">
      <div className="max-w-md w-full rounded-3xl border border-brown-900/10 bg-white/95 p-8 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)] text-center">
        <div className="flex justify-center mb-4">
          <Mascot pose="sad" size={130} animate={false} decorative={true} />
        </div>

        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brown-700/70">
          404 • Halaman Belum Tersedia
        </span>
        <h1 className="mt-2 font-serif text-2xl font-bold text-brown-900">
          Jejak Langkah Belum Ditemukan
        </h1>
        <p className="mt-2 text-xs md:text-sm leading-relaxed text-brown-700">
          Sepertinya suaka yang kamu tuju belum tersedia atau tautannya telah berpindah. Jangan khawatir, kamu selalu bisa kembali ke tempat yang nyaman.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-xs font-bold text-brown-900 shadow-sm hover:bg-orange-600 transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Ke Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brown-900/15 bg-white px-5 text-xs font-semibold text-brown-900 hover:bg-brown-900/5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Halaman Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

