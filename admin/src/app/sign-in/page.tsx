"use client";

import React, { useState, Suspense } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

// Google SVG icon
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Apple SVG icon
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
    </svg>
  );
}

function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const redirectUrl = searchParams.get("redirect_url") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setFormError("");

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        success("Welcome back!", "Redirecting to dashboard...");
        router.push(redirectUrl);
      } else {
        setFormError("Sign in could not be completed. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || "Invalid email or password.";
      setFormError(msg);
      error("Sign In Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return;
    setOauthLoading(provider);
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectUrl,
      });
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || `${provider} sign in failed.`;
      error("OAuth Failed", msg);
      setOauthLoading(null);
    }
  };

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
          Admin Portal
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: "var(--primary)" }}>
          Woreda 05 Anti-Corruption
        </p>
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
        <div className="mb-6">
          <h2 className="text-xl font-black" style={{ color: "var(--foreground)" }}>
            Sign In
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => handleOAuth("oauth_google")}
            disabled={!!oauthLoading || isLoading}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              opacity: oauthLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!oauthLoading) e.currentTarget.style.borderColor = "var(--muted-foreground)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {oauthLoading === "oauth_google" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuth("oauth_apple")}
            disabled={!!oauthLoading || isLoading}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              opacity: oauthLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!oauthLoading) e.currentTarget.style.borderColor = "var(--muted-foreground)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {oauthLoading === "oauth_apple" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <AppleIcon />
            )}
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
            or
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

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
                className="flex items-center gap-2.5 p-3.5 rounded-xl"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                <AlertCircle size={15} style={{ color: "rgb(239,68,68)", flexShrink: 0 }} />
                <p className="text-sm" style={{ color: "rgb(239,68,68)" }}>{formError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <Mail size={13} style={{ color: "var(--muted-foreground)" }} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setFormError(""); }}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "var(--muted)",
                border: "1.5px solid var(--border)",
                color: "var(--foreground)",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <Lock size={13} style={{ color: "var(--muted-foreground)" }} />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setFormError(""); }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--muted)",
                  border: "1.5px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--foreground)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--muted-foreground)"; }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Forgot Password link */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-bold transition-colors"
              style={{ color: "var(--primary)" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.75"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading || !!oauthLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 mt-2"
            style={{
              background: isLoading ? "var(--muted)" : "var(--primary)",
              color: isLoading ? "var(--muted-foreground)" : "var(--primary-foreground)",
              boxShadow: isLoading ? "none" : "0 4px 20px -4px rgba(249,115,22,0.6)",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-black transition-colors"
            style={{ color: "var(--primary)" }}
          >
            Sign Up
          </Link>
        </p>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-[10px] mt-6 font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
        Secure · Encrypted · Protected
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--muted)" }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.15), transparent)",
        }}
      />
      <div
        className="absolute top-1/4 -left-32 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--primary)" }}
      />
      <div
        className="absolute bottom-1/4 -right-32 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--primary)" }}
      />

      <div className="relative z-10 w-full">
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
