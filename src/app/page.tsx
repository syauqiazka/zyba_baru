import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSteps } from "@/components/landing/LandingSteps";
import { LandingShowcase } from "@/components/landing/LandingShowcase";
import { LandingValues } from "@/components/landing/LandingValues";
import { LandingDeepDives } from "@/components/landing/LandingDeepDives";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingCtaFooter } from "@/components/landing/LandingCtaFooter";

export const metadata = {
  title: "ZYBA Sanctuary — Gen Z Wellness Support",
  description:
    "Suaka pendampingan kesehatan mental, fisik, dan sosial berbasis AI. Tenang, hangat, tanpa streak api yang menekan, dan 100% bebas biaya selamanya.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F8F5] text-brown-900 selection:bg-orange-200 selection:text-brown-900">
      {/* 1. Navbar (Foto 4: Sign In & Sign Up buttons) */}
      <LandingNavbar />

      {/* 2. Hero Section (Foto 2: BirdPulse split style with giant headline, Zibi mascot, and glassy phone pulse) */}
      <main>
        <LandingHero />

        {/* 3. Alur 3 Langkah (Foto 3: From idea to live page in 3 steps) */}
        <LandingSteps />

        {/* 4. Ekosistem Suaka (Foto 3: See what it can create) */}
        <LandingShowcase />

        {/* 5. 6 Nilai Inti Suaka (Foto 3: Built for conversion grid) */}
        <LandingValues />

        {/* 6. Eksplorasi Antarmuka / Deep Dives (Foto 3: Device highlights) */}
        <LandingDeepDives />

        {/* 7. Suara & Cerita Komunitas (Foto 3: User testimonials) */}
        <LandingTestimonials />

        {/* 8. Tanya Jawab / FAQ (Foto 3: Frequently Asked Questions) */}
        <LandingFaq />

        {/* 9. Final CTA Banner & Footer (Foto 3: Bottom Banner) */}
        <LandingCtaFooter />
      </main>
    </div>
  );
}
