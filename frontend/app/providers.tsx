"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/language-context";

export function ThemeProvider({
  children,
  ...props
}: {
  children: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <NextThemesProvider {...props}>
      <LanguageProvider>{children}</LanguageProvider>
    </NextThemesProvider>
  );
}
