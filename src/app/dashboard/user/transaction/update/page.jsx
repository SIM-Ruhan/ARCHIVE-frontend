"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function UpdateUserProfile() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !user) router.push("/login");
  }, [user, isPending, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const { error } = await authClient.updateUser({
      name: form.get("name"),
      image: form.get("image"),
    });
    setUpdating(false);
    if (error) setError(error.message || "Update failed");
    else router.push("/dashboard/user/transaction");
  };

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Update profile</h1>
      <form onSubmit={handleUpdate} className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
        <div>
          <label className="font-semibold">Name</label>
          <input name="name" defaultValue={user.name} required className="mt-1 w-full rounded-xl border border-neutral-300 p-3" />
        </div>
        <div>
          <label className="font-semibold">Image URL</label>
          <input name="image" defaultValue={user.image || ""} placeholder="https://example.com/photo.jpg" className="mt-1 w-full rounded-xl border border-neutral-300 p-3" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={updating} className="w-full rounded-full bg-black py-3 font-semibold text-white hover:bg-neutral-800 disabled:opacity-60">
          {updating ? "Updating..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
