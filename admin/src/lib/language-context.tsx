"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { adminTranslations, Locale, AdminTranslations } from "./admin-translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: AdminTranslations;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "am",
  setLocale: () => {},
  t: adminTranslations.am,
});

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with "am" so server and first client render match (no hydration mismatch)
  const [locale, setLocaleState] = useState<Locale>("am");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("admin-locale") as Locale | null;
      if (saved === "en" || saved === "am") {
        setLocaleState(saved);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("admin-locale", newLocale);
    } catch {
      // localStorage not available
    }
  };

  // Always use "am" translations on the server / before mount to avoid mismatch
  const t = mounted ? adminTranslations[locale] : adminTranslations.am;

  return (
    <LanguageContext.Provider value={{ locale: mounted ? locale : "am", setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  return useContext(LanguageContext);
}
