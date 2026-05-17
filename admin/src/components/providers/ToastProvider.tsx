"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
    iconColor: "rgb(34,197,94)",
    titleColor: "rgb(34,197,94)",
    progressColor: "rgb(34,197,94)",
  },
  error: {
    icon: XCircle,
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.35)",
    iconColor: "rgb(239,68,68)",
    titleColor: "rgb(239,68,68)",
    progressColor: "rgb(239,68,68)",
  },
  warning: {
    icon: AlertTriangle,
    bg: "rgba(234,179,8,0.12)",
    border: "rgba(234,179,8,0.35)",
    iconColor: "rgb(234,179,8)",
    titleColor: "rgb(234,179,8)",
    progressColor: "rgb(234,179,8)",
  },
  info: {
    icon: Info,
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.35)",
    iconColor: "rgb(59,130,246)",
    titleColor: "rgb(59,130,246)",
    progressColor: "rgb(59,130,246)",
  },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;
  const duration = toast.duration ?? 4000;

  React.useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl min-w-[300px] max-w-[380px]"
      style={{
        background: "var(--card)",
        border: `1px solid ${config.border}`,
        boxShadow: `0 8px 32px -8px ${config.border}, 0 4px 16px -4px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Accent left bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: config.iconColor }}
      />

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Icon */}
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: config.bg }}
        >
          <Icon size={18} style={{ color: config.iconColor }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-black leading-none" style={{ color: config.titleColor }}>
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {toast.message}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 rounded-lg transition-all flex-shrink-0 mt-0.5"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        style={{ background: config.progressColor, originX: 0 }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((options: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { ...options, id }]); // max 5 toasts
  }, []);

  const success = useCallback((title: string, message?: string) =>
    addToast({ type: "success", title, message }), [addToast]);

  const error = useCallback((title: string, message?: string) =>
    addToast({ type: "error", title, message, duration: 6000 }), [addToast]);

  const warning = useCallback((title: string, message?: string) =>
    addToast({ type: "warning", title, message }), [addToast]);

  const info = useCallback((title: string, message?: string) =>
    addToast({ type: "info", title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, toast: addToast, success, error, warning, info, dismiss }}>
      {children}

      {/* Toast container */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
