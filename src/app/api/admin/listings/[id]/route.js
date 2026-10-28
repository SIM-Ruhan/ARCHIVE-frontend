import { NextResponse } from "next/server";
import { adminOnly } from "@/lib/core/adminApi";
import { internalFetch } from "@/lib/core/internal";

// Admin: approve / send back to pending, feature / unfeature
export async function PATCH(request, { params }) {
  const { error } = await adminOnly();
  if (error) return error;
  const { id } = await params;

  const body = await request.json().catch(() => ({}));
  const payload = {};
  if (body.approvalStatus !== undefined) payload.approvalStatus = body.approvalStatus;
  if (body.isFeatured !== undefined) payload.isFeatured = !!body.isFeatured;

  const res = await internalFetch(`/api/admin/listings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({ success: false }));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_request, { params }) {
  const { error } = await adminOnly();
  if (error) return error;
  const { id } = await params;

  const res = await internalFetch(`/api/admin/listings/${encodeURIComponent(id)}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({ success: false }));
  return NextResponse.json(data, { status: res.status });
}
