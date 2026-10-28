"use client";

import React, { useState } from "react";
import { BiTrash, BiX, BiLoader } from "react-icons/bi";

export default function DeleteListingModal({ listing, onClose, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!listing) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await onDelete(listing._id);
      onClose();
    } catch (err) {
      setError("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <BiTrash className="text-red-600 w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Delete Listing</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 disabled:opacity-40"
            aria-label="Close"
          >
            <BiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">

          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <BiTrash className="w-7 h-7 text-red-500" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-1.5">
            <p className="text-gray-900 font-semibold text-sm">
              Are you sure you want to delete this listing?
            </p>
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-gray-700">{listing.title}</span> will be permanently removed.
              This action cannot be undone.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 text-center">
              {error}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <BiLoader className="animate-spin w-4 h-4" />
                Deleting…
              </>
            ) : (
              <>
                <BiTrash className="w-4 h-4" />
                Delete Listing
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}