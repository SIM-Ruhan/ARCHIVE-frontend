import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";
import { fetchListing, loginRedirect, failedRedirect } from "@/lib/core/checkout";


// Card payment (Stripe) for a single listing
export async function POST(request) {
  const formData = await request.formData();
  const productId = String(formData.get("productId") || "");

  // 1. Login is compulsory
  const user = await getUserSession();
  if (!user) return loginRedirect(request, `/browse/${productId}`);

  try {
    // 2. Price comes from the database, not the form
    const listing = await fetchListing(productId);
    if (!listing) return failedRedirect(request, "This account is no longer available. It may have just been sold.");
    if (listing.authorId === user.id) return failedRedirect(request, "You cannot buy your own listing.");

    const origin = new URL(request.url).origin;
    const price = Number(listing.price);

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price * 100),
            product_data: { name: listing.title || "ARCHIVE listing" },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/pricing/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/browse/${productId}`,
      metadata: {
        price,
        userId: user.id,
        userEmail: user.email,
        title: listing.title,
        productId,
      },
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    return failedRedirect(request, err.message || "Card payment could not be started.");
  }
}
