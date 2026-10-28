import { recordSubscription } from '@/lib/core/internal'
import { stripe } from '@/lib/stripe'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, ArrowRight, Package } from "lucide-react";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    id: stripeSessionId,
    status,
    payment_status,
    amount_total,
    customer_details,
    metadata
  } = await stripe.checkout.sessions.retrieve(session_id)

  const customerEmail = customer_details?.email;

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    const subsInfo = {
      email: customerEmail,
      planId: metadata?.planId,
      price: (amount_total || 0) / 100, // Stripe amounts are in cents
      stripeSessionId,
      status: payment_status === 'paid' ? 'paid' : (payment_status || 'unknown'),
    }

    let result = null;
    try {
      result = await recordSubscription(subsInfo);
    } catch (error) {
      console.error("Failed to record subscription:", error);
      // Don't block the page — Stripe already charged the customer successfully.
    }

    return (
      <section id="success">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for upgrading your plan. Your new benefits are now active.
            </p>

            {/* Order Details Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-100">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-500">Plan</span>
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {metadata?.planId?.replace('seller_', '') || "—"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Amount Paid</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${subsInfo.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/dashboard/seller"
                className="flex items-center justify-center w-full bg-black hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-full transition-colors"
              >
                <Package className="mr-2 h-5 w-5" />
                Go to Dashboard
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
}