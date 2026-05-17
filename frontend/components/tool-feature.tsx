"use client";

import { motion } from "motion/react";
import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const partnerColors = ["#1a3578", "#3260c8", "#16a34a", "#e6a817", "#7c3aed"];

export default function ToolFeature() {
  const { t } = useLanguage();

  const partners = t.partners.list.map((p, i) => ({
    ...p,
    color: partnerColors[i % partnerColors.length],
  }));
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex w-full flex-col items-center justify-center lg:my-6 mx-auto max-w-6xl px-4"
    >
      {/* Header */}
      <div className="mb-12 flex flex-col items-center gap-3 px-4 text-center">
        <div className="gold-badge mb-2">
          <Shield className="h-3 w-3" />
          {t.partners.badge}
        </div>
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: "var(--foreground)" }}
        >
          {t.partners.title1}{" "}
          <span className="gradient-text">{t.partners.title2}</span>
        </h2>
        <p
          className="max-w-md text-sm sm:text-base"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t.partners.subtitle}
        </p>
      </div>

      {/* Partner badges — overlapping circle style from source */}
      <div className="flex items-center justify-center -space-x-3 flex-wrap gap-y-4">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            title={partner.name}
            className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 text-xs font-bold text-white shadow-md transition-transform duration-200 hover:scale-110 hover:z-10 cursor-default"
            style={{
              background: partner.color,
              borderColor: "var(--background)",
              boxShadow: `0 4px 12px -2px ${partner.color}60`,
            }}
          >
            {partner.abbr}
          </motion.div>
        ))}
      </div>

      {/* Full names below */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {partners.map((partner) => (
          <span
            key={partner.name}
            className="text-xs rounded-full border px-3 py-1"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
              background: "var(--muted)",
            }}
          >
            {partner.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
