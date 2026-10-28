"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { BiPurchaseTag, BiLike, BiStar, BiRightArrowAlt } from "react-icons/bi";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function UserDashboardHome() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userId = user?.id;

  const [orders, setOrders] = useState([]);
  const [likedCount, setLikedCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!userId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    const load = async () => {
      try {
        const [o, l, s] = await Promise.all([
          fetch(`${baseURL}/api/users/${userId}/purchases`).then((r) => r.json()),
          fetch(`${baseURL}/api/users/${userId}/liked-listings`).then((r) => r.json()),
          fetch(`${baseURL}/api/users/${userId}/favorites`).then((r) => r.json()),
        ]);
        setOrders((o.purchases || []).filter((x) => x.status !== "refund_required"));
        setLikedCount((l.listings || []).length);
        setSavedCount((s.listings || []).length);
      } catch (e) {
        console.error("Failed to load dashboard:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, isPending]);

  const spent = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  const cards = [
    { label: "Orders", value: orders.length, href: "/dashboard/user/orders", icon: BiPurchaseTag },
    { label: "Liked accounts", value: likedCount, href: "/dashboard/user/liked", icon: BiLike },
    { label: "Saved accounts", value: savedCount, href: "/dashboard/user/saved", icon: BiStar },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-neutral-900"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-2 sm:p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="mt-1 text-neutral-500">Your orders and saved accounts in one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-3xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-4xl font-extrabold">{value}</p>
            <p className="mt-1 flex items-center justify-between text-sm text-neutral-500">
              {label}
              <BiRightArrowAlt className="h-5 w-5 transition group-hover:translate-x-1" />
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent orders</h2>
          <p className="text-sm text-neutral-500">
            Total spent: <span className="font-bold text-black">${spent.toFixed(2)}</span>
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center text-neutral-500">
            <p>You have not bought any account yet.</p>
            <Link href="/browse" className="mt-4 inline-block rounded-full bg-black px-6 py-2.5 font-semibold text-white hover:bg-neutral-800">
              Browse accounts
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100">
            {orders.slice(0, 5).map((o) => (
              <li key={o._id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{o.title}</p>
                  <p className="text-xs text-neutral-500">
                    {o.purchasedAt ? new Date(o.purchasedAt).toLocaleDateString() : "--"} ·{" "}
                    <span className="capitalize">{o.paymentMethod || "card"}</span>
                  </p>
                </div>
                <span className="font-bold">${Number(o.price || 0).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-black p-6 text-white sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold">Want to sell your old unused account?</h3>
          <p className="text-sm text-neutral-300">Buy a seller plan and your dashboard upgrades to a seller dashboard.</p>
        </div>
        <Link href="/pricing" className="rounded-full bg-white px-6 py-2.5 font-semibold text-black hover:bg-neutral-200">
          View details
        </Link>
      </div>
    </div>
  );
}
