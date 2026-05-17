"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Shield, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { name: t.nav.about, href: "#about" },
    { name: t.nav.howItWorks, href: "#how-it-works" },
    { name: t.nav.services, href: "#services" },
    { name: t.nav.submitComplaint, href: "/submit" },
  ];

  const legalLinks = [
    { name: t.footer.privacy, href: "#" },
    { name: t.footer.terms, href: "#" },
    { name: t.footer.accessibility, href: "#" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+251-11-xxx-xxxx", href: "tel:+251" },
    { icon: Mail, text: "info@woreda05anticorruption.gov.et", href: "mailto:info@woreda05anticorruption.gov.et" },
    { icon: MapPin, text: t.hero.locationLabel, href: "#" },
  ];
  return (
    <motion.footer
      id="contact"
      className="relative mx-auto max-w-6xl px-4 scroll-mt-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* CTA Banner */}
      <div
        className="rounded-3xl p-6 sm:p-10 md:p-12 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          background: "var(--primary)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            <span>{t.footer.readyTitle}</span>
          </h3>
          <p className="text-white/75 text-base max-w-md">
            {t.footer.readySubtext}
          </p>
        </div>
        <Link
          href="/submit"
          id="footer-submit-cta"
          className="flex-shrink-0 flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          {t.footer.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main footer body */}
      <div
        className="rounded-3xl border p-5 sm:p-8 md:p-10"
        style={{
          borderColor: "var(--border)",
          background: "var(--card)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--primary)" }}
              >
                <Shield className="h-5 w-5" style={{ color: "var(--accent)" }} strokeWidth={1.8} />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Woreda 05 · Yeka
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  Anti-Corruption
                </span>
              </div>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t.footer.brandSub}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t.footer.navLabel}
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--foreground)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--foreground)")
                    }
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t.footer.legalLabel}
            </p>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--foreground)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--foreground)")
                    }
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t.footer.contactLabel}
            </p>
            <ul className="flex flex-col gap-3">
              {contactInfo.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <Link
                    href={href}
                    className="flex items-start gap-2 text-xs leading-relaxed transition-colors"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {t.footer.country}
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
