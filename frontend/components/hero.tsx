"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ShieldCheck, Lock, Scale, AlertTriangle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const Hero = () => {
  const { locale, t } = useLanguage();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-10 lg:py-20 w-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <section className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between w-full gap-12 lg:gap-8 max-w-7xl mx-auto">

        {/* Left Side: Official Statement & CTAs */}
        <div className="flex flex-col justify-center gap-8 lg:max-w-2xl text-center lg:text-left">

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 self-center lg:self-start rounded-full px-4 py-1.5 border"
            style={{
              borderColor: "var(--border)",
              background: "var(--card)",
            }}
          >
            <ShieldCheck className="h-4 w-4" style={{ color: "var(--primary)" }} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Headline - Solid Typography */}
          <motion.h1
            className={`font-black uppercase tracking-tight leading-[1.1] ${locale === "am"
              ? "text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
              : "text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
              }`}
            style={{ color: "var(--foreground)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t.hero.headline1} {t.hero.headline2}
            <br />
            {t.hero.headline3} <span>{t.hero.headline4}</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
            style={{ color: "var(--muted-foreground)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {t.hero.subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              href="/submit"
              id="hero-submit-cta"
              className="group flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold tracking-wide hero-submit-btn"
            >
              <AlertTriangle className="h-5 w-5" />
              {t.hero.cta}
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center justify-center rounded-xl border-2 px-8 py-4 text-base font-bold transition-all duration-200 hover:opacity-75"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                background: "var(--card)",
              }}
            >
              {t.hero.ctaSecondary}
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Secure Gateway Card */}
        <motion.div
          className="w-full lg:max-w-md flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <div
            className="relative flex flex-col gap-6 rounded-[2rem] p-8 sm:p-10 overflow-hidden border"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 w-full h-1.5"
              style={{ background: "var(--primary)" }}
            />

            {/* Header */}
            <div className="flex items-start gap-4 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}
              >
                <Scale className="h-6 w-6" style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {t.hero.mission}
                </h3>
                <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {t.hero.committeeLabel}
                </p>
              </div>
            </div>

            {/* Trust Features */}
            <div className="flex flex-col gap-5 pt-2">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border flex items-center justify-center flex-shrink-0" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
                  <Lock className="h-4 w-4" style={{ color: "var(--foreground)" }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                    {t.hero.stat2Label} ({t.hero.stat2Value})
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {t.form.anonymousDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border flex items-center justify-center flex-shrink-0" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
                  <ShieldCheck className="h-4 w-4" style={{ color: "var(--foreground)" }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                    {t.hero.stat1Label} ({t.hero.stat1Value})
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {t.hero.trustLine}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div
              className="mt-4 rounded-2xl p-4 border"
              style={{
                background: "color-mix(in srgb, var(--primary) 5%, transparent)",
                borderColor: "color-mix(in srgb, var(--primary) 20%, transparent)"
              }}
            >
              <p className="text-[13px] font-semibold flex items-start gap-2" style={{ color: "var(--foreground)" }}>
                <Lock className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                {t.form.privacy}
              </p>
            </div>

          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Hero;
