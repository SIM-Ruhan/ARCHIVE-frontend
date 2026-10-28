// One place that decides what state a listing is in.
//   sold     -> bought, hidden everywhere
//   approved -> live on the site
//   pending  -> waiting for admin approval (also used for "sent back to review")
export const getListingState = (listing) => {
  if (listing?.sold) return "sold";
  if (listing?.approvalStatus === "approved") return "approved";
  return "pending";
};

export const STATE_LABEL = { pending: "Pending approval", approved: "Live", sold: "Sold" };
