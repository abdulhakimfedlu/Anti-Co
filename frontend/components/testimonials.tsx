"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

import { useLanguage } from "@/lib/language-context";

const testimonialColors = ["#3260c8", "#16a34a", "#e6a817", "#7c3aed", "#dc2626", "#0891b2"];

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = t.testimonials.list.map((test, i) => ({
    ...test,
    initials: test.name.split(" ").map((n) => n[0]).join("").substring(0, 2),
    color: testimonialColors[i % testimonialColors.length],
    stars: 5,
  }));
  return (
    <motion.section
      className="mx-auto max-w-6xl px-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Section header */}
      <div className="mb-12 text-center">
        <div className="gold-badge mb-4">
          <Quote className="h-3 w-3" />
          {t.testimonials.badge}
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {t.testimonials.title1}
          <br />
          <span>{t.testimonials.title2}</span>
        </h2>

        <p
          className="mt-4 text-base max-w-xl mx-auto"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t.testimonials.subtitle}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="flex flex-col gap-4 rounded-3xl border p-6"
            style={{
              borderColor: "var(--border)",
              background: "var(--card)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: t.stars }).map((_, si) => (
                <Star key={si} className="h-3.5 w-3.5 fill-current" style={{ color: "#e6a817" }} />
              ))}
            </div>

            {/* Quote */}
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ color: "var(--foreground)" }}
            >
              &ldquo;{t.content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ background: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {t.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Testimonials;
