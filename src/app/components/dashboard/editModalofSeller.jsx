"use client";

import React, { useState } from "react";
import { BiEdit, BiX, BiSave, BiLoader } from "react-icons/bi";

export default function EditListingModal({ listing, onClose, onSave }) {
  // 1. Initialize state directly from the listing prop to prevent empty first renders
  const [form, setForm] = useState(() => ({
    title: listing?.title || "",
    quantity: listing?.quantity || "",
    accountAge: listing?.accountAge || "",
    price: listing?.price || "", // Added to initial state
    description: listing?.description || "",
    status: listing?.status || "active",
  }));

  
  const [prevListingId, setPrevListingId] = useState(listing?._id);

  if (listing?._id !== prevListingId) {
    setPrevListingId(listing?._id);
    setForm({
      title: listing?.title || "",
      quantity: listing?.quantity || "",
      accountAge: listing?.accountAge || "",
      price: listing?.price || "",
      description: listing?.description || "",
      status: listing?.status || "active",
    });
  }

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!listing) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Listing title is required.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(listing._id, form);
      onClose();
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <BiEdit className="text-neutral-900 w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Edit Listing</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 disabled:opacity-40"
            aria-label="Close"
          >
            <BiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">

            {listing?.approvalStatus === "approved" && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-4 py-2.5">
                Changing the title, price, description or other details sends this listing back to admin review. It stays hidden until it is approved again.
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Title */}
            <Field label="Listing Title" required>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. 5-year-old Gmail account"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition"
              />
            </Field>

            {/* Followers + Account age */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Followers / quantity">
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="10000" min="0" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition" />
              </Field>
              <Field label="Account age">
                <input type="text" name="accountAge" value={form.accountAge} onChange={handleChange} placeholder="e.g. 4 years" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition" />
              </Field>
            </div>

            {/* Price */}
            <Field label="Price (USD)">
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="25" min="1" step="0.01" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition" />
            </Field>

            {/* Status */}
            <Field label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="A short description of the listing…"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition resize-none"
              />
            </Field>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-neutral-900 hover:bg-neutral-700 text-white transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <BiLoader className="animate-spin w-4 h-4" />
                  Saving…
                </>
              ) : (
                <>
                  <BiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}