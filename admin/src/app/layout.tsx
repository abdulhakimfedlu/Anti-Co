import type { Metadata } from "next";
import { Inter, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AdminLanguageProvider } from "@/lib/language-context";
import { ToastProvider } from "@/components/providers/ToastProvider";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Portal | Woreda 05 Anti-Corruption",
  description: "Administrative dashboard for managing corruption reports and services.",
};

/**
 * Root layout — wraps ALL pages (auth + admin) with global providers.
 * The sidebar/header layout is in (admin)/layout.tsx (only for dashboard pages).
 * Auth pages (sign-in, sign-up, forgot-password, unauthorized) are bare.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#f97316",
          colorBackground: "#09090b",
          colorText: "#fafafa",
          colorInputBackground: "#18181b",
          colorInputText: "#fafafa",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${notoEthiopic.variable} font-sans antialiased transition-colors duration-300`}
          suppressHydrationWarning
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AdminLanguageProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AdminLanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
