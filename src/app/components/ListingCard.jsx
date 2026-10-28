import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BiHeart } from "react-icons/bi";
import { LogoMark } from "@/components/Logo";
import { getItem, getGroup, getCategory } from "@/lib/categories";

export default function ListingCard({ listing }) {
  if (!listing) return null;

  const {
    _id,
    title = "Untitled listing",
    image,
    category,
    subcategory,
    type,
    authorName = "Seller",
    likesCount = 0,
    price = 0,
  } = listing;

  const id = typeof _id === "object" && _id?.$oid ? _id.$oid : _id;
  const label =
    getItem(category, subcategory, type)?.name ||
    getGroup(category, subcategory)?.name ||
    getCategory(category)?.name ||
    "Account";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow duration-300 hover:shadow-xl">
      <Link href={`/browse/${id}`} className="relative block h-48 w-full overflow-hidden bg-neutral-100">
        {image ? (
          <Image
            unoptimized
            src={image}
            alt={title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <LogoMark size={56} />
          </div>
        )}
        <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-black shadow-sm">
          {label}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm">
          <BiHeart className="text-sm" /> {likesCount}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        
        <Link href={`/browse/${id}`}>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug">{title}</h3>
        </Link>

        <div className="mt-auto flex items-end justify-between pt-5">
          <p className="font-display text-2xl font-extrabold">${Number(price).toLocaleString()}</p>
          <Link
            href={`/browse/${id}`}
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
