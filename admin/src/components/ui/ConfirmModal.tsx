"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional: renders extra content inside modal (e.g., password input) */
  children?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  const variantConfig = {
    danger: {
      iconBg: "rgba(239,68,68,0.12)",
      iconColor: "rgb(239,68,68)",
      confirmBg: "rgb(239,68,68)",
      confirmHoverBg: "rgb(220,38,38)",
      confirmText: "#fff",
    },
    warning: {
      iconBg: "rgba(234,179,8,0.12)",
      iconColor: "rgb(234,179,8)",
      confirmBg: "rgb(234,179,8)",
      confirmHoverBg: "rgb(202,138,4)",
      confirmText: "#000",
    },
    primary: {
      iconBg: "color-mix(in srgb, var(--primary) 12%, transparent)",
      iconColor: "var(--primary)",
      confirmBg: "var(--primary)",
      confirmHoverBg: "var(--accent)",
      confirmText: "var(--primary-foreground)",
    },
  };
  const cfg = variantConfig[variant];

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed inset-0 z-[9991] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="w-full max-w-md rounded-2xl shadow-2xl p-6 relative"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 24px 64px -12px rgba(0,0,0,0.4)",
              }}
            >
              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-all"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: cfg.iconBg }}
              >
                <AlertTriangle size={24} style={{ color: cfg.iconColor }} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-black mb-2" style={{ color: "var(--foreground)" }}>
                {title}
              </h3>

              {/* Message */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                {message}
              </p>

              {/* Optional extra content (e.g., password input) */}
              {children && <div className="mb-4">{children}</div>}

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: "var(--muted)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.75"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-5 py-2.5 rounded-xl text-sm font-black transition-all"
                  style={{
                    background: cfg.confirmBg,
                    color: cfg.confirmText,
                    boxShadow: `0 4px 14px -4px ${cfg.confirmBg}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = cfg.confirmHoverBg;
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = cfg.confirmBg;
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
