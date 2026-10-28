// "use server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function getUserPlan(userId) {
//   const db = await connectToDatabase();
//   const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
//   return user?.plan || "free";
// }