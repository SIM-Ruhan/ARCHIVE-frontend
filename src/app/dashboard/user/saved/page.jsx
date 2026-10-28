"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import ListingCard from "@/app/components/ListingCard";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function SavedAccountsPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!userId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    fetch(`${baseURL}/api/users/${userId}/favorites`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .catch((e) => console.error("Failed to load saved accounts:", e))
      .finally(() => setLoading(false));
  }, [userId, isPending]);

  const handleRemove = async (listingId) => {
    const previous = listings;
    setListings((p) => p.filter((l) => l._id !== listingId)); // optimistic
    try {
      const res = await fetch(`${baseURL}/api/users/${userId}/favorites/${listingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Remove failed");
    } catch (e) {
      console.error(e);
      setListings(previous); // roll back
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-neutral-900"></span>
      </div>
    );
  }
  if (!userId) return <div className="py-20 text-center text-xl font-bold">Please log in first.</div>;

  if (listings.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">No saved accounts</h2>
        <p className="mt-2 text-neutral-500">Press Save on any account to find it here.</p>
        <Link href="/browse" className="mt-6 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800">
          Browse accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Saved accounts ({listings.length})</h1>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((l) => (
          <div key={l._id} className="flex flex-col gap-2">
            <ListingCard listing={l} />
            <button
              onClick={() => handleRemove(l._id)}
              className="rounded-full border border-neutral-300 py-2 text-sm font-semibold hover:bg-black hover:text-white"
            >
              Remove from saved
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
