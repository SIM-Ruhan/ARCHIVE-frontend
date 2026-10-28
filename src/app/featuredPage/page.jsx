export const dynamic = "force-dynamic";

import React from "react";
import ListingCard from "../components/ListingCard";

const getFeaturedListings = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings?limit=100&status=active`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.listings || []).filter((l) => l.isFeatured === true);
  } catch (error) {
    console.error("Failed fetching featured listings:", error);
    return [];
  }
};

const FeaturedListingsPage = async () => {
  const featured = await getFeaturedListings();

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Featured listings</h2>
          <p className="mt-2 text-neutral-600">Accounts our team has reviewed and picked out.</p>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <p className="text-lg font-semibold">No featured listings yet</p>
            <p className="mt-1 text-sm text-neutral-500">
              Admins can feature a listing from the dashboard and it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListingsPage;
