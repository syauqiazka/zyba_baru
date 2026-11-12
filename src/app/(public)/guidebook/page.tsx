import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  PhoneCall,
  HeartHandshake,
  ShieldAlert,
  ArrowLeft,
  LifeBuoy,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Panduan & Bantuan Krisis — ZYBA",
  description:
    "Direktori kontak darurat dan pertolongan pertama psikologis yang dapat diakses publik tanpa login.",
};

const crisisContacts = [
  {
    name: "Layanan Sejiwa (Kemenkes RI)",
    hotline: "119 ext. 8",
    description: "Konseling kesehatan jiwa darurat nasional gratis oleh psikolog klinis Kemenkes.",
    availability: "Setiap hari (24 Jam)",
    telLink: "tel:119",
  },
  {
    name: "Yayasan Pulih",
    hotline: "0811-8436-633",
    description: "Layanan konseling trauma, pemulihan luka batin, dan pendampingan psikologis.",
    availability: "Senin – Jumat (09:00 - 17:00 WIB)",
    telLink: "tel:08118436633",
  },
  {
    name: "LISA Suicide Prevention Helpline",
    hotline: "0811-3855-472",
    description: "Layanan dukungan emosional bilingual (Indonesia/Inggris) untuk pencegahan krisis.",
    availability: "Setiap hari (24 Jam)",
    telLink: "tel:08113855472",
  },
  {
    name: "Layanan Darurat Medis / Ambulans",
    hotline: "118 / 119",
    description: "Bantuan medis segera jika terjadi situasi darurat fisik.",
    availability: "24 Jam Nasional",
    telLink: "tel:119",
  },
];

export default function GuidebookPage() {
  return (
    <div className="min-h-screen bg-cream text-brown-900 p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brown-900/10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brown-700 hover:text-brown-900 transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
            <span>Kembali ke Beranda</span>
          </Link>
          <Badge variant="warm" pill>
            DIREKTORI RESMI
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-brown-900">
            <HeartHandshake className="w-6 h-6 text-brown-900" strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brown-900 tracking-tight">
            Panduan & Bantuan Krisis
          </h1>
          <p className="font-body text-base text-brown-700 leading-relaxed max-w-2xl">
            Jika kamu atau orang di sekitarmu sedang mengalami krisis emosional, merasa kewalahan, atau membutuhkan seseorang untuk diajak bicara, tenaga profesional siap mendengarkanmu tanpa syarat.
          </p>
        </div>

        {/* Crisis Contact Cards */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-brown-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
            Kontak Bantuan Darurat
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crisisContacts.map((contact, idx) => (
              <Card key={idx} variant="content" elevation={1} className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700/80">
                      {contact.availability}
                    </span>
                    <Badge variant="vitality" pill>Aktif</Badge>
                  </div>
                  <h3 className="font-display font-bold text-base text-brown-900">
                    {contact.name}
                  </h3>
                  <p className="font-body text-xs text-brown-700 leading-relaxed">
                    {contact.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-brown-900/10 flex items-center justify-between">
                  <span className="font-display font-extrabold text-lg text-brown-900">
                    {contact.hotline}
                  </span>
                  <a href={contact.telLink}>
                    <Button variant="warm" size="sm">
                      <PhoneCall className="w-3.5 h-3.5 text-brown-900" strokeWidth={1.8} />
                      <span>Hubungi Sekarang</span>
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Grounding Technique Card (Pertolongan Pertama Emosional) */}
        <Card variant="anchor" elevation={1} className="space-y-4 bg-white/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-brown-900">
              <Sparkles className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-brown-900">
                Teknik Grounding 5-4-3-2-1
              </h2>
              <p className="text-xs text-brown-700/80">
                Langkah cepat menenangkan tubuh saat diserang kepanikan atau overthinking
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-cream border border-brown-900/10 space-y-1">
              <span className="font-display font-extrabold text-lg text-orange-500">5</span>
              <p className="text-xs font-semibold text-brown-900">Benda Dilihat</p>
              <p className="text-[11px] text-brown-700/80 leading-normal">Amati 5 hal di sekitarmu dengan seksama.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-cream border border-brown-900/10 space-y-1">
              <span className="font-display font-extrabold text-lg text-orange-500">4</span>
              <p className="text-xs font-semibold text-brown-900">Benda Disentuh</p>
              <p className="text-[11px] text-brown-700/80 leading-normal">Rasakan tekstur kain, meja, atau napasmu.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-cream border border-brown-900/10 space-y-1">
              <span className="font-display font-extrabold text-lg text-orange-500">3</span>
              <p className="text-xs font-semibold text-brown-900">Suara Didengar</p>
              <p className="text-[11px] text-brown-700/80 leading-normal">Dengarkan suara angin, kendaraan, atau jam.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-cream border border-brown-900/10 space-y-1">
              <span className="font-display font-extrabold text-lg text-orange-500">2</span>
              <p className="text-xs font-semibold text-brown-900">Aroma Dicium</p>
              <p className="text-[11px] text-brown-700/80 leading-normal">Tarik napas dalam, kenali aroma di ruangan.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-cream border border-brown-900/10 space-y-1">
              <span className="font-display font-extrabold text-lg text-orange-500">1</span>
              <p className="text-xs font-semibold text-brown-900">Rasa Dikecap</p>
              <p className="text-[11px] text-brown-700/80 leading-normal">Minum seteguk air hangat dan rasakan sensasinya.</p>
            </div>
          </div>
        </Card>

        {/* Professional Disclaimer */}
        <div className="p-4 rounded-2xl bg-brown-900/5 border border-brown-900/10 text-xs text-brown-700 leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-brown-900 shrink-0 mt-0.5" strokeWidth={1.8} />
          <p>
            <strong>Pemberitahuan Keselamatan:</strong> ZYBA adalah aplikasi pendamping kesejahteraan diri berbasis AI dan bukan pengganti layanan medis, diagnosis psikiatri, atau psikoterapi profesional. Jika kamu berada dalam kondisi bahaya fisik darurat, segera hubungi kontak bantuan di atas atau kunjungi fasilitas kesehatan terdekat.
          </p>
        </div>
      </div>
    </div>
  );
}

