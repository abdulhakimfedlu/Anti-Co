"use client";

import BlurredOrb from "@/components/blurred-orb";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import MiniFeatures from "@/components/mini-features";
import Stats from "@/components/stats";
import ToolFeature from "@/components/tool-feature";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="relative px-4 py-6 mx-auto w-full overflow-hidden">
      <Navbar />

      {/* Decorative orb — top left */}
      <BlurredOrb
        className="absolute top-0 left-0 h-[15rem] w-[15rem] lg:h-[30rem] lg:w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-10 animate-pulse-slow"
        style={{
          background: `radial-gradient(circle at center, var(--color-hero-start) 0%, var(--color-hero-mid) 60%, var(--color-hero-end) 100%)`,
          filter: "blur(100px)",
        }}
      />
      {/* Decorative orb — bottom right */}
      <BlurredOrb
        className="absolute bottom-0 right-0 h-[15rem] w-[15rem] lg:h-[25rem] lg:w-[25rem] translate-x-1/2 translate-y-1/2 opacity-10 animate-pulse-slow"
        style={{
          background: `radial-gradient(circle at center, #e6a817 0%, #3260c8 60%, transparent 100%)`,
          filter: "blur(100px)",
          animationDelay: "3s",
        }}
      />

      {/* Page content */}
      <div className="flex flex-col gap-12 lg:gap-20 mt-32 mb-14 lg:my-28 mx-auto w-full max-w-7xl">
        <Hero />
        <HowItWorks />
        <MiniFeatures />
        <Stats />
        <ToolFeature />
        <Testimonials />
        <Footer />
      </div>

      {/* Bottom bar */}
      <section
        className="flex flex-row items-center justify-between gap-4 border-t py-4 mx-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <Shield className="h-4 w-4" style={{ color: "var(--accent)" }} strokeWidth={1.8} />
          </div>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {t.hero.committeeLabel}
          </span>
        </div>
        <ThemeToggle />
      </section>
    </div>
  );
}
