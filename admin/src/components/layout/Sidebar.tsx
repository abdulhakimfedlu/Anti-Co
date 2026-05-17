"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Layers,
  UserPlus,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdminLanguage } from "@/lib/language-context";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
  adminName?: string;
  adminRole?: string;
  adminInitials?: string;
}

export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  adminName = "Admin",
  adminRole = "Admin",
  adminInitials = "AD",
}: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const { t } = useAdminLanguage();

  const menuItems = [
    { name: t.nav.dashboard, href: "/", icon: LayoutDashboard },
    { name: t.nav.messages, href: "/messages", icon: MessageSquare },
    { name: t.nav.services, href: "/services", icon: Layers },
    { name: t.nav.addAdmin, href: "/add-admin", icon: UserPlus },
  ];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isSuperAdmin = adminRole === "Super Admin";

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 250 : 72,
          x: mounted && typeof window !== "undefined" && window.innerWidth < 1024
            ? isMobileOpen ? 0 : -280
            : 0
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:relative inset-y-0 left-0 z-50 flex flex-col h-full"
        style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
        suppressHydrationWarning
      >
        {/* Brand + collapse toggle */}
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: "var(--primary)", boxShadow: "0 4px 14px -4px var(--primary)" }}
            >
              <Shield className="text-white" size={20} />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="truncate"
                >
                  <div className="text-[13px] font-black leading-none mb-0.5" style={{ color: "var(--foreground)" }}>
                    {t.nav.brandName}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                    {t.nav.portalLabel}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex h-7 w-7 rounded-lg items-center justify-center transition-all flex-shrink-0"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; e.currentTarget.style.color = "var(--foreground)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div key="collapse" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.12 }}>
                  <ChevronLeft size={16} />
                </motion.div>
              ) : (
                <motion.div key="expand" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.12 }}>
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden flex h-7 w-7 rounded-lg items-center justify-center transition-all flex-shrink-0"
            style={{ color: "var(--muted-foreground)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`sidebar-link relative group py-2.5 px-3 ${isActive ? "active" : ""}`}
                title={!isOpen ? item.name : undefined}
              >
                <div className="relative z-10 flex items-center gap-3 w-full">
                  <item.icon
                    size={20}
                    className="flex-shrink-0 transition-colors"
                    style={{ color: isActive ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
                  />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="font-bold text-[13px] tracking-tight overflow-hidden whitespace-nowrap"
                        style={{ color: isActive ? "var(--primary-foreground)" : "var(--foreground)" }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "var(--primary)", boxShadow: "0 4px 14px -4px var(--primary)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: "var(--border)" }} />

        {/* User info + Logout */}
        <div className="p-3 space-y-2">
          {/* Admin info pill */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{ background: "var(--muted)" }}
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-[10px] flex-shrink-0"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    {adminInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black truncate" style={{ color: "var(--foreground)" }}>
                      {adminName}
                    </p>
                    <div className="flex items-center gap-1">
                      {isSuperAdmin && <Crown size={9} style={{ color: "var(--primary)" }} />}
                      <p className="text-[9px] font-bold uppercase tracking-wider truncate" style={{ color: isSuperAdmin ? "var(--primary)" : "var(--muted-foreground)" }}>
                        {adminRole}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout */}
          <button
            suppressHydrationWarning
            onClick={onLogout}
            className="sidebar-link w-full group py-2 px-3 transition-all"
            style={{ color: "rgb(239 68 68)" }}
            title={!isOpen ? t.nav.logout : undefined}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={18} className="flex-shrink-0 transition-colors" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-bold text-[11px] uppercase tracking-widest overflow-hidden whitespace-nowrap"
                >
                  {t.nav.logout}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
