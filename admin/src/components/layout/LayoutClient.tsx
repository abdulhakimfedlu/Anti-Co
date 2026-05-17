"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { Bell, Globe, ChevronDown, Menu } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { motion, AnimatePresence } from "motion/react";
import { useAdminLanguage } from "@/lib/language-context";
import type { Locale } from "@/lib/admin-translations";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/providers/ToastProvider";
import { fetchPublic } from "@/lib/auth";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [adminProfile, setAdminProfile] = React.useState<{ role: string; fullName: string } | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);

  const { t, locale, setLocale } = useAdminLanguage();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { error: toastError } = useToast();

  const toggleLocale = () => setLocale(locale === "en" ? "am" : "en");

  // ── Auth guard: verify user is in the admins table ──────────
  React.useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      router.replace("/unauthorized");
      return;
    }

    // Check if this email is in our admin allowlist
    fetchPublic(`/api/admins/check-email?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.data?.allowed) {
          router.replace("/unauthorized");
        } else {
          setAdminProfile({
            role: data.data.role || "Admin",
            fullName: user.fullName || user.emailAddresses?.[0]?.emailAddress || "Admin",
          });
          setAuthChecked(true);

          // Try to sync clerkId to DB (idempotent — safe to call every time)
          fetchPublic("/api/auth/sync-me", {
            method: "POST",
            body: JSON.stringify({ clerkId: user.id, email }),
          }).catch(() => {}); // Silently fail — webhook may have already done this
        }
      })
      .catch(() => {
        // Backend unreachable — still show the UI to avoid lockout
        setAdminProfile({
          role: "Admin",
          fullName: user.fullName || "Admin",
        });
        setAuthChecked(true);
      });
  }, [isLoaded, user, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  // Display name and avatar initials
  const displayName = adminProfile?.fullName || user?.fullName || "Admin";
  const initials = displayName
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Loading state while checking auth
  if (!isLoaded || !authChecked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--muted)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl animate-pulse"
            style={{ background: "var(--primary)" }}
          />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--muted)", color: "var(--foreground)" }}>
        <Sidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={() => setShowLogoutConfirm(true)}
          adminName={displayName}
          adminRole={adminProfile?.role || "Admin"}
          adminInitials={initials}
        />

        <div className="flex-1 flex flex-col min-w-0 p-2 sm:p-3 lg:p-4 lg:pl-0">
          <main className="flex-1 overflow-y-auto relative flex flex-col custom-scrollbar rounded-[1.5rem] sm:rounded-[2rem] border shadow-sm" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
            {/* Top header */}
            <header
              className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 transition-all duration-300"
              style={{
                background: "color-mix(in srgb, var(--background) 85%, transparent)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  className="lg:hidden rounded-xl p-2 transition-all duration-200"
                  style={{ color: "var(--foreground)" }}
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isMobileOpen ? (
                      <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="17" y1="3" x2="3" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.div key="open" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <rect y="4" width="20" height="1.5" rx="1" fill="currentColor" />
                          <rect y="9.25" width="20" height="1.5" rx="1" fill="currentColor" />
                          <rect y="14.5" width="20" height="1.5" rx="1" fill="currentColor" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Dashboard title — desktop */}
                <div className="hidden lg:flex flex-col">
                  <h1 className="text-sm font-black tracking-tight leading-tight" style={{ color: "var(--foreground)" }}>
                    {t.header.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="flex h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                      {t.header.systemOnline}
                    </span>
                  </div>
                </div>
                <h1 className="text-sm font-black tracking-tight lg:hidden" style={{ color: "var(--foreground)" }}>
                  {locale === "am" ? "አስተዳዳሪ" : "Admin"}
                </h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 pr-3 sm:pr-4" style={{ borderRight: "1px solid var(--border)" }}>
                  {/* Language Switcher */}
                  <button
                    suppressHydrationWarning
                    onClick={toggleLocale}
                    title={t.header.switchLang}
                    className="flex items-center rounded-xl border transition-all duration-200 hover:opacity-75 cursor-pointer"
                    style={{ borderColor: "var(--border)", background: "var(--muted)", padding: "4px 8px", gap: "5px" }}
                  >
                    <span
                      className="text-[11px] font-semibold rounded-md px-1.5 py-0.5 transition-all"
                      style={{ background: locale === "en" ? "var(--primary)" : "transparent", color: locale === "en" ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
                    >EN</span>
                    <span
                      className="text-[11px] font-semibold rounded-md px-1.5 py-0.5 transition-all"
                      style={{ fontFamily: "serif", background: locale === "am" ? "var(--primary)" : "transparent", color: locale === "am" ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
                    >አማ</span>
                  </button>

                  <ThemeToggle />
                  <button
                    suppressHydrationWarning
                    className="p-2 rounded-lg transition-all"
                    style={{ color: "var(--muted-foreground)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; e.currentTarget.style.color = "var(--foreground)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                  >
                    <Bell size={14} />
                  </button>
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="hidden sm:flex flex-col text-right">
                    <div
                      className="text-[10px] font-black leading-none flex items-center justify-end gap-1 transition-colors group-hover:opacity-70"
                      style={{ color: "var(--foreground)" }}
                    >
                      {displayName} <ChevronDown size={10} className="mt-0.5" />
                    </div>
                    <div
                      className="text-[8px] font-bold uppercase tracking-wider mt-1"
                      style={{ color: adminProfile?.role === "Super Admin" ? "var(--primary)" : "var(--muted-foreground)" }}
                    >
                      {adminProfile?.role || "Admin"}
                    </div>
                  </div>
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center border shadow-sm transition-shadow group-hover:shadow-md"
                    style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)", borderColor: "color-mix(in srgb, var(--primary) 25%, transparent)" }}
                  >
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center font-black text-[10px]"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      {initials}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 p-4 pt-6 sm:p-5 sm:pt-8 lg:p-6 lg:pt-10 w-full max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of the admin portal?"
        confirmLabel="Sign Out"
        cancelLabel="Stay"
        variant="warning"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
