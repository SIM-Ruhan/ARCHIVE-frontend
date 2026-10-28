import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { fetchListing, createCryptoInvoice, loginRedirect, failedRedirect } from "@/lib/core/checkout";

// Crypto payment for a single listing
export async function POST(request) {
  const formData = await request.formData();
  const productId = String(formData.get("productId") || "");

  const user = await getUserSession(); // login is compulsory
  if (!user) return loginRedirect(request, `/browse/${productId}`);

  try {
    const listing = await fetchListing(productId);
    if (!listing) return failedRedirect(request, "This account is no longer available. It may have just been sold.");
    if (listing.authorId === user.id) return failedRedirect(request, "You cannot buy your own listing.");

    const origin = new URL(request.url).origin;
    const { invoiceUrl } = await createCryptoInvoice({
      kind: "listing",
      listingId: productId,
      userId: user.id,
      userEmail: user.email,
      successUrl: `${origin}/pricing/crypto-success`,
      cancelUrl: `${origin}/browse/${productId}`,
    });
    return NextResponse.redirect(invoiceUrl, 303);
  } catch (err) {
    console.error("Crypto checkout failed:", err);
    return failedRedirect(request, err.message);
  }
}
