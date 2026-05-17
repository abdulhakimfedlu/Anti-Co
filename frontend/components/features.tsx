"use client";

import { motion } from "motion/react";
import React from "react";
import { useLanguage } from "@/lib/language-context";
import { ArrowDown } from "lucide-react";

const StickyCard = ({
  i,
  title,
  description,
  color,
  total,
}: {
  i: number;
  title: string;
  description: string;
  color: string;
  total: number;
}) => {
  // Each card sticks slightly lower than the previous one to form a stack
  // 180px accounts for the sticky header above.
  const topOffset = `calc(180px + ${i * 30}px)`;

  return (
    <div
      className="sticky flex flex-col items-center justify-center text-center rounded-[3rem] w-[92%] max-w-4xl mx-auto h-[420px] sm:h-[480px] p-8 sm:p-16 overflow-hidden border shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out hover:scale-[1.01]"
      style={{
        top: topOffset,
        zIndex: i, // Ensures later cards stack on top of earlier ones
      }}
    >
      {/* Premium Solid Background */}
      <div
        className="absolute inset-0 w-full h-full -z-10 shadow-inner"
        style={{ background: "var(--card)" }}
      />

      {/* Decorative Mesh Gradient Corner */}
      <div
        className="absolute -right-20 -top-20 w-64 h-64 blur-3xl opacity-20 dark:opacity-30 rounded-full"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      {/* Top Accent line with gradient */}
      <div className="absolute top-0 left-0 w-full h-2 z-10" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      {/* Modern Card Number */}
      <div className="absolute left-10 top-10 text-xl font-bold opacity-10 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
        <span className="h-px w-8 bg-current" />
        0{i + 1}
      </div>

      <div className="relative z-20 max-w-2xl flex flex-col items-center">
        {/* Subtle accent color bar replacing the icon */}
        <div className="mb-8 h-1.5 w-16 rounded-full" style={{ background: color }} />

        <h3 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter leading-tight" style={{ color: "var(--foreground)" }}>
          {title}
        </h3>
        <p className="text-xl sm:text-2xl leading-relaxed font-medium max-w-xl opacity-80" style={{ color: "var(--muted-foreground)" }}>
          {description}
        </p>
      </div>

      {/* Bottom Hint - only on cards except the last one to encourage scrolling */}
      {i < total - 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30 text-xs font-bold tracking-widest uppercase">
          <span>Scroll to reveal next</span>
          <ArrowDown className="h-3 w-3 animate-bounce" />
        </div>
      )}
    </div>
  );
};

const Feature = () => {
  const { t } = useLanguage();

  const featuresList = [
    { title: t.features.f1title, description: t.features.f1desc, color: "#f97316" },
    { title: t.features.f2title, description: t.features.f2desc, color: "#3260c8" },
    { title: t.features.f3title, description: t.features.f3desc, color: "#16a34a" },
    { title: t.features.f4title, description: t.features.f4desc, color: "#ea580c" },
  ];

  return (
    <section id="about" className="relative w-full">

      {/* Header section (fixed at top while scrolling through cards) */}
      {/* The background ensures cards passing behind the header are obscured */}
      <div className="sticky top-0 left-0 w-full pt-16 sm:pt-24 pb-8 text-center px-4 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 border mb-6 backdrop-blur-md bg-white/5 shadow-sm"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>
            {t.features.badge}
          </span>
        </motion.div>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1]" style={{ color: "var(--foreground)" }}>
          {t.features.title1} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{t.features.title2}</span>
        </h2>
      </div>

      {/* Cards Stack Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-20">

        {/* The huge gap forces the user to scroll to reveal the next card. 
            pb-[60vh] ensures the last card sticks before the whole section scrolls away. */}
        <div className="flex flex-col w-full gap-[60vh] pb-[60vh]">
          {featuresList.map((feat, i) => (
            <StickyCard
              key={i}
              i={i}
              {...feat}
              total={featuresList.length}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Feature;
