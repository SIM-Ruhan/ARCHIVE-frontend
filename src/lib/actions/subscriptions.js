//  "use server"

// import { serverMutation } from "../core/server"

// export const createSubscription = async (subInfo) => {
//     return serverMutation("/api/subscriptions",subInfo)
// }

// export async function createPurchase({ userId, listingId, price }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId, listingId, price }),
//   });
//   return res.json();
// }
