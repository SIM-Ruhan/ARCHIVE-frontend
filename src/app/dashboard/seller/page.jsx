
"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { labelFor } from "@/lib/categories";
import { motion } from "framer-motion";

// Icons
import { 
  BiHeart, 
  BiBookOpen, 
  BiBookmark,
} from "react-icons/bi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { getCompanyListing, getSellerStats } from "@/lib/api";
import ViewListingModal from "@/app/components/dashboard/viewModalofSeller";
import EditListingModal from "@/app/components/dashboard/editModalofSeller";
import DeleteListingModal from "@/app/components/dashboard/deleteModalofSeller";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

function formatCount(num) {
  const n = Number(num) || 0;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
}

export default function SellerDashboardHomepage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  const [sellerStats, setSellerStats] = useState({
    totalFavorites: 0,
    totalEngagement: 0,
  });

  const [selectedListing, setSelectedListing] = useState(null);
  const [modalType, setModalType] = useState(null); 
  
  const openModal = (listing, type) => { setSelectedListing(listing); setModalType(type); };
  const closeModal = () => { setSelectedListing(null); setModalType(null); };

  useEffect(() => {
    const fetchListings = async () => {
      if (user?.id) {
        try {
          setIsLoadingListings(true);
          const data = await getCompanyListing({
            authorId: user?.id, 
            status: "active",
          });
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

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          const data = await getSellerStats(user.id);
          if (data?.success) {
            setSellerStats({
              totalFavorites: data.totalFavorites,
              totalEngagement: data.totalEngagement,
            });
          }
        } catch (error) {
          console.error("Failed to fetch seller stats:", error);
        }
      }
    };
    fetchStats();
  }, [user]);

  const handleSaveListing = async (id, updatedFields) => {
    const targetId = typeof id === 'object' && id?.$oid ? id.$oid : id;

    const res = await fetch(`${baseURL}/api/listings/${targetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) throw new Error("Patch failed");

    setListings((prev) =>
      prev.map((r) => {
        const rId = typeof r._id === 'object' ? r._id.$oid : r._id;
        return rId === targetId ? { ...r, ...updatedFields } : r;
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

  const stats = [
    { title: "Active Listings",   value: listings.length || "0",                       icon: BiBookOpen,   color: "text-blue-600",   bg: "bg-blue-100" },
    { title: "Total Favorites",  value: formatCount(sellerStats.totalFavorites),      icon: BiBookmark,      color: "text-purple-600",   bg: "bg-purple-100" },
    { title: "Total Engagement", value: formatCount(sellerStats.totalEngagement),     icon: BiHeart, color: "text-rose-600", bg: "bg-rose-100" },
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show:   { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
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

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name || "Seller"}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here is what is happening with your listings today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/seller/add-listing"
            className="bg-neutral-900 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            + New Listing
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 3. Dynamic Listings Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">My Recent Listings</h2>
          <Link
            href="/dashboard/seller/myListings"
            className="text-sm font-semibold text-neutral-900 hover:text-black flex items-center gap-1"
          >
            View All <HiOutlineArrowRight />
          </Link>
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
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">

              {isLoadingListings ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-300" />
                  </td>
                </tr>
              ) : listings.length > 0 ? (
                listings.slice(0, 5).map((listing, index) => {
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
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-neutral-100 hover:bg-neutral-100 text-neutral-900 border border-neutral-300 transition-colors"
                            title="Edit listing"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openModal(listing, "delete")}
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
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
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