import { requireRole } from "@/lib/core/session";

// Only accounts with role "user" (buyers) can open /dashboard/user/*
export default async function UserDashboardLayout({ children }) {
  await requireRole("user");
  return <>{children}</>;
}
