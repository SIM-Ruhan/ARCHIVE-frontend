
"use server"
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.session?.token || null;
};

export const authHeader = async () => {
  const token = await getUserToken();
  return token ? { authorization: `Bearer ${token}` } : {};
};

export const serverFetch = async (path, options = {}) => {
  const res = await fetch(`${baseURL}${path}`, options);
  console.log(path, res.status);

  if (!res.ok) {
    console.error("serverFetch failed:", res.status, await res.text());
    return null;
  }

  return await res.json();
};

export const serverMutation = async (path, data) => {
  const res = await fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Mutation failed");
  }

  return result;
};