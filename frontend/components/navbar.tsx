"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/lib/language-context";
import type { Locale } from "@/lib/translations";

const Navbar = () => {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  const links = [
    { name: t.nav.about, href: "#about" },
    { name: t.nav.howItWorks, href: "#how-it-works" },
    { name: t.nav.services, href: "#services" },
    { name: t.nav.contact, href: "#contact" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 50);
    if (latest > previous && latest > 150) {
      setIsHidden(true);
      setIsOpen(false);
    } else {
      setIsHidden(false);
    }
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const toggleLocale = () => setLocale(locale === "en" ? "am" : "en");

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 mx-auto w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isHidden ? 0 : 1, y: isHidden ? -20 : 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="relative mx-auto max-w-6xl"
        animate={{ scale: isScrolled ? 0.985 : 1 }}
        transition={{ duration: 0.25 }}
      >
        {/* Glow border wrapper */}
        <div className="navbar-glow-wrapper">
        <div className="navbar-glow-inner">

        {/* Bar */}
        <motion.div
          className="flex items-center justify-between px-5 py-3 rounded-2xl"
          animate={{
            backgroundColor: isScrolled
              ? "color-mix(in srgb, var(--background) 88%, transparent)"
              : "var(--background)",
            backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Brand */}
          <Link href="/" className="flex flex-col leading-tight flex-shrink-0 group">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--muted-foreground)" }}
            >
              {locale === "en" ? "Woreda 05 · Yeka Subcity" : "ወረዳ 05 · የካ ክፍለ ከተማ"}
            </span>
            <span
              className="text-sm font-bold tracking-tight transition-colors group-hover:opacity-75"
              style={{ color: "var(--foreground)" }}
            >
              {locale === "en" ? "Anti-Corruption" : "ፀረ-ሙስና ኮሚቴ"}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-all duration-200 relative group"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
              >
                {link.name}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ background: "var(--accent)" }}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <LanguageSwitcher locale={locale} onToggle={toggleLocale} />
            <ThemeToggle />
            {/* Divider */}
            <div className="h-5 w-px" style={{ background: "var(--border)" }} />
            <Link
              href="/submit"
              id="navbar-submit-cta"
              className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 hover:opacity-85"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {t.nav.submitComplaint}
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher locale={locale} onToggle={toggleLocale} compact />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl p-2"
              style={{ color: "var(--foreground)" }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <HamClose />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <HamOpen />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        </div>{/* end glow-inner */}
        </div>{/* end glow-wrapper */}

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute left-0 right-0 top-full mt-2 overflow-hidden lg:hidden"
            >
              <div
                className="rounded-2xl border p-4 flex flex-col gap-1 backdrop-blur-xl"
                style={{
                  borderColor: "var(--border)",
                  background: "color-mix(in srgb, var(--background) 96%, transparent)",
                }}
              >
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{ color: "var(--foreground)" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <Link
                    href="/submit"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-center transition-all"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    {t.nav.submitComplaint}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ─── Language Switcher ──────────────────────────────────────── */
function LanguageSwitcher({
  locale,
  onToggle,
  compact = false,
}: {
  locale: Locale;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      title="Switch language / ቋንቋ ቀይር"
      className="flex items-center rounded-xl border transition-all duration-200 hover:opacity-75 cursor-pointer"
      style={{
        borderColor: "var(--border)",
        background: "var(--muted)",
        padding: compact ? "4px 8px" : "5px 10px",
        gap: "6px",
      }}
    >
      {/* Two-pill toggle */}
      <span
        className="text-[11px] font-semibold rounded-md px-1.5 py-0.5 transition-all"
        style={{
          background: locale === "en" ? "var(--primary)" : "transparent",
          color: locale === "en" ? "var(--primary-foreground)" : "var(--muted-foreground)",
        }}
      >
        EN
      </span>
      <span
        className="text-[11px] font-semibold rounded-md px-1.5 py-0.5 transition-all"
        style={{
          fontFamily: "serif",
          background: locale === "am" ? "var(--primary)" : "transparent",
          color: locale === "am" ? "var(--primary-foreground)" : "var(--muted-foreground)",
        }}
      >
        አማ
      </span>
    </button>
  );
}

/* ─── Minimal icon SVGs (no lucide) ─────────────────────────── */
function HamOpen() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect y="4" width="20" height="1.5" rx="1" fill="currentColor" />
      <rect y="9.25" width="20" height="1.5" rx="1" fill="currentColor" />
      <rect y="14.5" width="20" height="1.5" rx="1" fill="currentColor" />
    </svg>
  );
}

function HamClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="3" x2="3" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default Navbar;
