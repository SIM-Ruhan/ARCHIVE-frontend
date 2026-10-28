"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-checks the order every few seconds while the blockchain confirms the payment.
export default function AutoRefresh({ seconds = 8 }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds]);
  return null;
}
