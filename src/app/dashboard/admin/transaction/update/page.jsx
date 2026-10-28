"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UpdateProfile = () => {
  const { data: session, isLoading } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [updating, setUpdating] = useState(false);

  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const image = formData.get("image");

    const { error } = await authClient.updateUser({
      name,
      image,
    });

    setUpdating(false);

    if (!error) {
      router.push("/dashboard/seller/transaction");
    } else {
      alert("Update failed");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 animate__animated animate__fadeInUp">
      <h1 className="text-3xl font-bold mb-6">Update Profile</h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-4 p-6 rounded-xl shadow-xl"
      >
        
        <div>
          <label className="font-semibold">Name</label>
          <input
            name="name"
            defaultValue={user?.name}
            className="border p-2 w-full rounded"
            required
          />
        </div>

      
        <div>
          <label className="font-semibold">Image URL</label>
          <input
            name="image"
            defaultValue={user?.image}
            className="border p-2 w-full rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        
        <button
          disabled={updating}
          className="btn btn-success w-full"
        >
          {updating ? "Updating..." : "Update Information"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;