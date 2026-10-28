// "use client";

// import { authClient } from "@/lib/auth-client";
// import Image from "next/image";
// import Link from "next/link";

// const MyProfile = () => {
//   const { data: session, isLoading } = authClient.useSession();
//   const user = session?.user;

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <span className="loading loading-spinner text-error"></span>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="text-center p-10">
//         <p className="text-xl font-semibold">You are not logged in</p>
//         <Link href="/login" className="btn mt-4">
//           Login
//         </Link>
//       </div>
//     );
//   }

//   return (
//    <div className="w-80 md:w-[40%] mx-auto px-4 py-8 animate__animated animate__fadeIn">
//   <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>

//   <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
    
//     {/* Profile Image */}
//     <div className="w-32 h-32 mb-4">
//       <Image
//         src={user?.image}
//         alt="profile"
//         width={128}
//         height={128}
//         className="w-full h-full object-cover rounded-full border-4 border-gray-100 shadow-sm"
//         referrerPolicy="no-referrer"
//         unoptimized
//       />
//     </div>

//     {/* Name */}
//     <h2 className="text-xl md:text-2xl font-bold mt-2">
//       {user?.name}
//     </h2>

//     {/* Email */}
//     <p className="text-gray-500 mt-1">
//       Mail: {user?.email}
//     </p>



//     {/* Button */}
//     <Link href="/dashboard/seller/transaction/update">
//       <button className="w-full md:w-auto mt-4 px-6 py-2 btn btn-soft btn-info">
//         Update Profile
//       </button>
//     </Link>
//   </div>
// </div>
//   );
// };

// export default MyProfile;



"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { BiCheckCircle, BiCalendar, BiShield } from "react-icons/bi";

const PLAN_CONFIG = {
  seller_starter: { label: "Starter",  badgeClass: "badge-info" },
  seller_pro:     { label: "Pro",      badgeClass: "badge bg-yellow-200 border border-yellow-400"},
  seller_master:  { label: "Master",   badgeClass: "badge bg-yellow-300 border border-yellow-500" },
};

const formatJoinDate = (dateValue) => {
  if (!dateValue) return null;
  const raw = typeof dateValue === "object" && dateValue?.$date ? dateValue.$date : dateValue;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

const MyProfile = () => {
  const { data: session, isLoading } = authClient.useSession();
  const user = session?.user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10">
        <p className="text-xl font-semibold">You are not logged in</p>
        <Link href="/login" className="btn mt-4">
          Login
        </Link>
      </div>
    );
  }

  const plan = PLAN_CONFIG[user?.plan] || { label: user?.plan || "Free", badgeClass: "badge-neutral" };
  const joinDate = formatJoinDate(user?.createdAt);

  return (
    <div className="w-80 md:w-[40%] mx-auto px-4 py-8 animate__animated animate__fadeIn">
      <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>

      <div className="relative bg-base-100 rounded-2xl shadow-lg overflow-hidden">

        {/* Cover / banner */}
        <div className="h-24 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20" />

        <div className="flex flex-col items-center text-center px-8 pb-8">

          {/* Profile Image */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full ring-4 ring-base-100 shadow-md overflow-hidden bg-base-200">
              <Image
                src={user?.image}
                alt="profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>
            {user?.emailVerified && (
              <div
                className="absolute bottom-1 right-1 bg-base-100 rounded-full p-0.5 shadow"
                title="Email verified"
              >
                <BiCheckCircle className="w-6 h-6 text-success" />
              </div>
            )}
          </div>

          {/* Name */}
          <h2 className="text-xl md:text-2xl font-bold">{user?.name}</h2>

          {/* Email */}
          <p className="text-base-content/60 mt-1 text-sm">{user?.email}</p>

          {/* Badges: Role + Plan */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {user?.role && (
              <span className="badge border border-green-400 bg-green-200 gap-1 capitalize">
                <BiShield className="w-3.5 h-3.5" />
                {user.role}
              </span>
            )}
            <span className={`badge ${plan.badgeClass} gap-1 font-semibold`}>
              Plan: {plan.label} 
            </span>
            {user?.isBlocked && (
              <span className="badge badge-error gap-1">Blocked</span>
            )}
          </div>

          {/* Meta info */}
          {joinDate && (
            <div className="flex items-center gap-1.5 text-xs text-base-content/50 mt-4">
              <BiCalendar className="w-4 h-4" />
              <span>Joined {joinDate}</span>
            </div>
          )}

          {/* Divider */}
          <div className="w-full border-t border-base-300 my-6" />

          {/* Button — untouched */}
          <Link href={`/dashboard/${user?.role}/transaction/update`}>
            <button className="w-full md:w-auto mt-4 px-6 py-2 btn btn-soft btn-info border border-blue-300">
              Update Profile
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;