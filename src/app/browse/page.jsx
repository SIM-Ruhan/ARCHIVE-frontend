"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getListing } from "@/lib/api";
import ListingCard from "../components/ListingCard";
import { Pagination } from "@heroui/react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { CATEGORIES, getCategory, getGroup, labelFor } from "@/lib/categories";

const selectClass =
  "w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10";

function BrowseContent() {
  const router = useRouter();
  const params = useSearchParams();

  // filters live in the URL so every nested-menu link lands on the right results
  const category = params.get("category") || "";
  const subcategory = params.get("subcategory") || "";
  const type = params.get("type") || "";

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const cat = getCategory(category);
  const group = getGroup(category, subcategory);

  const setFilters = (next) => {
    const p = new URLSearchParams();
    if (next.category) p.set("category", next.category);
    if (next.subcategory) p.set("subcategory", next.subcategory);
    if (next.type) p.set("type", next.type);
    const qs = p.toString();
    setCurrentPage(1);
    router.push(qs ? `/browse?${qs}` : "/browse");
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const query = { page: currentPage, limit: 12, status: "active" };
        if (debouncedSearch) query.search = debouncedSearch;
        if (category) query.category = category;
        if (subcategory) query.subcategory = subcategory;
        if (type) query.type = type;

        const data = await getListing(query);
        setListings(data?.listings || []);
        setTotalPages(data?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [currentPage, debouncedSearch, category, subcategory, type]);

  const heading = category ? labelFor({ category, subcategory, type }).split(" / ").pop() : "All accounts";

  return (
    <div className="min-h-screen px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{heading}</h1>
          <p className="mt-3 text-neutral-600">
            {category ? labelFor({ category, subcategory, type }) : "Browse every listing, or narrow it down with the filters below."}
          </p>
        </div>

        <div className="mb-10 grid gap-3 rounded-3xl border border-neutral-200 bg-white p-4 md:grid-cols-4">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search listings by title"
            aria-label="Search listings"
            className={`${selectClass} md:col-span-1`}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            value={category}
            aria-label="Category"
            className={selectClass}
            onChange={(e) => setFilters({ category: e.target.value })}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            value={subcategory}
            aria-label="Sub-category"
            disabled={!cat || cat.groups.length === 0}
            className={`${selectClass} disabled:opacity-50`}
            onChange={(e) => setFilters({ category, subcategory: e.target.value })}
          >
            <option value="">All sub-categories</option>
            {cat?.groups.map((g) => (
              <option key={g.slug} value={g.slug}>{g.name}</option>
            ))}
          </select>
          <select
            value={type}
            aria-label="Type"
            disabled={!group || group.items.length === 0}
            className={`${selectClass} disabled:opacity-50`}
            onChange={(e) => setFilters({ category, subcategory, type: e.target.value })}
          >
            <option value="">All types</option>
            {group?.items.map((i) => (
              <option key={i.slug} value={i.slug}>{i.name}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-neutral-500">Loading listings…</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listings.length > 0 ? (
              listings.map((listing) => <ListingCard key={listing._id} listing={listing} />)
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-neutral-300 bg-white py-16 text-center">
                <p className="text-lg font-semibold">No listings match these filters</p>
                <p className="mt-1 text-sm text-neutral-500">Try a different category or clear the search.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="mt-12 border-t border-neutral-200 pt-6">
            <Pagination className="justify-end">
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous isDisabled={currentPage === 1} onPress={() => setCurrentPage((p) => p - 1)}>
                    <Pagination.PreviousIcon>
                      <FaLongArrowAltLeft />
                    </Pagination.PreviousIcon>
                    <span>Back</span>
                  </Pagination.Previous>
                </Pagination.Item>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link isActive={p === currentPage} onPress={() => setCurrentPage(p)}>
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}

                <Pagination.Item>
                  <Pagination.Next isDisabled={currentPage === totalPages} onPress={() => setCurrentPage((p) => p + 1)}>
                    <span>Next</span>
                    <Pagination.NextIcon>
                      <FaLongArrowAltRight />
                    </Pagination.NextIcon>
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-neutral-500">Loading listings…</div>}>
      <BrowseContent />
    </Suspense>
  );
}
