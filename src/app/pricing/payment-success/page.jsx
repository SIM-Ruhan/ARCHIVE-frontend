import { stripe } from '@/lib/stripe'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, XCircle, ArrowRight, Package } from "lucide-react";
import { confirmPurchase } from '@/lib/core/internal';
import { getUserSession } from '@/lib/core/session';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    id: stripeSessionId,
    status,
    payment_status,
    customer_details: { email: customerEmail },
    metadata
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete' && payment_status === 'paid') {
    let purchase = null;
    let soldOut = false;
    let recordFailed = false;
    const sessionUser = await getUserSession();
    const ordersHref =
      sessionUser?.role === 'seller' ? '/dashboard/seller/Purchased' : sessionUser?.role === 'user' ? '/dashboard/user/orders' : '/browse';

    try {
      const confirmResult = await confirmPurchase({
        sessionId: stripeSessionId,
        listingId: metadata?.productId,
        userId: metadata?.userId,
        userEmail: customerEmail || metadata?.userEmail,
        price: metadata?.price,
        title: metadata?.title,
      });
      purchase = confirmResult?.purchase || null;
      soldOut = confirmResult?.code === 'ALREADY_SOLD';
      recordFailed = !soldOut && !confirmResult?.success;
    } catch (error) {
      console.error("Failed to confirm purchase:", error);
      recordFailed = true;
      // Don't block the success page on this — payment already succeeded on Stripe's side.
      // Worth adding monitoring/alerting here since this means a paid purchase didn't get recorded.
    }

    return (
      <section id="success">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center">
            {/* Success Icon */}
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${soldOut ? 'bg-amber-100' : 'bg-green-100'}`}>
              {soldOut ? <XCircle className="h-10 w-10 text-amber-600" /> : <CheckCircle2 className="h-10 w-10 text-green-600" />}
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {soldOut ? 'Someone else got it first' : 'Payment Successful!'}
            </h1>
            <p className="text-gray-600 mb-8">
              {soldOut
                ? 'This account was bought by another person a moment before your payment cleared. Your payment will be refunded. If it does not arrive, contact support with your payment reference.'
                : recordFailed
                ? `We received your payment but could not record the order automatically. Please contact support with this reference: ${stripeSessionId}`
                : 'Thank you. Your purchase is recorded. Open My orders to see the account access details.'}
            </p>

            {/* Order Details Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-100">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-500">Listing</span>
                <span className="text-sm font-semibold text-gray-900">
                  {purchase?.title || metadata?.title || "—"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Amount Paid</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${purchase?.price ?? metadata?.price ?? "—"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href={soldOut || recordFailed ? '/browse' : ordersHref}
                className="flex items-center justify-center w-full bg-black hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-full transition-colors"
              >
                <Package className="mr-2 h-5 w-5" />
                {soldOut || recordFailed ? 'Browse more listings' : 'View my order & access details'}
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Return to Homepage
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Not paid (yet): never record a purchase
  return redirect('/')
}
