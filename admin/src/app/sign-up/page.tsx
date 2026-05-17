"use client";

import React, { useState, Suspense } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { fetchPublic } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
    </svg>
  );
}

type Step = "email-check" | "details" | "verify";

function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { success, error, info } = useToast();

  const [step, setStep] = useState<Step>("email-check");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  /** Step 1: Check if email is on the allowlist */
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    try {
      const res = await fetchPublic(`/api/admins/check-email?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!data.data?.allowed) {
        setFormError("This email is not authorized to create an admin account. Please contact the Super Admin.");
        error("Access Denied", "This email is not on the admin allowlist.");
        return;
      }
      info("Email Verified", "Your email is authorized. Please complete your profile.");
      setStep("details");
    } catch {
      setFormError("Unable to verify email. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Step 2: Create account + trigger email verification */
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    setFormError("");
    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: fullName.trim().split(" ")[0] || fullName,
        lastName: fullName.trim().split(" ").slice(1).join(" ") || "",
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      info("Verification Sent", `A verification code was sent to ${email}`);
      setStep("verify");
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "Failed to create account. Please try again.";
      setFormError(msg);
      error("Sign Up Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  /** Step 3: Verify code and complete sign up */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setFormError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode.trim() });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        success("Account Created!", "Welcome to the admin portal.");
        // Sync the clerkId to our DB (in case webhook isn't set up)
        try {
          const { useAuth } = await import("@clerk/nextjs");
          // We'll handle sync in LayoutClient instead
        } catch { }
        router.push("/");
      } else {
        setFormError("Verification could not be completed. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "Invalid verification code.";
      setFormError(msg);
      error("Verification Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return;
    setOauthLoading(provider);
    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "OAuth sign up failed.";
      error("OAuth Failed", msg);
      setOauthLoading(null);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      info("Code Resent", `A new verification code was sent to ${email}`);
    } catch {
      error("Failed to Resend", "Please try again.");
    }
  };

  const stepLabels = ["Email", "Profile", "Verify"];
  const stepIndex = step === "email-check" ? 0 : step === "details" ? 1 : 2;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8"
      >
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            boxShadow: "0 8px 32px -8px rgba(249,115,22,0.6)",
          }}
        >
          <Shield className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--foreground)" }}>
          Create Account
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: "var(--primary)" }}>
          Woreda 05 Admin Portal
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
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
              <div
                className="h-px w-12 mb-4 transition-all duration-500"
                style={{ background: i < stepIndex ? "var(--primary)" : "var(--border)" }}
              />
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-8 shadow-2xl"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 64px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Error Banner */}
        <AnimatePresence>
          {formError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div
                className="flex items-start gap-2.5 p-3.5 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                <AlertCircle size={15} style={{ color: "rgb(239,68,68)", flexShrink: 0, marginTop: 2 }} />
                <p className="text-sm leading-snug" style={{ color: "rgb(239,68,68)" }}>{formError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Email Check ── */}
          {step === "email-check" && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-black mb-1" style={{ color: "var(--foreground)" }}>Verify Your Email</h2>
              <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>
                Only pre-approved emails can create admin accounts.
              </p>

              {/* OAuth first for step 1 */}
              <div className="flex flex-col gap-2 mb-5">
                <button
                  onClick={() => handleOAuth("oauth_google")}
                  disabled={!!oauthLoading}
                  className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--muted-foreground)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  {oauthLoading === "oauth_google" ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
                  Sign up with Google
                </button>
                <button
                  onClick={() => handleOAuth("oauth_apple")}
                  disabled={!!oauthLoading}
                  className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--muted-foreground)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  {oauthLoading === "oauth_apple" ? <Loader2 size={18} className="animate-spin" /> : <AppleIcon />}
                  Sign up with Apple
                </button>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              <form onSubmit={handleEmailCheck} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                    <Mail size={13} style={{ color: "var(--muted-foreground)" }} /> Email Address
                  </label>
                  <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setFormError(""); }}
                    placeholder="your@email.com" required autoComplete="email"
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
                  {isLoading ? <><Loader2 size={16} className="animate-spin" /> Checking...</> : <>Check Email <ArrowRight size={16} /></>}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ── Step 2: Details ── */}
          {step === "details" && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-black mb-1" style={{ color: "var(--foreground)" }}>Complete Profile</h2>
              <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>
                Creating account for <span className="font-bold" style={{ color: "var(--primary)" }}>{email}</span>
              </p>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                    <User size={13} style={{ color: "var(--muted-foreground)" }} /> Full Name
                  </label>
                  <input
                    type="text" value={fullName}
                    onChange={e => { setFullName(e.target.value); setFormError(""); }}
                    placeholder="John Doe" required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "var(--muted)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                    <Lock size={13} style={{ color: "var(--muted-foreground)" }} /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"} value={password}
                      onChange={e => { setPassword(e.target.value); setFormError(""); }}
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
                        border: `1.5px solid ${confirmPassword && confirmPassword !== password ? "rgb(239,68,68)" : "var(--border)"}`,
                        color: "var(--foreground)"
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = confirmPassword !== password ? "rgb(239,68,68)" : "var(--primary)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== password ? "rgb(239,68,68)" : "var(--border)"; }}
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
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 mt-2"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 20px -4px rgba(249,115,22,0.5)" }}
                >
                  {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <>Create Account <ArrowRight size={16} /></>}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* ── Step 3: Verify ── */}
          {step === "verify" && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(249,115,22,0.12)" }}
              >
                <KeyRound size={24} style={{ color: "var(--primary)" }} />
              </div>
              <h2 className="text-lg font-black mb-1" style={{ color: "var(--foreground)" }}>Verify Your Email</h2>
              <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>
                We sent a 6-digit code to{" "}
                <span className="font-bold" style={{ color: "var(--foreground)" }}>{email}</span>.
                Enter it below to complete signup.
              </p>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    Verification Code
                  </label>
                  <input
                    type="text" value={verificationCode}
                    onChange={e => { setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setFormError(""); }}
                    placeholder="000000" required maxLength={6}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all text-center tracking-[0.5em] font-black text-lg"
                    style={{ background: "var(--muted)", border: "1.5px solid var(--border)", color: "var(--foreground)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  />
                </div>
                <motion.button
                  type="submit" disabled={isLoading || verificationCode.length !== 6} whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                  style={{
                    background: verificationCode.length === 6 ? "var(--primary)" : "var(--muted)",
                    color: verificationCode.length === 6 ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    boxShadow: verificationCode.length === 6 ? "0 4px 20px -4px rgba(249,115,22,0.5)" : "none",
                  }}
                >
                  {isLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : <>Verify & Complete <CheckCircle2 size={16} /></>}
                </motion.button>
              </form>
              <button
                onClick={resendCode}
                className="mt-4 w-full text-center text-xs font-bold transition-opacity"
                style={{ color: "var(--primary)" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                Didn't receive it? Resend code
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clerk CAPTCHA placeholder */}
        <div id="clerk-captcha" className="mt-4" />

        {/* Sign in link */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-black" style={{ color: "var(--primary)" }}>
            Sign In
          </Link>
        </p>
      </motion.div>

      <p className="text-center text-[10px] mt-6 font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
        Authorized Personnel Only
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--muted)" }}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.15), transparent)" }} />
      <div className="absolute top-1/4 -left-32 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ background: "var(--primary)" }} />
      <div className="absolute bottom-1/4 -right-32 h-64 w-64 rounded-full opacity-10 blur-3xl" style={{ background: "var(--primary)" }} />
      <div className="relative z-10 w-full">
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
