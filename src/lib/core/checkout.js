import "server-only";
import { NextResponse } from "next/server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Redirect that works behind any host (uses the request's own origin)
export const redirectTo = (request, path) => NextResponse.redirect(new URL(path, request.url), 303);

// Login is compulsory before any payment.
export const loginRedirect = (request, backTo) =>
  redirectTo(request, `/login?redirect=${encodeURIComponent(backTo)}`);

export const failedRedirect = (request, message) =>
  redirectTo(request, `/pricing/payment-failed?message=${encodeURIComponent(message)}`);

// Price and title always come from our database, never from the browser form.
export const fetchListing = async (listingId) => {
  try {
    const res = await fetch(`${baseURL}/api/listings/${listingId}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const createCryptoInvoice = async (payload) => {
  const res = await fetch(`${baseURL}/api/crypto/invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.invoiceUrl) {
    throw new Error(data.message || "Could not start the crypto payment.");
  }
  return data;
};
