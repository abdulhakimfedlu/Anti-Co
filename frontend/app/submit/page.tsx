"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Shield,
  ChevronLeft,
  User,
  Phone,
  FileText,
  AlignLeft,
  Layers,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/lib/language-context";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface FormData {
  fullName: string;
  phone: string;
  subject: string;
  service: string;
  description: string;
  isAnonymous: boolean;
}

type Status = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM: FormData = {
  fullName: "",
  phone: "",
  subject: "",
  service: "",
  description: "",
  isAnonymous: false,
};

function validate(data: FormData, t: any): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!data.isAnonymous) {
    if (!data.fullName.trim()) errors.fullName = t.form.errFullName;
    if (!data.phone.trim()) errors.phone = t.form.errPhone;
    else if (!/^[0-9+\-\s()]{7,15}$/.test(data.phone.trim()))
      errors.phone = t.form.errPhoneInvalid;
  }
  if (!data.subject.trim()) errors.subject = t.form.errSubject;
  if (!data.service) errors.service = t.form.errService;
  if (!data.description.trim()) errors.description = t.form.errDescription;
  else if (data.description.trim().length < 30)
    errors.description = t.form.errDescShort;
  return errors;
}

export default function SubmitComplaintPage() {
  const { t, locale, setLocale } = useLanguage();
  const toggleLocale = () => setLocale(locale === "en" ? "am" : "en");
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [referenceId, setReferenceId] = useState("");

  const { data: servicesData } = useSWR("http://localhost:4000/api/services?limit=100", fetcher);
  const activeServices = (servicesData?.data || []).slice().sort(
    (a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      setErrors(validate(form, t));
    }
  }, [form, touched, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleAnonymousToggle = () => {
    setForm((prev) => {
      const next = { ...prev, isAnonymous: !prev.isAnonymous };
      if (next.isAnonymous) {
        next.fullName = "";
        next.phone = "";
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Partial<Record<keyof FormData, boolean>> = {};
    (Object.keys(form) as (keyof FormData)[]).forEach((k) => {
      allTouched[k] = true;
    });
    setTouched(allTouched);

    const currentErrors = validate(form, t);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    setStatus("submitting");
    try {
      const payload: any = {
        senderName: form.isAnonymous ? "Anonymous" : form.fullName,
        isAnonymous: form.isAnonymous,
        subject: form.subject,
        body: form.description,
        category: form.service,
        priority: "Medium",
      };
      
      const res = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");
      const result = await res.json();
      
      setReferenceId(`WRD05-${result.data.id.split("-")[0].toUpperCase()}`);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">

      {/* Floating Navbar */}
      <div className="w-full px-4 pt-4 sm:pt-6 z-50">
        <header className="mx-auto max-w-7xl rounded-2xl border px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm transition-all bg-background/80 backdrop-blur-xl" style={{ borderColor: "var(--border)" }}>
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary"
            style={{ color: "var(--muted-foreground)" }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline">{t.nav.back}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center shadow-inner"
              style={{ background: "var(--primary)" }}
            >
              <Shield className="h-5 w-5" style={{ color: "var(--primary-foreground)" }} strokeWidth={2} />
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight" style={{ color: "var(--foreground)" }}>
              {t.nav.submitComplaint}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLocale}
              title="Switch language / ቋንቋ ቀይር"
              className="flex items-center rounded-xl border transition-all duration-200 hover:opacity-75 cursor-pointer"
              style={{
                borderColor: "var(--border)",
                background: "var(--muted)",
                padding: "4px 8px",
                gap: "6px",
              }}
            >
              <span
                className="text-[10px] font-bold rounded-md px-1.5 py-0.5 transition-all"
                style={{
                  background: locale === "en" ? "var(--primary)" : "transparent",
                  color: locale === "en" ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                EN
              </span>
              <span
                className="text-[10px] font-bold rounded-md px-1.5 py-0.5 transition-all"
                style={{
                  background: locale === "am" ? "var(--primary)" : "transparent",
                  color: locale === "am" ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                አማ
              </span>
            </button>
            <ThemeToggle />
          </div>
        </header>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start relative">

        {/* Left Column (Sticky on Desktop) */}
        {status !== "success" && (
          <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border mb-4 text-[10px] font-bold tracking-widest uppercase" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", background: "var(--card)" }}>
                <Lock className="h-3 w-3 text-primary" />
                {t.form.badge}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-[1.1] mb-3" style={{ color: "var(--foreground)" }}>
                <span>{t.form.title}</span>
              </h1>
              <p className="text-sm sm:text-base leading-relaxed font-medium opacity-80" style={{ color: "var(--muted-foreground)" }}>
                {t.form.subtitle}
              </p>
            </motion.div>

            {/* Trust Signals - Desktop Only to save space on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hidden lg:flex flex-col gap-6 mt-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                  <EyeOff className="h-6 w-6" style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{t.form.anonymousLabel}</h3>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{t.form.anonymousDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-500/10 dark:bg-blue-500/20">
                  <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{t.features.f2title}</h3>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{t.features.f2desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-green-500/10 dark:bg-green-500/20">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{t.features.f3title}</h3>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{t.features.f3desc}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Right Column / Center Column for Success (Form Card) */}
        <div className={status === "success" ? "col-span-1 lg:col-span-12 flex justify-center w-full" : "lg:col-span-7 w-full"}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`w-full rounded-3xl border shadow-2xl relative overflow-hidden bg-card ${status === "success" ? "max-w-xl" : "max-w-2xl"}`}
            style={{ borderColor: "var(--border)" }}
          >
            {/* Top glowing edge */}
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: "linear-gradient(90deg, transparent, var(--primary), transparent)" }} />

            {status === "success" ? (
              // Success Receipt State
              <div className="p-5 sm:p-10 md:p-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-24 w-24 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 mb-8"
                >
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" strokeWidth={2} />
                </motion.div>

                <h2 className="text-3xl font-black tracking-tight mb-4" style={{ color: "var(--foreground)" }}>
                  <span>{t.form.successTitle}</span>
                </h2>
                <p className="text-base leading-relaxed mb-8 max-w-sm" style={{ color: "var(--muted-foreground)" }}>
                  {t.form.successText}
                </p>

                {/* Receipt Card */}
                <div className="w-full bg-muted/50 rounded-3xl p-6 border relative border-dashed mb-8" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--muted-foreground)" }}>
                    {t.form.refLabel}
                  </p>
                  <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black font-mono tracking-widest text-primary bg-background py-4 px-2 rounded-xl shadow-sm border" style={{ borderColor: "var(--border)" }}>
                    {referenceId}
                  </p>
                  <p className="text-xs mt-4 opacity-80" style={{ color: "var(--muted-foreground)" }}>
                    {t.form.refSubLabel}
                  </p>

                  {/* Cutout details to make it look like a ticket */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border-r border-dashed" style={{ borderColor: "var(--border)" }} />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border-l border-dashed" style={{ borderColor: "var(--border)" }} />
                </div>

                {form.isAnonymous && (
                  <div className="flex items-center gap-3 rounded-2xl p-4 w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 mb-8">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300 text-left leading-snug">
                      {t.form.anonSuccess}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button
                    onClick={() => {
                      setForm(INITIAL_FORM);
                      setTouched({});
                      setErrors({});
                      setStatus("idle");
                    }}
                    className="flex-1 rounded-2xl px-6 py-4 text-sm font-bold border transition-colors hover:bg-muted"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    {t.form.submitAnother}
                  </button>
                  <Link
                    href="/"
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold transition-transform hover:scale-105"
                    style={{ background: "var(--foreground)", color: "var(--background)" }}
                  >
                    {t.form.returnHome}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              // Form State
              <div className="p-4 sm:p-6">
                {/* Anonymous Toggle - Premium Switch Card */}
                <div className="mb-6">
                  <div className="p-3 sm:p-5 rounded-2xl border-2 transition-colors duration-300 bg-muted/20" style={{ borderColor: form.isAnonymous ? "var(--primary)" : "var(--border)" }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${form.isAnonymous ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-background text-muted-foreground border shadow-sm"}`}>
                          {form.isAnonymous ? <EyeOff className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div>
                          <h3 className="text-base font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                            {t.form.anonymousLabel}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                            {t.form.anonymousDesc}
                          </p>
                        </div>
                      </div>

                      {/* The actual toggle switch */}
                      <button
                        type="button"
                        onClick={handleAnonymousToggle}
                        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/20 ${form.isAnonymous ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.isAnonymous ? 'translate-x-6' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>

                    <AnimatePresence>
                      {form.isAnonymous && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-3 bg-primary/10 rounded-xl p-4 border border-primary/20">
                            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                            <p className="text-sm font-bold text-primary">{t.form.anonymousActive}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Personal info section */}
                  <AnimatePresence>
                    {!form.isAnonymous && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-6 pt-2">
                          <div className="flex items-center gap-4">
                            <span className="h-px flex-1 bg-border" />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.form.sectionPersonal}</span>
                            <span className="h-px flex-1 bg-border" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                              id="fullName"
                              name="fullName"
                              label={t.form.fullName}
                              icon={User}
                              type="text"
                              placeholder={t.form.fullNamePlaceholder}
                              value={form.fullName}
                              onChange={handleChange}
                              error={touched.fullName ? errors.fullName : undefined}
                            />
                            <FormField
                              id="phone"
                              name="phone"
                              label={t.form.phone}
                              icon={Phone}
                              type="tel"
                              placeholder={t.form.phonePlaceholder}
                              value={form.phone}
                              onChange={handleChange}
                              error={touched.phone ? errors.phone : undefined}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Complaint details section */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <span className="h-px flex-1 bg-border" />
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.form.sectionDetails}</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    <FormField
                      id="subject"
                      name="subject"
                      label={t.form.subject}
                      icon={FileText}
                      type="text"
                      placeholder={t.form.subjectPlaceholder}
                      value={form.subject}
                      onChange={handleChange}
                      error={touched.subject ? errors.subject : undefined}
                    />

                    <div className="flex flex-col gap-2">
                      <label htmlFor="service" className="text-sm font-bold text-foreground">
                        {t.form.service} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                        <select
                          id="service"
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          required
                          className="w-full appearance-none rounded-lg border-2 pl-12 pr-4 py-2.5 text-base transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-background hover:border-muted-foreground/30"
                          style={{
                            borderColor: touched.service && errors.service ? "#ef4444" : "",
                            color: form.service ? "var(--foreground)" : "var(--muted-foreground)",
                          }}
                        >
                          <option value="" disabled>{t.form.servicePlaceholder}</option>
                          {activeServices.map((s: any) => (
                            <option key={s.id} value={locale === "am" && s.titleAm ? s.titleAm : s.title} className="text-foreground bg-background">
                              {locale === "am" && s.titleAm ? s.titleAm : s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      {touched.service && errors.service && <FieldError message={errors.service} />}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="description" className="text-sm font-bold text-foreground">
                        {t.form.description} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                        <textarea
                          id="description"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={6}
                          placeholder={t.form.descriptionPlaceholder}
                          className="w-full rounded-lg border-2 pl-12 pr-4 py-2.5 text-base resize-none transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-background hover:border-muted-foreground/30"
                          style={{
                            borderColor: touched.description && errors.description ? "#ef4444" : "",
                            color: "var(--foreground)",
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center px-1">
                        {touched.description && errors.description ? (
                          <FieldError message={errors.description} />
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">{t.form.descMin}</span>
                        )}
                        <span className={`text-xs font-bold ${form.description.length >= 30 ? "text-primary" : "text-muted-foreground"}`}>
                          {form.description.length} / 30
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group relative w-full flex items-center justify-center gap-3 rounded-lg py-3.5 text-base font-black transition-all duration-300 disabled:opacity-70 hover:scale-[1.01] active:scale-[0.99] bg-primary text-primary-foreground shadow-xl shadow-primary/25 overflow-hidden"
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {t.form.submitting}
                        </>
                      ) : (
                        <>
                          {t.form.submitBtn}
                          <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-muted-foreground mt-6 font-medium flex items-center justify-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      {t.form.privacy}
                    </p>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// ─── Reusable FormField ──────────────────────────────────────────
function FormField({
  id,
  name,
  label,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string;
  name: string;
  label: string;
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-foreground">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border-2 pl-12 pr-4 py-2.5 text-base transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-background hover:border-muted-foreground/30"
          style={{
            borderColor: error ? "#ef4444" : "",
            color: "var(--foreground)",
          }}
        />
        {error && (
          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-bold text-red-500 px-1">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}
