"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * SSO Callback page — Clerk redirects here after OAuth sign-in/sign-up.
 * AuthenticateWithRedirectCallback handles the token exchange automatically.
 */
export default function SSOCallbackPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--muted)" }}
    >
      <div className="text-center">
        <div
          className="h-12 w-12 rounded-xl mx-auto mb-4 animate-pulse"
          style={{ background: "var(--primary)" }}
        />
        <p className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>
          Completing sign in...
        </p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
