import "server-only";

// Server-to-server calls to the backend. INTERNAL_API_KEY never reaches the browser.
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const internalFetch = (path, options = {}) =>
  fetch(`${baseURL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      "x-internal-key": process.env.INTERNAL_API_KEY || "",
    },
  });

// Called from the Stripe success page, after the Stripe session itself was verified.
export const confirmPurchase = async (payload) => {
  const res = await internalFetch("/api/purchases", { method: "POST", body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  return { ...data, httpStatus: res.status };
};

export const recordSubscription = async (payload) => {
  const res = await internalFetch("/api/subscriptions", { method: "POST", body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Could not record the subscription");
  return data;
};
