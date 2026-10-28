"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Pagination } from "@heroui/react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import ListingActions from "./ListingActions";
import ListingDetailsModal from "./ListingDetailsModal";
import ReviewBadge from "@/app/components/ReviewBadge";
import { labelFor } from "@/lib/categories";
import { LogoMark } from "@/components/Logo";

const LIMIT = 10;

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending approval" },
  { key: "approved", label: "Live" },
  { key: "sold", label: "Sold" },
];

const TotalListingPage = () => {
  const [listings, setListings] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, sold: 0 });
  const [filter, setFilter] = useState("pending"); // admins mostly come here to review
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const [reloadKey, setReloadKey] = useState(0);
  const silentRef = useRef(false);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      const silent = silentRef.current;
      silentRef.current = false;
      if (!silent) setIsLoading(true);
      try {
        const qs = new URLSearchParams({ page: String(currentPage), limit: String(LIMIT), filter });
        if (debouncedSearch) qs.set("search", debouncedSearch);
        const res = await fetch(`/api/admin/listings?${qs}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to load listings");
        if (ignore) return;
        setError("");
        setListings(data.listings || []);
        setTotalPages(data.totalPages || 1);
        setCounts(data.counts || { all: 0, pending: 0, approved: 0, sold: 0 });
      } catch (err) {
        console.error("Failed to load listings:", err);
        if (ignore) return;
        setError(err.message);
        setListings([]);
        setTotalPages(1);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [currentPage, filter, debouncedSearch, reloadKey]);

  const reload = () => {
    silentRef.current = true; // refresh in the background without the loading state
    setReloadKey((k) => k + 1);
  };

  const handleUpdated = (updated) => {
    if (updated && selected && String(selected._id) === String(updated._id)) setSelected(updated);
    reload();
  };
  const handleDeleted = () => reload();

  const stats = [
    { key: "all", label: "Total listings", value: counts.all },
    { key: "pending", label: "Awaiting approval", value: counts.pending, accent: counts.pending > 0 },
    { key: "approved", label: "Live now", value: counts.approved },
    { key: "sold", label: "Sold", value: counts.sold },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Manage listings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review new accounts before they go public, feature the best ones, and remove anything that doesn&apos;t belong.
        </p>
      </div>

      {/* Stat cards double as filters */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setFilter(s.key);
              setCurrentPage(1);
            }}
            className={`rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
              filter === s.key ? "border-black bg-black text-white" : "border-neutral-200 bg-white"
            }`}
          >
            <p className={`text-xs font-medium ${filter === s.key ? "text-neutral-300" : "text-neutral-500"}`}>{s.label}</p>
            <p className="mt-2 flex items-center gap-2 text-3xl font-extrabold">
              {s.value}
              {s.accent && filter !== s.key && <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />}
            </p>
          </button>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setFilter(t.key);
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === t.key ? "bg-black text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {t.label}
              <span className={`ml-2 text-xs ${filter === t.key ? "text-neutral-300" : "text-neutral-400"}`}>
                {t.key === "approved" ? counts.approved : counts[t.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title"
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <th className="p-4 font-semibold">Account</th>
                <th className="p-4 font-semibold">Seller</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-sm text-neutral-500">Loading listings...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-sm text-red-600">{error}</td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <p className="font-semibold">
                      {filter === "pending" ? "Nothing waiting for approval" : "No listings found"}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {filter === "pending" ? "New seller submissions will show up here." : "Try another filter or search."}
                    </p>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing._id} className="transition-colors hover:bg-neutral-50/70">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {listing.image ? (
                            <Image unoptimized src={listing.image} alt={listing.title || "Listing"} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <LogoMark size={26} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[16rem] truncate text-sm font-semibold">{listing.title || "Untitled listing"}</p>
                          <p className="font-mono text-xs text-neutral-400">#{String(listing._id).slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{listing.authorName || "Unknown"}</td>
                    <td className="p-4">
                      <span className="inline-block max-w-[14rem] truncate rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium">
                        {labelFor(listing)}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold">${Number(listing.price || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <ReviewBadge listing={listing} />
                        {listing.isFeatured && (
                          <span className="rounded-full border border-black px-2 py-0.5 text-[11px] font-semibold">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <ListingActions
                        listing={listing}
                        onView={setSelected}
                        onUpdated={handleUpdated}
                        onDeleted={handleDeleted}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-8 border-t border-neutral-100 pt-6">
          <Pagination className="justify-end">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={currentPage === 1}
                  onPress={() => setCurrentPage((p) => p - 1)}
                  className="bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Pagination.PreviousIcon>
                    <FaLongArrowAltLeft />
                  </Pagination.PreviousIcon>
                  <span>Back</span>
                </Pagination.Previous>
              </Pagination.Item>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === currentPage}
                    onPress={() => setCurrentPage(p)}
                    className={
                      p === currentPage
                        ? "border-black bg-black text-white"
                        : "bg-transparent text-neutral-700 hover:bg-neutral-100"
                    }
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              <Pagination.Item>
                <Pagination.Next
                  isDisabled={currentPage === totalPages}
                  onPress={() => setCurrentPage((p) => p + 1)}
                  className="bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
                >
                  <span>Forward</span>
                  <Pagination.NextIcon>
                    <FaLongArrowAltRight />
                  </Pagination.NextIcon>
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}

      {selected && (
        <ListingDetailsModal
          listing={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
};

export default TotalListingPage;
