import { getListingId, getListingStatus } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { BiChevronLeft, BiCheck } from "react-icons/bi";
import { notFound } from "next/navigation";
import ListingActionPanel from "./ListingActionPanel";
import { getUserSession } from "@/lib/core/session";
import { LogoMark } from "@/components/Logo";
import { labelFor } from "@/lib/categories";

const ListingDetailsPage = async ({ params }) => {
  const { id } = await params;
  const listing = await getListingId(id);

  if (!listing) notFound();

  const user = await getUserSession();
  const userId = user?.id || null;
  const status = userId ? await getListingStatus(id, userId) : { isLiked: false, isSaved: false };

  const {
    _id,
    title,
    image,
    category,
    subcategory,
    type,
    description,
    highlights = [],
    quantity,
    accountAge,
    verified,
    authorId,
    authorName,
    likesCount,
    price = 0,
  } = listing;

  const facts = [
    { label: "Seller", value: authorName },
    quantity ? { label: "Followers / quantity", value: Number(quantity).toLocaleString() } : null,
    accountAge ? { label: "Account age", value: accountAge } : null,
    verified ? { label: "Verified badge", value: "Yes" } : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/browse"
            className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-black"
          >
            <BiChevronLeft className="text-xl transition-transform group-hover:-translate-x-0.5" /> Back to browse
          </Link>
          <span className="rounded-md bg-white px-2.5 py-1 font-mono text-xs text-neutral-500 border border-neutral-200">
            ID {(_id || id).toString().substring(0, 8).toUpperCase()}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: media + details */}
          <div className="lg:col-span-7">
            <div className="relative h-72 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 md:h-96">
              {image ? (
                <Image unoptimized src={image} alt={title} fill className="object-cover" priority />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <LogoMark size={88} />
                </div>
              )}
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-neutral-500">{labelFor({ category, subcategory, type })}</p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{title}</h1>

              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                    <dt className="text-xs text-neutral-500">{f.label}</dt>
                    <dd className="mt-0.5 truncate font-semibold">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-10 text-xl font-bold">About this listing</h2>
              {description ? (
                <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-neutral-700">{description}</p>
              ) : (
                <p className="mt-3 text-sm italic text-neutral-500">The seller has not added a description.</p>
              )}

              {highlights.length > 0 && (
                <>
                  <h2 className="mt-10 text-xl font-bold">What you get</h2>
                  <ul className="mt-3 space-y-2">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-neutral-700">
                        <BiCheck className="mt-0.5 shrink-0 text-xl text-black" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Right: purchase panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <ListingActionPanel
                listingId={(_id || id).toString()}
                initialLikes={likesCount || 0}
                initialIsLiked={status?.isLiked || false}
                initialIsSaved={status?.isSaved || false}
                price={price}
                userId={userId}
                isOwner={!!userId && userId === authorId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
