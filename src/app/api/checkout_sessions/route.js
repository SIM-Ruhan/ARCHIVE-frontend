import { NextResponse } from "next/server";
import { PLAN_PRICE_ID, stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";
import { loginRedirect, failedRedirect } from "@/lib/core/checkout";

// Seller plan subscription (Stripe)
export async function POST(request) {
  const user = await getUserSession();
  if (!user) return loginRedirect(request, "/pricing");

  try {
    const formData = await request.formData();
    const planId = formData.get("plan_id");
    const priceId = PLAN_PRICE_ID[planId];
    if (!priceId) return failedRedirect(request, "Unknown plan.");

    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: { planId },
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe plan checkout failed:", err);
    return failedRedirect(request, err.message || "Card payment could not be started.");
  }
}
