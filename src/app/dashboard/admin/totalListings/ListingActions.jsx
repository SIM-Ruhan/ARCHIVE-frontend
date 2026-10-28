"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { getListingState } from "@/lib/listingState";

// Approve / Unapprove, Feature / Unfeature, View and Delete for one listing.
// All changes go through /api/admin/listings/:id (admin session is checked on the server).
export default function ListingActions({ listing, onUpdated, onView, onDeleted, showView = true }) {
  const [busy, setBusy] = useState(null); // "approve" | "feature" | "delete"
  const [confirmDelete, setConfirmDelete] = useState(false);

  const id = listing._id;
  const state = getListingState(listing);
  const isSold = state === "sold";
  const isApproved = state === "approved";
  const isFeatured = !!listing.isFeatured;

  const patch = async (key, payload, successMessage) => {
    if (busy) return;
    setBusy(key);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");
      toast.success(successMessage);
      onUpdated?.(data.listing);
    } catch (e) {
      toast.error(e.message || "Update failed");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");
      toast.success("Listing deleted");
      setConfirmDelete(false);
      onDeleted?.(id);
    } catch (e) {
      toast.error(e.message || "Delete failed");
    } finally {
      setBusy(null);
    }
  };

  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showView && (
        <button onClick={() => onView?.(listing)} className={`${base} border border-neutral-300 bg-white text-black hover:border-black`}>
          View details
        </button>
      )}

      {/* Pending <-> Approved toggle */}
      <button
        onClick={() =>
          patch(
            "approve",
            { approvalStatus: isApproved ? "pending" : "approved" },
            isApproved ? "Moved back to pending" : "Listing approved and live"
          )
        }
        disabled={isSold || busy !== null}
        title={isSold ? "Sold accounts can't be changed" : undefined}
        className={`${base} ${
          isApproved
            ? "border border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black"
            : "bg-black text-white hover:bg-neutral-800"
        }`}
      >
        {busy === "approve" ? "..." : isApproved ? "Unapprove" : "Approve"}
      </button>

      {/* Feature <-> Unfeature toggle */}
      <button
        onClick={() =>
          patch("feature", { isFeatured: !isFeatured }, isFeatured ? "Removed from featured" : "Listing featured")
        }
        disabled={isSold || !isApproved || busy !== null}
        title={!isApproved && !isSold ? "Approve the listing before featuring it" : undefined}
        className={`${base} ${
          isFeatured
            ? "border border-black bg-neutral-100 text-black hover:bg-neutral-200"
            : "border border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black"
        }`}
      >
        {busy === "feature" ? "..." : isFeatured ? "Unfeature" : "Feature"}
      </button>

      <button
        onClick={() => setConfirmDelete(true)}
        disabled={isSold || busy !== null}
        title={isSold ? "Sold accounts are kept as the buyer's record" : undefined}
        className={`${base} border border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
      >
        Delete
      </button>

      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold">Delete this listing?</h3>
            <p className="mt-2 text-sm text-neutral-500">
              &ldquo;{listing.title}&rdquo; and its private access details will be permanently removed. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={busy === "delete"}
                className="rounded-full bg-neutral-100 px-5 py-2 text-sm font-semibold hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy === "delete"}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy === "delete" ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
