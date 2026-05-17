"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ShieldX, LogOut, ArrowRight } from "lucide-react";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--muted)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239,68,68,0.2), transparent)" }} />

      <div className="relative z-10 w-full max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-10 shadow-2xl"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 24px 64px -12px rgba(0,0,0,0.25)",
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <ShieldX size={40} style={{ color: "rgb(239,68,68)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-black mb-2"
            style={{ color: "var(--foreground)" }}
          >
            Access Denied
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--muted-foreground)" }}
          >
            Your account is not authorized to access the admin portal. Only pre-approved
            administrators can sign in. Please contact the{" "}
            <span className="font-bold" style={{ color: "var(--foreground)" }}>Super Admin</span>{" "}
            to request access.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm transition-all"
              style={{
                background: "rgb(239,68,68)",
                color: "#fff",
                boxShadow: "0 4px 20px -4px rgba(239,68,68,0.5)",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
            <a
              href={`mailto:fedluabdulhakim7@gmail.com?subject=Admin Access Request`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--muted-foreground)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              Contact Super Admin
              <ArrowRight size={14} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
