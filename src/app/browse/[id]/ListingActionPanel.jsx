"use client";

import React, { useState } from "react";
import { BiHeart, BiBookmark, BiFlag, BiSolidHeart, BiSolidBookmark } from "react-icons/bi";
import { FaRegCreditCard, FaBitcoin } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const METHODS = [
  { id: "card", label: "Card", hint: "Pay with Stripe", action: "/api/payment", Icon: FaRegCreditCard },
  { id: "crypto", label: "Crypto", hint: "BTC, ETH, USDT and more", action: "/api/crypto/checkout", Icon: FaBitcoin },
];

export default function ListingActionPanel({
  listingId,
  initialLikes,
  initialIsLiked = false,
  initialIsSaved = false,
  price,
  userId,
  isOwner = false,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [method, setMethod] = useState("card");

  const [showModal, setShowModal] = useState(false);
  const [reportType, setReportType] = useState("Spam");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;

  // Login is compulsory for like, save, report and payment.
  const requireAuth = (what) => {
    if (userId) return true;
    toast.error(`Log in to ${what}.`);
    router.push(loginHref);
    return false;
  };

  const handleLike = async () => {
    if (!requireAuth("like this listing")) return;
    const next = !isLiked;
    setIsLiked(next);
    setLikes((p) => (next ? p + 1 : p - 1));
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings/${listingId}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isLiked: next }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to like", error);
      setIsLiked(!next);
      setLikes((p) => (next ? p - 1 : p + 1));
    }
  };

  const handleFavorite = async () => {
    if (!requireAuth("save this listing")) return;
    const next = !isSaved;
    setIsSaved(next);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings/${listingId}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isSaved: next }),
      });
    } catch (error) {
      console.error("Failed to update favorite", error);
      setIsSaved(!next);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!requireAuth("report a listing")) return;
    setIsSubmittingReport(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          reportedBy: userId,
          reason: reportType,
          description: otherReason.trim() || null,
        }),
      });
      setShowModal(false);
      setOtherReason("");
      toast.success("Report sent. Our team will review it.");
    } catch (error) {
      console.error("Failed to report", error);
      toast.error("Could not send the report. Try again.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const current = METHODS.find((m) => m.id === method);

  return (
    <>
      <div className="flex w-full flex-col gap-5 rounded-3xl border border-neutral-200 bg-white p-6">
        <div>
          <p className="text-sm text-neutral-500">Price</p>
          <p className="font-display text-5xl font-extrabold tracking-tight">${Number(price).toLocaleString()}</p>
        </div>

        {/* Payment */}
        {isOwner ? (
          <p className="rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-600">This is your own listing.</p>
        ) : !userId ? (
          <div className="rounded-2xl bg-neutral-100 p-4">
            <p className="text-sm text-neutral-700">You need an account to pay for a listing.</p>
            <button
              onClick={() => requireAuth("buy this listing")}
              className="mt-3 w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Log in to buy
            </button>
          </div>
        ) : (
          <form action={current.action} method="POST" className="space-y-4">
            <input type="hidden" name="productId" value={listingId} />
            <input type="hidden" name="user_id" value={userId} />

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Payment method</legend>
              <div className="grid grid-cols-2 gap-3">
                {METHODS.map(({ id, label, hint, Icon }) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-3.5 transition-colors ${
                      method === id ? "border-black bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={id}
                      checked={method === id}
                      onChange={() => setMethod(id)}
                      className="sr-only"
                    />
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-bold">{label}</span>
                    <span className="text-xs leading-snug text-neutral-500">{hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full rounded-full bg-black py-4 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              {method === "crypto" ? "Pay with crypto" : "Pay with card"} · ${Number(price).toLocaleString()}
            </button>
          </form>
        )}

        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-5">
          <button
            onClick={handleLike}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              isLiked ? "border-rose-100 bg-rose-50 text-rose-600" : "border-transparent bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              {isLiked ? <BiSolidHeart className="text-xl text-rose-500" /> : <BiHeart className="text-xl text-neutral-400" />}
              {isLiked ? "Liked" : "Like this listing"}
            </span>
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-bold text-neutral-700">{likes}</span>
          </button>

          <button
            onClick={handleFavorite}
            className={`flex w-full items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              isSaved ? "border-neutral-300 bg-neutral-100 text-black" : "border-transparent bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {isSaved ? <BiSolidBookmark className="text-xl" /> : <BiBookmark className="text-xl text-neutral-400" />}
            {isSaved ? "Saved to favorites" : "Save to favorites"}
          </button>

          <button
            onClick={() => (requireAuth("report a listing") ? setShowModal(true) : null)}
            className="flex w-full items-center gap-2.5 rounded-xl bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <BiFlag className="text-xl" />
            Report listing
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-xl font-bold tracking-tight">Report listing</h3>
            <p className="mb-5 text-sm text-neutral-500">Tell us what is wrong with this listing.</p>

            <form onSubmit={handleReportSubmit}>
              <div className="mb-5 space-y-3">
                {["Spam", "Misleading or fake", "Stolen or not owned by the seller", "Offensive content"].map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-100 p-3 hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="reportType"
                      value={option}
                      checked={reportType === option && !otherReason}
                      onChange={() => {
                        setReportType(option);
                        setOtherReason("");
                      }}
                      className="h-4 w-4 accent-black"
                    />
                    <span className="text-sm font-medium text-neutral-700">{option}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-semibold text-neutral-600">Other reason</label>
                <input
                  type="text"
                  placeholder="Describe the problem"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-full bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingReport} className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
                  {isSubmittingReport ? "Sending…" : "Send report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
