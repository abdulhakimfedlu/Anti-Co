"use client";

import { motion } from "motion/react";
import { FileText, Search, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      step: "01",
      icon: FileText,
      title: t.howItWorks.step1title,
      description: t.howItWorks.step1desc,
      color: "#3260c8",
    },
    {
      step: "02",
      icon: Search,
      title: t.howItWorks.step2title,
      description: t.howItWorks.step2desc,
      color: "#e6a817",
    },
    {
      step: "03",
      icon: CheckCircle,
      title: t.howItWorks.step3title,
      description: t.howItWorks.step3desc,
      color: "#16a34a",
    },
  ];
  return (
    <motion.section
      id="how-it-works"
      className="relative mx-auto max-w-6xl px-4 scroll-mt-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Section header */}
      <div className="mb-14 text-center">
        <div className="gold-badge mb-4">
          <ArrowRight className="h-3 w-3" />
          {t.howItWorks.badge}
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {t.howItWorks.title1}
          <br />
          <span>{t.howItWorks.title2}</span>
        </h2>
        <p
          className="mt-4 text-base sm:text-lg max-w-2xl mx-auto"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t.howItWorks.subtitle}
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connector lines (desktop) */}
        <div
          className="hidden md:block absolute top-14 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px"
          style={{ background: "var(--border)" }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex flex-col gap-4 rounded-3xl border p-8"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Step number + icon */}
              <div className="flex items-center gap-4">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{
                    background: step.color,
                    boxShadow: `0 8px 24px -4px ${step.color}40`,
                  }}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.8} />
                </div>
                <span
                  className="text-5xl font-black opacity-10"
                  style={{ color: step.color }}
                >
                  {step.step}
                </span>
              </div>

              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA bottom */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          href="/submit"
          id="how-it-works-cta"
          className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {t.howItWorks.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default HowItWorks;
