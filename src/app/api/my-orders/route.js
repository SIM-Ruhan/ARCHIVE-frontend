import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { internalFetch } from "@/lib/core/internal";

export const dynamic = "force-dynamic";

// The logged-in buyer's orders, including the private account access details.
// The user id comes from the session, never from the request, so nobody can read another buyer's details.
export async function GET() {
  const user = await getUserSession();
  if (!user) return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });

  const res = await internalFetch(`/api/internal/users/${encodeURIComponent(user.id)}/orders`);
  const data = await res.json().catch(() => ({ success: false, message: "Bad response from server" }));
  return NextResponse.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
}
