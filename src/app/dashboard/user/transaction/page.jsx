"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { BiCalendar, BiShield } from "react-icons/bi";

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(typeof value === "object" && value?.$date ? value.$date : value);
  return isNaN(d.getTime())
    ? null
    : d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

export default function UserProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl font-semibold">You are not logged in</p>
        <Link href="/login" className="mt-4 inline-block rounded-full bg-black px-6 py-2.5 text-white">
          Log in
        </Link>
      </div>
    );
  }

  const joined = formatDate(user.createdAt);
  const avatar = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=000&color=fff`;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-extrabold tracking-tight">My profile</h1>
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        <div className="h-24 bg-black" />
        <div className="flex flex-col items-center px-8 pb-8 text-center">
          <div className="-mt-14 mb-4 h-28 w-28 overflow-hidden rounded-full bg-neutral-100 ring-4 ring-white">
            <Image src={avatar} alt="profile" width={112} height={112} className="h-full w-full object-cover" referrerPolicy="no-referrer" unoptimized />
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="mt-1 text-sm text-neutral-500">{user.email}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize">
              <BiShield className="h-3.5 w-3.5" /> {user.role}
            </span>
            {user.isBlocked && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Blocked</span>
            )}
          </div>

          {joined && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
              <BiCalendar className="h-4 w-4" /> Joined {joined}
            </p>
          )}

          <div className="my-6 w-full border-t border-neutral-200" />
          <Link
            href="/dashboard/user/transaction/update"
            className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Update profile
          </Link>
        </div>
      </div>
    </div>
  );
}
