"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import ListingCard from "@/app/components/ListingCard";

export default function FavoritesPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const [listings, setListings] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [removingId, setRemovingId] = useState(null); 

  useEffect(() => {
    if (isPending || !userId) return;
    const fetchFavorites = async () => {
      setFetching(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/favorites`
        );
        const data = await res.json();
        if (data.success) {
          setListings(data.listings);
        }
      } catch (error) {
        console.error("Failed to fetch favorite listings:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchFavorites();
  }, [userId, isPending]);

  const handleRemoveFavorite = async (listingId) => {
    // Optimistically remove from UI
    const prevListings = listings;
    setListings((prev) => prev.filter((r) => r._id !== listingId));
    setRemovingId(listingId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/favorites/${listingId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove favorite");
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      // Roll back on failure
      setListings(prevListings);
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending) {
    return <div className="flex justify-center py-10">Loading session...</div>;
  }
  if (fetching) {
    return <div className="flex justify-center py-10">Loading favorite listings...</div>;
  }
  if (!userId) {
    return <div className="text-center py-10 text-gray-500">Please log in first.</div>;
  }
  if (listings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have not saved any favorite listings yet.
      </div>
    );
  }
  return (
    <div>
                <h1 className="text-4xl font-bold text-gray-700 py-5">Total Saved Listings({listings.length})</h1>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <div key={listing._id} className="relative">
          <ListingCard listing={listing} />
          <button
            onClick={() => handleRemoveFavorite(listing._id)}
            disabled={removingId === listing._id}
            className="absolute top-60 right-5 bg-red-100 hover:bg-red-50 text-red-600 rounded-xl px-4 py-2 shadow disabled:opacity-50"
            aria-label="Remove from favorites"
          >
            {removingId === listing._id ? "…" : "Delete"}
          </button>
        </div>
      ))}
    </div></div>
  );
}