"use client";

import Counter from "@/components/counter";
import { motion } from "motion/react";
import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const Stats = () => {
  const { t } = useLanguage();

  const stats = [
    {
      name: t.stats.s1name,
      value: 847,
      suffix: "+",
      description: t.stats.s1desc,
    },
    {
      name: t.stats.s2name,
      value: 5,
      suffix: "x",
      description: t.stats.s2desc,
    },
    {
      name: t.stats.s3name,
      value: 100,
      suffix: "%",
      description: t.stats.s3desc,
    },
  ];
  return (
    <motion.section
      id="services"
      className="mx-auto max-w-6xl px-4 scroll-mt-24 lg:my-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="mb-14 flex flex-col items-center gap-3 px-4 text-center">
        <div className="gold-badge mb-2">
          <Shield className="h-3 w-3" />
          {t.stats.badge}
        </div>
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: "var(--foreground)" }}
        >
          {t.stats.title1} <span>{t.stats.title2}</span>
        </h2>
        <p
          className="max-w-md text-sm sm:text-base"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t.stats.subtitle}
        </p>
      </div>

      {/* Stats grid — bordered table style from source */}
      <div
        className="grid grid-cols-1 border-l border-t md:grid-cols-3"
        style={{ borderColor: "var(--border)" }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col items-center justify-center border-b border-r px-6 py-12 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Number */}
            <div
              className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: "var(--primary)" }}
            >
              <Counter value={stat.value} suffix={stat.suffix} duration={2000} />
            </div>

            {/* Label */}
            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {stat.name}
            </p>

            {/* Sub-description */}
            <p
              className="mt-1 text-xs max-w-[180px]"
              style={{ color: "var(--muted-foreground)" }}
            >
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Stats;
