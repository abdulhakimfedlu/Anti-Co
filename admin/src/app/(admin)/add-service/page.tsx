"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /add-service now redirects to /services where creation is managed inline
export default function AddServiceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/services");
  }, [router]);
  return null;
}
