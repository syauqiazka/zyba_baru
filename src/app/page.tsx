import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingIntro } from "@/components/landing/LandingIntro";
import { LandingEcosystem } from "@/components/landing/LandingEcosystem";
import { LandingMeetZibi } from "@/components/landing/LandingMeetZibi";
import { LandingInsights } from "@/components/landing/LandingInsights";
import { LandingArticles } from "@/components/landing/LandingArticles";
import { LandingSafetyPrivacy } from "@/components/landing/LandingSafetyPrivacy";
import { LandingFinalCta } from "@/components/landing/LandingFinalCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata = {
  title: "ZYBA — Digital Sanctuary Experience | Gen Z Wellness Support",
  description:
    "Find your balance at your own pace. A digital sanctuary space to understand yourself, build healthier habits, and reconnect with your everyday wellbeing. 100% bebas biaya selamanya.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F8F5] text-brown-900 selection:bg-orange-200 selection:text-brown-900">
      {/* 0. Sticky Navigation Bar */}
      <LandingNavbar />

      <main>
        {/* SECTION 01 — HERO */}
        <LandingHero />

        {/* SECTION 02 — INTRODUCTION (3 Value Pillars) */}
        <LandingIntro />

        {/* SECTION 03 — FEATURE ECOSYSTEM (Real Product Previews) */}
        <LandingEcosystem />

        {/* SECTION 04 — MEET ZIBI (Mascot & Interaction Preview) */}
        <LandingMeetZibi />

        {/* SECTION 05 — WELLNESS INSIGHTS (Zyba Score & Tracking) */}
        <LandingInsights />

        {/* SECTION 06 — HEALTH ARTICLES (Curated Literature) */}
        <LandingArticles />

        {/* SECTION 07 — SAFETY AND PRIVACY (Responsible AI & 119 Hotline) */}
        <LandingSafetyPrivacy />

        {/* SECTION 08 — FINAL CTA ("Your Journey. Your Pace.") */}
        <LandingFinalCta />
      </main>

      {/* SECTION 09 — FOOTER */}
      <LandingFooter />
    </div>
  );
}
