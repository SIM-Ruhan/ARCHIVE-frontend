import Link from "next/link";
import { CheckCircle2, Clock, ArrowRight, XCircle } from "lucide-react";
import AutoRefresh from "./AutoRefresh";
import { getUserSession } from "@/lib/core/session";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const FAILED = ["failed", "expired", "refunded"];

export default async function CryptoSuccess({ searchParams }) {
  const { order: orderId } = await searchParams;

  let order = null;
  if (orderId) {
    try {
      const res = await fetch(`${baseURL}/api/crypto/orders/${orderId}`, { cache: "no-store" });
      if (res.ok) order = (await res.json()).order;
    } catch (e) {
      console.error("Could not load crypto order", e);
    }
  }

  const sessionUser = await getUserSession();
  const ordersHref = sessionUser?.role === "seller" ? "/dashboard/seller/Purchased" : "/dashboard/user/orders";
  const refundRequired = !!order?.refundRequired;
  const paid = order?.status === "finished" && !refundRequired;
  const failed = (order && FAILED.includes(order.status)) || refundRequired;
  const Icon = paid ? CheckCircle2 : failed ? XCircle : Clock;

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      {!paid && !failed && <AutoRefresh />}
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 text-center">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
            paid ? "bg-green-100" : failed ? "bg-red-50" : "bg-neutral-100"
          }`}
        >
          <Icon className={`h-9 w-9 ${paid ? "text-green-600" : failed ? "text-red-600" : "text-neutral-700"}`} />
        </div>

        <h1 className="text-2xl font-bold">
          {paid ? "Crypto payment received" : refundRequired ? "Someone else got it first" : failed ? "Payment was not completed" : "Waiting for confirmation"}
        </h1>
        <p className="mt-2 text-neutral-600">
          {paid
            ? "Thank you. Your payment is confirmed. Open My orders to see the account access details."
            : refundRequired
            ? "This account was bought by another person a moment before your payment cleared. Your payment will be refunded. Contact support with your order ID if it doesn't arrive."
            : failed
            ? `The payment status is "${order.status}". If you sent funds, contact support with your order ID.`
            : "We are waiting for the network to confirm your payment. This page updates by itself. It can take a few minutes."}
        </p>

        {order && (
          <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-left">
            <div className="flex justify-between border-b border-neutral-200 py-2">
              <span className="text-sm text-neutral-500">Item</span>
              <span className="text-sm font-semibold">{order.title}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 py-2">
              <span className="text-sm text-neutral-500">Amount</span>
              <span className="text-sm font-semibold">${Number(order.price).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-neutral-500">Order ID</span>
              <span className="font-mono text-xs">{order.orderId}</span>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link
            href={order?.kind === "plan" ? "/dashboard/seller" : paid ? ordersHref : "/browse"}
            className="flex w-full items-center justify-center rounded-full bg-black px-4 py-3 font-semibold text-white hover:bg-neutral-800"
          >
            {order?.kind === "plan" ? "Go to dashboard" : paid ? "View my order & access details" : "Browse listings"}
          </Link>
          <Link href="/" className="flex items-center justify-center py-2 text-sm font-medium text-neutral-600 hover:text-black">
            Return to homepage <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
