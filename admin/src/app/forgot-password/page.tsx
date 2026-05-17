"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Loader2,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

type Step = "email" | "code" | "new-password" | "done";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { success, error, info } = useToast();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const stepIndex = { email: 0, code: 1, "new-password": 2, done: 3 }[step];

  /** Step 1: Request password reset code */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setFormError("");
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email.trim(),
      });
      info("Code Sent", `A reset code has been sent to ${email}`);
      setStep("code");
    } catch (err: any) {
      const clerkErr = err?.errors?.[0];
      // Clerk error codes for unknown email
      if (
        clerkErr?.code === "form_identifier_not_found" ||
        clerkErr?.code === "session_exists" ||
        clerkErr?.message?.toLowerCase().includes("not found") ||
        clerkErr?.message?.toLowerCase().includes("no user")
      ) {
        setFormError("No admin account is registered with this email address.");
        error("Email Not Found", "No account found with this email.");
      } else {
        const msg = clerkErr?.message || "Failed to send reset code. Please try again.";
        setFormError(msg);
        error("Request Failed", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** Step 2: Verify the reset code */
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setFormError("");
    try {
      // Attempt to verify code by checking it's valid (we'll use it in next step with new password)
      // Clerk's reset flow: verify code first in attemptFirstFactor
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
      });
      // If we get here without error, code is valid. Check status.
      if (result.status === "needs_new_password") {
        success("Code Verified", "Please enter your new password.");
        setStep("new-password");
      } else {
        setFormError("Unexpected response. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "Invalid or expired code. Please try again.";
      setFormError(msg);
      error("Verification Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  /** Step 3: Set new password */
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    setFormError("");
    try {
      const result = await signIn.resetPassword({ password: newPassword });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        success("Password Reset!", "Your password has been changed successfully.");
        setStep("done");
      } else {
        setFormError("Could not complete reset. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "Failed to reset password.";
      setFormError(msg);
      error("Reset Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const stepLabels = ["Email", "Verify", "Password"];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--muted)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.15), transparent)" }} />
      <div className="absolute top-1/4 -left-32 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ background: "var(--primary)" }} />
      <div className="absolute bottom-1/4 -right-32 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ background: "var(--primary)" }} />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", boxShadow: "0 8px 32px -8px rgba(249,115,22,0.6)" }}
          >
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--foreground)" }}>
            Reset Password
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: "var(--primary)" }}>
            Admin Portal
          </p>
        </motion.div>

        {/* Progress Steps */}
        {step !== "done" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-6">
            {stepLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300"
                    style={{
                      background: i <= stepIndex ? "var(--primary)" : "var(--muted)",
                      color: i <= stepIndex ? "var(--primary-foreground)" : "var(--muted-foreground)",
                      boxShadow: i === stepIndex ? "0 4px 12px -4px rgba(249,115,22,0.6)" : "none",
                    }}
                  >
                    {i < stepIndex ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: i === stepIndex ? "var(--primary)" : "var(--muted-foreground)" }}>
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className="h-px w-12 mb-4 transition-all duration-500" style={{ background: i < stepIndex ? "var(--primary)" : "var(--border)" }} />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-8 shadow-2xl"
          style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 24px 64px -12px rgba(0,0,0,0.25)" }}
        >
          {/* Error Banner */}
          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                  <AlertCircle size={15} style={{ color: "rgb(239,68,68)", flexShrink: 0, marginTop: 2 }} />
                  <p className="text-sm leading-snug" style={{ color: "rgb(239,68,68)" }}>{formError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ── Step 1: Email ── */}
            {step === "email" && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(249,115,22,0.12)" }}>
                  <Mail size={24} style={{ color: "var(--primary)" }} />
                </div>
                <h2 className="text-lg font-black mb-1" style={{ color: "var(--foreground)" }}>Forgot Password?</h2>
                <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>
                  Enter your admin email and we'll send you a reset code.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                      <Mail size={13} style={{ color: "var(--muted-foreground)" }} /> Email Address
                    </label>
                    <input
                      type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setFormError(""); }}
                      placeholder="admin@example.com" required autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background: "var(--muted)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
                      onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                    />
                  </div>
                  <motion.button
                    type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 20px -4px rgba(249,115,22,0.5)" }}
                  >
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Send Reset Code <ArrowRight size={16} /></>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Code Verification ── */}
            {step === "code" && (
              <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(249,115,22,0.12)" }}>
                  <KeyRound size={24} style={{ color: "var(--primary)" }} />
                </div>
                <h2 className="text-lg font-black mb-1" style={{ color: "var(--foreground)" }}>Enter Reset Code</h2>
                <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>
                  Check your inbox at <span className="font-bold" style={{ color: "var(--foreground)" }}>{email}</span> for the 6-digit code.
                </p>
                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Verification Code</label>
                    <input
                      type="text" value={code}
                      onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setFormError(""); }}
                      placeholder="000000" required maxLength={6}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all text-center tracking-[0.5em] font-black text-lg"
                      style={{ background: "var(--muted)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
                      onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button" onClick={() => { setStep("email"); setFormError(""); }}
                      className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                      style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <motion.button
                      type="submit" disabled={isLoading || code.length !== 6} whileTap={{ scale: 0.98 }}
                      className="flex-[2] py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                      style={{
                        background: code.length === 6 ? "var(--primary)" : "var(--muted)",
                        color: code.length === 6 ? "var(--primary-foreground)" : "var(--muted-foreground)",
                        boxShadow: code.length === 6 ? "0 4px 20px -4px rgba(249,115,22,0.5)" : "none",
                      }}
                    >
                      {isLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <>Verify Code <ArrowRight size={16} /></>}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: New Password ── */}
            {step === "new-password" && (
              <motion.div key="new-password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(249,115,22,0.12)" }}>
                  <Lock size={24} style={{ color: "var(--primary)" }} />
                </div>
                <h2 className="text-lg font-black mb-1" style={{ color: "var(--foreground)" }}>Create New Password</h2>
                <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>Choose a strong password for your admin account.</p>
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                      <Lock size={13} style={{ color: "var(--muted-foreground)" }} /> New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"} value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setFormError(""); }}
                        placeholder="Min. 8 characters" required autoComplete="new-password"
                        className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                        style={{ background: "var(--muted)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
                        onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg"
                        style={{ color: "var(--muted-foreground)" }}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                      <Lock size={13} style={{ color: "var(--muted-foreground)" }} /> Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"} value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setFormError(""); }}
                        placeholder="Re-enter password" required autoComplete="new-password"
                        className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "var(--muted)",
                          border: `1.5px solid ${confirmPassword && confirmPassword !== newPassword ? "rgb(239,68,68)" : "var(--border)"}`,
                          color: "var(--foreground)"
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = confirmPassword !== newPassword ? "rgb(239,68,68)" : "var(--primary)"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== newPassword ? "rgb(239,68,68)" : "var(--border)"; }}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg"
                        style={{ color: "var(--muted-foreground)" }}>
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <motion.button
                    type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 20px -4px rgba(249,115,22,0.5)" }}
                  >
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : <>Reset Password <CheckCircle2 size={16} /></>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── Done ── */}
            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(34,197,94,0.12)" }}
                >
                  <CheckCircle2 size={32} style={{ color: "rgb(34,197,94)" }} />
                </div>
                <h2 className="text-xl font-black mb-2" style={{ color: "var(--foreground)" }}>Password Reset!</h2>
                <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
                  Your password has been changed. You are now signed in.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 20px -4px rgba(249,115,22,0.5)" }}
                >
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== "done" && (
            <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
              Remember your password?{" "}
              <Link href="/sign-in" className="font-black" style={{ color: "var(--primary)" }}>Sign In</Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
