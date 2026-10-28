"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { BiLock, BiCopy, BiShow, BiHide, BiErrorCircle } from "react-icons/bi";
import { LogoMark } from "@/components/Logo";
import { labelFor } from "@/lib/categories";

function CredentialRow({ item }) {
  const [shown, setShown] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.value);
      toast.success(`${item.label} copied`);
    } catch {
      toast.error("Could not copy. Select the text and copy it manually.");
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-neutral-500">{item.label}</p>
        <p className="mt-0.5 break-all font-mono text-sm font-semibold">{shown ? item.value : "••••••••••••"}</p>
      </div>
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-label={shown ? "Hide" : "Show"}
        className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-black"
      >
        {shown ? <BiHide className="h-5 w-5" /> : <BiShow className="h-5 w-5" />}
      </button>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy"
        className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-black"
      >
        <BiCopy className="h-5 w-5" />
      </button>
    </div>
  );
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const refund = order.status === "refund_required";
  const date = order.purchasedAt ? new Date(order.purchasedAt).toLocaleDateString() : "--";
  const label = labelFor(order);

  return (
    <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-2xl bg-neutral-100 sm:w-28">
          {order.image ? (
            <Image unoptimized src={order.image} alt={order.title || "Account"} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <LogoMark size={36} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold">{order.title || "Account no longer available"}</h3>
          {order.title && label !== "Uncategorized" && <p className="text-sm text-neutral-500">{label}</p>}
          <p className="mt-1 text-xs text-neutral-500">
            {date} · <span className="capitalize">{order.paymentMethod || "card"}</span> · Seller: {order.authorName || "Unknown"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <span className="text-xl font-extrabold">${Number(order.price || 0).toFixed(2)}</span>
          {!refund && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              <BiLock className="h-4 w-4" /> {open ? "Hide access details" : "Access details"}
            </button>
          )}
        </div>
      </div>

      {refund && (
        <div className="flex items-start gap-3 border-t border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <BiErrorCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Someone else bought this account a moment before your payment cleared. Your payment will be refunded. If it
            doesn&apos;t arrive, contact support with reference <span className="font-mono font-semibold">{order.paymentRef}</span>.
          </p>
        </div>
      )}

      {open && !refund && (
        <div className="space-y-3 border-t border-neutral-100 bg-neutral-50 p-5">
          {order.credentials?.length ? (
            <>
              {order.credentials.map((c, i) => (
                <CredentialRow key={i} item={c} />
              ))}
              <p className="text-xs text-neutral-500">
                Only you can see this. Change the password and recovery details as soon as you log in, and don&apos;t share them.
              </p>
            </>
          ) : (
            <p className="text-sm text-neutral-600">
              The access details could not be loaded. Please contact support with reference{" "}
              <span className="font-mono">{order.paymentRef}</span>.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

// Used by both the user and the seller dashboard. Fetches through our own server, which checks the login.
export default function PurchasedAccounts({ title = "My orders" }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    fetch("/api/my-orders", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) throw new Error("Please log in first.");
        if (!res.ok || !data.success) throw new Error(data.message || "Could not load your orders.");
        if (!ignore) setOrders(data.orders || []);
      })
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-neutral-900"></span>
      </div>
    );
  }
  if (error) return <div className="py-20 text-center text-lg font-semibold text-red-600">{error}</div>;

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">No orders yet</h2>
        <p className="mt-2 text-neutral-500">Accounts you buy will show up here with their access details.</p>
        <Link href="/browse" className="mt-6 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800">
          Browse accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-2 sm:p-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mb-6 mt-1 text-neutral-500">
        Total orders: <span className="font-semibold text-black">{orders.length}</span>
      </p>
      <div className="space-y-4">
        {orders.map((o) => (
          <OrderCard key={o._id} order={o} />
        ))}
      </div>
    </div>
  );
}
