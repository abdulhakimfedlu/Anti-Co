"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import { UserX, ShieldCheck, Zap, Search } from "lucide-react";

const MiniFeatures = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t.features.f1title,
      description: t.features.f1desc,
      icon: UserX,
      color: "var(--primary)",
    },
    {
      title: t.features.f2title,
      description: t.features.f2desc,
      icon: ShieldCheck,
      color: "var(--accent)",
    },
    {
      title: t.features.f3title,
      description: t.features.f3desc,
      icon: Zap,
      color: "#16a34a", 
    },
    {
      title: t.features.f4title,
      description: t.features.f4desc,
      icon: Search,
      color: "#3260c8",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-3 rounded-3xl border p-6 sm:p-8 hover:shadow-lg transition-all duration-300 group"
              style={{ 
                borderColor: "var(--border)",
                background: "var(--card)"
              }}
            >
              <div 
                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `color-mix(in srgb, ${feat.color} 15%, transparent)` }}
              >
                <Icon className="h-6 w-6" style={{ color: feat.color }} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                {feat.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {feat.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MiniFeatures;
