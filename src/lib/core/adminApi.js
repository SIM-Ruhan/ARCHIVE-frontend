import "server-only";
import { NextResponse } from "next/server";
import { getUserSession } from "./session";

// For API routes: returns { user } for an admin, or { error: <Response> } to return straight away.
export const adminOnly = async () => {
  const user = await getUserSession();
  if (!user) return { error: NextResponse.json({ success: false, message: "Login required" }, { status: 401 }) };
  if (user.role !== "admin") {
    return { error: NextResponse.json({ success: false, message: "Admins only" }, { status: 403 }) };
  }
  return { user };
};