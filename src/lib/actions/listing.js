"use client";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const CreateListing = async (newListingData) => {
  const res = await fetch(`${baseURL}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newListingData),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.details || data.message || "Failed to create listing");
    error.errorCode = data.message; // e.g. "LIMIT_REACHED"
    throw error;
  }

  return data;
};
