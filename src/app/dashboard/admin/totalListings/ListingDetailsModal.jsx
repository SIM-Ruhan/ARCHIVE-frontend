"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { BiX, BiLock } from "react-icons/bi";
import ReviewBadge from "@/app/components/ReviewBadge";
import ListingActions from "./ListingActions";
import { labelFor } from "@/lib/categories";
import { LogoMark } from "@/components/Logo";

const Fact = ({ label, value }) =>
  value ? (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-semibold">{value}</dd>
    </div>
  ) : null;

export default function ListingDetailsModal({ listing, onClose, onUpdated, onDeleted }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!listing) return null;
  const labels = listing.credentialLabels || [];
  const created = listing.createdAt ? new Date(listing.createdAt).toLocaleString() : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-neutral-100"
        >
          <BiX className="h-5 w-5" />
        </button>

        <div className="relative h-56 w-full bg-neutral-100">
          {listing.image ? (
            <Image unoptimized src={listing.image} alt={listing.title || "Listing"} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <LogoMark size={72} />
            </div>
          )}
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <ReviewBadge listing={listing} />
              {listing.isFeatured && (
                <span className="rounded-full border border-black bg-neutral-100 px-2.5 py-1 text-xs font-semibold">Featured</span>
              )}
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{listing.title || "Untitled listing"}</h2>
            <p className="mt-1 text-sm text-neutral-500">{labelFor(listing)}</p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Fact label="Price" value={`$${Number(listing.price || 0).toLocaleString()}`} />
            <Fact label="Seller" value={listing.authorName} />
            <Fact label="Seller email" value={listing.authorEmail} />
            <Fact label="Followers / quantity" value={listing.quantity ? Number(listing.quantity).toLocaleString() : null} />
            <Fact label="Account age" value={listing.accountAge} />
            <Fact label="Verified badge" value={listing.verified ? "Yes" : null} />
            <Fact label="Likes" value={String(listing.likesCount || 0)} />
            <Fact label="Submitted" value={created} />
            <Fact label="Listing ID" value={String(listing._id)} />
          </dl>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
              {listing.description || "No description."}
            </p>
          </section>

          {listing.highlights?.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500">What the buyer gets</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                {listing.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <BiLock className="h-4 w-4" /> Private access details
            </h3>
            {labels.length > 0 ? (
              <>
                <div className="mt-3 flex flex-wrap gap-2">
                  {labels.map((l, i) => (
                    <span key={i} className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium">
                      {l}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-neutral-500">
                  The seller supplied these fields. Their values are encrypted and shown to the buyer only after a successful payment.
                </p>
              </>
            ) : (
              <p className="mt-2 text-xs text-neutral-500">This listing has no access details on record.</p>
            )}
          </section>

          <div className="border-t border-neutral-100 pt-5">
            <ListingActions
              listing={listing}
              showView={false}
              onUpdated={onUpdated}
              onDeleted={(id) => {
                onDeleted?.(id);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
