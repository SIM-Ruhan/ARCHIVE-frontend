import { serverFetch } from "./core/server";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL ;


export const getListing = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/listings${queryString ? `?${queryString}` : ""}`;
    return serverFetch(url);
}

export const getListingId = async(listingId) => {
    return serverFetch(`/api/listings/${listingId}`);
}

export const getCompanyListing = async({authorId, status = "active"}) => {

const res = await fetch(`${baseURL}/api/listings?authorId=${authorId}&status=${status}`)
console.log(baseURL)
console.log(authorId)
return res.json();
}

export async function getListingStatus(listingId, userId) {
    if (!userId) return { isLiked: false, isSaved: false };
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/listings/${listingId}/status?userId=${userId}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return { isLiked: false, isSaved: false };
        return res.json();
    } catch (error) {
        console.error("Failed to fetch listing status", error);
        return { isLiked: false, isSaved: false };
    }
}

export const getSellerStats = async (authorId) => {
  const res = await fetch(`${baseURL}/api/listings/stats/${authorId}`);
  return res.json();
};

export const getAdminReports = async (status = "pending") => {
  const res = await fetch(`${baseURL}/api/admin/reports?status=${status}`, { cache: "no-store" });
  return res.json();
};

export const dismissReport = async (reportId) => {
  const res = await fetch(`${baseURL}/api/admin/reports/${reportId}/dismiss`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Dismiss failed");
  return res.json();
};

export const removeReportedListing = async (reportId) => {
  const res = await fetch(`${baseURL}/api/admin/reports/${reportId}/remove-listing`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Remove failed");
  return res.json();
};

export const getAdminStats = async () => {
  const res = await fetch(`${baseURL}/api/admin/stats`, { cache: "no-store" });
  return res.json();
};

export const getAdminTransactions = async () => {
  const res = await fetch(`${baseURL}/api/admin/transactions`, { cache: "no-store" });
  return res.json();
};


    