"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import ListingCard from "@/app/components/ListingCard";

export default function LikedListingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const userId = session?.user?.id;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until session finishes loading
    if (isPending) return;

    // If no logged in user
   if (!userId) {
    queueMicrotask(() => {
      setLoading(false);
    });
    return;
  }

    const fetchLikedListings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/liked-listings`
        );

        const data = await res.json();

        console.log(data);

        if (data.success) {
          setListings(data.listings);
        }
      } catch (error) {
        console.error("Failed to fetch liked listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedListings();
  }, [userId, isPending]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        Loading...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have not liked any listings yet.
      </div>
    );
  }

  return (
    <div className="">
        <h1 className="text-4xl font-bold py-5">Total Liked Listings({listings.length})</h1>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard
          key={listing._id}
          listing={listing}
        />
      ))}
    </div></div>
  );
}