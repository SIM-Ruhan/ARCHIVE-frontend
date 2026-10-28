import { NextResponse } from "next/server";
import { adminOnly } from "@/lib/core/adminApi";
import { internalFetch } from "@/lib/core/internal";

// Admin: list every listing (pending, approved, sold) with counts
export async function GET(request) {
  const { error } = await adminOnly();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const qs = new URLSearchParams();
  for (const key of ["page", "limit", "filter", "search"]) {
    if (searchParams.get(key)) qs.set(key, searchParams.get(key));
  }

  const res = await internalFetch(`/api/admin/listings?${qs.toString()}`);
  const data = await res.json().catch(() => ({ success: false, message: "Bad response from server" }));
  return NextResponse.json(data, { status: res.status });
}
