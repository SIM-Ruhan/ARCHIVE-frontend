import { getListingState, STATE_LABEL } from "@/lib/listingState";

const STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  sold: "bg-black text-white border-black",
};
const DOT = { pending: "bg-amber-500", approved: "bg-emerald-500", sold: "bg-white" };

export default function ReviewBadge({ listing, className = "" }) {
  const state = getListingState(listing);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${STYLES[state]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[state]}`} />
      {STATE_LABEL[state]}
    </span>
  );
}
