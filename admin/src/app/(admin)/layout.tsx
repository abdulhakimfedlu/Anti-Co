import LayoutClient from "@/components/layout/LayoutClient";
import React from "react";

/**
 * Admin (protected) layout — adds sidebar + top header.
 * Only applies to dashboard pages inside the (admin) route group.
 * Auth pages (sign-in, sign-up, etc.) use the root layout only.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutClient>
      {children}
    </LayoutClient>
  );
}
