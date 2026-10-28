"use client";

import React, { useState, useEffect } from "react";
import ReviewBadge from "@/app/components/ReviewBadge";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { labelFor } from "@/lib/categories";
import { motion } from "framer-motion";

import { HiOutlineArrowRight } from "react-icons/hi";
import { getCompanyListing } from "@/lib/api";
import ViewListingModal from "@/app/components/dashboard/viewModalofSeller";
import EditListingModal from "@/app/components/dashboard/editModalofSeller";
import DeleteListingModal from "@/app/components/dashboard/deleteModalofSeller";

export default function SellerDashboardHomepage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  const [selectedListing, setSelectedListing] = useState(null);
  const [modalType, setModalType] = useState(null); // "view" | "edit" | "delete"
  
  const openModal = (listing, type) => { setSelectedListing(listing); setModalType(type); };
  const closeModal = () => { setSelectedListing(null); setModalType(null); };

  useEffect(() => {
    const fetchListings = async () => {
      // Ensure we only fetch if we have a valid user ID
      if (user?.id) {
        try {
          setIsLoadingListings(true);
          // FIXED: Changed user?.authorId to user?.id to fetch correctly
          const data = await getCompanyListing({
            authorId: user?.id, 
            status: "active",
          });
          
          // Defensively ensure data is an array
          setListings(Array.isArray(data) ? data : (data?.listings || []));
        } catch (error) {
          console.error("Failed to fetch listings:", error);
        } finally {
          setIsLoadingListings(false);
        }
      }
    };
    fetchListings();
  }, [user]);

  
 const baseURL = process.env.NEXT_PUBLIC_BASE_URL

const handleSaveListing = async (id, updatedFields) => {
  const targetId = typeof id === 'object' && id?.$oid ? id.$oid : id;
console.log("Target",targetId)
  const res = await fetch(`${baseURL}/api/listings/${targetId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Patch failed");

  setListings((prev) =>
    prev.map((r) => {
      const rId = typeof r._id === 'object' ? r._id.$oid : r._id;
      // the server may send an edited listing back to review (and un-feature it)
      return rId === targetId
        ? { ...r, ...updatedFields, approvalStatus: data.approvalStatus ?? r.approvalStatus, isFeatured: data.approvalStatus === "pending" ? false : r.isFeatured }
        : r;
    })
  );
};

  const handleDeleteListing = async (id) => {
  const targetId = typeof id === 'object' && id?.$oid ? id.$oid : id;

  const res = await fetch(`${baseURL}/api/listings/${targetId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");

  setListings((prev) => prev.filter((r) => {
    const rId = typeof r._id === 'object' ? r._id.$oid : r._id;
    return rId !== targetId;
  }));
};
 

  if (isPending) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {modalType === "view" && (
        <ViewListingModal listing={selectedListing} onClose={closeModal} />
      )}
      {modalType === "edit" && (
        <EditListingModal listing={selectedListing} onClose={closeModal} onSave={handleSaveListing} />
      )}
      {modalType === "delete" && (
        <DeleteListingModal listing={selectedListing} onClose={closeModal} onDelete={handleDeleteListing} />
      )}

     

      {/* 3. Dynamic Listings Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold">My Recent Listings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Listing Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold text-right">Likes</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Review</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">

              {/* Loading */}
              {isLoadingListings ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-300" />
                  </td>
                </tr>
              ) : listings.length > 0 ? (
                listings.map((listing, index) => {
                  const safeId = typeof listing._id === 'object' && listing._id?.$oid ? listing._id.$oid : listing._id;
                  
                  return (
                    <tr key={safeId || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold">{listing.title || "Untitled"}</td>
                      <td className="px-6 py-4 text-sm">{labelFor(listing)}</td>
                      <td className="px-6 py-4 text-sm">${Number(listing.price || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-right">{listing.likesCount || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          listing.status === "active"
                            ? "bg-neutral-100 text-neutral-900 border-neutral-300"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {listing.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <ReviewBadge listing={listing} />
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openModal(listing, "view")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                            title="View listing"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openModal(listing, "edit")}
                            disabled={!!listing.sold}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-neutral-100 hover:bg-neutral-100 text-neutral-900 border border-neutral-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Edit listing"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openModal(listing, "delete")}
                            disabled={!!listing.sold}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                            title="Delete listing"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No listings yet. Add your first one from the sidebar.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}