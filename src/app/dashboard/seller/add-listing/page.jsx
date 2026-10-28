"use client";

import React, { useState, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiTrash, BiSave, BiLoaderAlt, BiImageAdd, BiDollar, BiLock } from "react-icons/bi";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreateListing } from "@/lib/actions/listing";
import { authClient } from "@/lib/auth-client";
import { CATEGORIES, getCategory, getGroup } from "@/lib/categories";

const inputClass =
  "w-full rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-60";

function ListingForm() {
  const [highlights, setHighlights] = useState([""]);
  const [credentials, setCredentials] = useState([
    { label: "Username / ID", value: "" },
    { label: "Password", value: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [subcategory, setSubcategory] = useState("");
  const [type, setType] = useState("");
  const fileInputRef = useRef(null);

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const cat = getCategory(category);
  const group = getGroup(category, subcategory);

  const addField = () => setHighlights([...highlights, ""]);
  const removeField = (index) => highlights.length > 1 && setHighlights(highlights.filter((_, i) => i !== index));
  const updateField = (index, value) => setHighlights(highlights.map((h, i) => (i === index ? value : h)));

  const addCredential = () => setCredentials([...credentials, { label: "", value: "" }]);
  const removeCredential = (i) => credentials.length > 1 && setCredentials(credentials.filter((_, idx) => idx !== i));
  const updateCredential = (i, key, value) =>
    setCredentials(credentials.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const uploadToImgBB = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("ImgBB API key is missing. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local or skip the image.");

    const body = new FormData();
    body.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body });
    const result = await response.json();
    if (!result.success) throw new Error("Image upload failed");
    return result.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Log in to publish a listing.");
      return;
    }
    if (cat.groups.length > 0 && !subcategory) {
      toast.error("Choose a sub-category.");
      return;
    }
    if (group?.items.length > 0 && !type) {
      toast.error("Choose a type.");
      return;
    }

    const filledCredentials = credentials
      .map((c) => ({ label: c.label.trim(), value: c.value.trim() }))
      .filter((c) => c.label && c.value);
    if (filledCredentials.length === 0) {
      toast.error("Add the account access details (for example username and password).");
      return;
    }

    setIsSubmitting(true);
    const form = e.target;
    const formData = new FormData(form);
    const imageFile = formData.get("imageFile");
    const toastId = toast.loading("Submitting listing…");

    try {
      let hostedImageUrl = "";
      if (imageFile && imageFile.size > 0) {
        toast.loading("Uploading image…", { id: toastId });
        hostedImageUrl = await uploadToImgBB(imageFile);
      }

      const newListing = {
        title: formData.get("title"),
        image: hostedImageUrl,
        category,
        subcategory,
        type,
        description: formData.get("description"),
        price: Number(formData.get("price")),
        quantity: formData.get("quantity") ? Number(formData.get("quantity")) : null,
        accountAge: formData.get("accountAge") || "",
        verified: formData.get("verified") === "on",
        highlights: highlights.filter((h) => h.trim() !== ""),
        authorId: user.id,
        authorName: user.name || "Seller",
        authorEmail: user.email || "",
        credentials: filledCredentials, // private: encrypted on the server, shown only to the buyer after payment
        status: "active",
      };

      toast.loading("Saving listing…", { id: toastId });
      const res = await CreateListing(newListing);

      if (res?.insertedId || res?.success) {
        toast.success("Submitted. It goes live after an admin approves it.", { id: toastId, duration: 5000 });
        form.reset();
        setHighlights([""]);
        setCredentials([
          { label: "Username / ID", value: "" },
          { label: "Password", value: "" },
        ]);
        setImagePreview(null);
        setSubcategory("");
        setType("");
      } else {
        toast.error("Could not submit the listing.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      if (error.errorCode === "LIMIT_REACHED") {
        toast.error(error.message || "Plan limit reached.", { id: toastId, duration: 4000 });
        setTimeout(() => router.push("/pricing"), 1500);
      } else {
        toast.error(error.message || "An unexpected error occurred.", { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-neutral-200 bg-white"
      >
        <div className="border-b border-neutral-100 px-8 py-10 sm:px-12">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">List an account</h1>
          <p className="mt-2 max-w-xl text-neutral-600">
            Only list accounts you own. The title, description and highlights are public. Put login details only in the private access details section below. New listings go live after an admin approves them.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            {/* Image */}
            <div className="space-y-3 lg:col-span-2">
              <label className="block text-sm font-bold">Cover image (optional)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex aspect-4/3 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                  imagePreview ? "border-transparent" : "border-neutral-300 hover:border-black"
                }`}
              >
                {imagePreview ? (
                  <>
                    <Image fill unoptimized src={imagePreview} alt="Preview" className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Change image
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                      <BiImageAdd className="text-3xl" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-700">Click to upload</p>
                    <p className="mt-1 text-xs text-neutral-400">PNG or JPG, up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basics */}
            <div className="space-y-6 lg:col-span-3">
              <div className="space-y-2">
                <label className="block text-sm font-bold" htmlFor="title">Title</label>
                <input id="title" name="title" required disabled={isSubmitting} className={inputClass} placeholder="e.g. 5-year-old Gmail, clean history" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-sm font-bold" htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory("");
                      setType("");
                    }}
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold" htmlFor="subcategory">Sub-category</label>
                  <select
                    id="subcategory"
                    value={subcategory}
                    disabled={isSubmitting || cat.groups.length === 0}
                    onChange={(e) => {
                      setSubcategory(e.target.value);
                      setType("");
                    }}
                    className={inputClass}
                  >
                    <option value="">{cat.groups.length ? "Select…" : "None yet"}</option>
                    {cat.groups.map((g) => (
                      <option key={g.slug} value={g.slug}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold" htmlFor="type">Type</label>
                  <select
                    id="type"
                    value={type}
                    disabled={isSubmitting || !group || group.items.length === 0}
                    onChange={(e) => setType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">{group?.items.length ? "Select…" : "Not needed"}</option>
                    {group?.items.map((i) => (
                      <option key={i.slug} value={i.slug}>{i.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-neutral-100" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-bold" htmlFor="price">Price (USD)</label>
              <div className="relative">
                <BiDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-neutral-400" />
                <input id="price" name="price" type="number" step="0.01" min="0.5" required disabled={isSubmitting} className={`${inputClass} pl-11`} placeholder="25.00" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold" htmlFor="quantity">Followers / quantity</label>
              <input id="quantity" name="quantity" type="number" min="0" disabled={isSubmitting} className={inputClass} placeholder="e.g. 10000" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold" htmlFor="accountAge">Account age</label>
              <input id="accountAge" name="accountAge" disabled={isSubmitting} className={inputClass} placeholder="e.g. 4 years" />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium">
            <input type="checkbox" name="verified" disabled={isSubmitting} className="h-4 w-4 accent-black" />
            This account has a verified badge
          </label>

          <div className="space-y-2">
            <label className="block text-sm font-bold" htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={5} required disabled={isSubmitting} className={`${inputClass} resize-none`} placeholder="Describe the account: what it is, how it was used, and anything the buyer should know." />
          </div>

          {/* Highlights */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">What the buyer gets</h3>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">{highlights.length} items</span>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {highlights.map((h, index) => (
                  <motion.div
                    key={`h-${index}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3"
                  >
                    <input
                      value={h}
                      disabled={isSubmitting}
                      onChange={(e) => updateField(index, e.target.value)}
                      className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10"
                      placeholder="e.g. Original email and recovery access"
                    />
                    <button
                      type="button"
                      aria-label="Remove item"
                      disabled={isSubmitting || highlights.length === 1}
                      onClick={() => removeField(index)}
                      className="rounded-xl p-3 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={addField}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 py-3 font-semibold text-neutral-500 transition-all hover:border-black hover:text-black"
            >
              + Add item
            </button>
          </div>

          {/* Private access details */}
          <div className="space-y-5 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                <BiLock className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Private access details</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Login ID, password, recovery email, 2FA codes, or anything else the buyer needs. These are stored
                  encrypted. Nobody sees them (not even admins) until a buyer has paid. They appear only in the buyer&apos;s dashboard.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {credentials.map((c, index) => (
                <div key={`c-${index}`} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={c.label}
                    disabled={isSubmitting}
                    onChange={(e) => updateCredential(index, "label", e.target.value)}
                    maxLength={60}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 sm:w-1/3"
                    placeholder="Label (e.g. Password)"
                  />
                  <input
                    value={c.value}
                    disabled={isSubmitting}
                    onChange={(e) => updateCredential(index, "value", e.target.value)}
                    maxLength={2000}
                    autoComplete="off"
                    className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 font-mono text-sm outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    aria-label="Remove detail"
                    disabled={isSubmitting || credentials.length === 1}
                    onClick={() => removeCredential(index)}
                    className="self-start rounded-xl p-3 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                  >
                    <BiTrash className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={addCredential}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 py-3 font-semibold text-neutral-500 transition-all hover:border-black hover:text-black"
            >
              + Add detail
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 text-lg font-bold text-white transition-all hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <BiLoaderAlt className="animate-spin text-2xl" /> Submitting…
                </>
              ) : (
                <>
                  <BiSave className="text-2xl" /> Submit for approval
                </>
              )}
            </button>
            <p className="mt-4 text-center text-sm text-neutral-400">An admin reviews every listing before it goes live. Once the account is bought it is removed from the site.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function FormFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <BiLoaderAlt className="animate-spin text-5xl text-black" />
    </div>
  );
}

export default function AddListingPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <ListingForm />
    </Suspense>
  );
}
