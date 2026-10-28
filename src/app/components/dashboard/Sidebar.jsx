"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// Auth
import { authClient } from "@/lib/auth-client";

// Icons (Adjust imports based on your actual installed icon libraries)
import Logo from "@/components/Logo";
import { BiMoney, BiStar, BiPurchaseTag, BiPlus, BiMapAlt, BiListUl, BiError, BiLike, BiHomeCircle} from "react-icons/bi";
import { ChartArea, User2 } from "lucide-react"; // Assuming these are from lucide-react
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout } from "react-icons/hi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fetch session data
  const { data: session, isPending } = authClient.useSession();
  
  // Safely get user data and role, defaulting to a basic role if not fully loaded
  const user = session?.user;
  const role = user?.role; 

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Role-based Navigation Mapping
  const dashboardItems = {
    seller: [
      { icon: ChartArea, label: "Overview", link: "/dashboard/seller" },
      { icon: BiPlus, label: "Add listing", link: "/dashboard/seller/add-listing" },
      { icon: BiListUl, label: "My listings", link: "/dashboard/seller/myListings" },
      { icon: BiStar, label: "Favourite", link: "/dashboard/seller/Favourite" },
            { icon: BiLike, label: "Liked Listing", link: "/dashboard/seller/likedListings" },
      { icon: BiPurchaseTag, label: "Purchased", link: "/dashboard/seller/Purchased" },
      { icon: BiMapAlt, label: "Profile", link: "/dashboard/seller/transaction" },
    ],
    user: [
      { icon: ChartArea, label: "Overview", link: "/dashboard/user" },
      { icon: BiPurchaseTag, label: "My orders", link: "/dashboard/user/orders" },
      { icon: BiLike, label: "Liked accounts", link: "/dashboard/user/liked" },
      { icon: BiStar, label: "Saved accounts", link: "/dashboard/user/saved" },
      { icon: BiMapAlt, label: "Profile", link: "/dashboard/user/transaction" },
    ],
    admin: [
      { icon: ChartArea, label: "Overview", link: "/dashboard/admin" },
      { icon: User2, label: "Total users", link: "/dashboard/admin/totalUsers" },
      { icon: BiListUl, label: "Total listings", link: "/dashboard/admin/totalListings" },
      { icon: BiListUl, label: "Premium members", link: "/dashboard/admin/premiumMembers" },
      { icon: BiError, label: "Total reports", link: "/dashboard/admin/totalreports" },
      { icon: BiMoney, label: "Transactions", link: "/dashboard/admin/transactions" },
      { icon: BiHomeCircle, label: "Profile", link: "/dashboard/admin/transaction" },
    ],
  };

  const navItems = dashboardItems[role] || dashboardItems.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        }
      }
    });
  };

  return (
    <>
      {/* Mobile Header & Hamburger Menu */}
      <div className="lg:hidden w-full shrink-0 flex items-center justify-between border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <Logo size={32} />
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-500 hover:text-black focus:outline-none p-1"
        >
          <HiOutlineMenu className="h-7 w-7" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col h-screen shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 shrink-0">
          <Logo size={32} />

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-red-500 p-1"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>

        {/* Dynamic User Mini-Profile Widget */}
        <div className="px-6 py-6 border-b border-gray-50 shrink-0 min-h-25">
          {isPending ? (
            // Loading skeleton for user profile
            <div className="animate-pulse flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Image unoptimized
                  src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=047857&color=fff`}
                  alt={user.name || "User"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-neutral-300 h-12 w-12"
                />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-neutral-900 ring-2 ring-white"></span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">
                  {user.name}
                </p>
           {user?.plan === "seller_starter" ||
user?.plan === "seller_master" ||
user?.plan === "seller_pro" ? (
  <p className="text-xs font-medium text-yellow-700 bg-yellow-100 inline-block px-2 py-0.5 rounded-full mt-1 border border-yellow-400 capitalize truncate max-w-full">
    Premium Dashboard
  </p> 
) : (
  <div className="">
  <p className="text-xs font-medium text-neutral-900 bg-neutral-100 inline-block px-2 py-0.5 rounded-full mt-1 border border-neutral-300 capitalize truncate max-w-full">
    {user?.role} Dashboard
  </p>
  <div className="">
    <Link href={"/pricing"} className="text-xs font-medium text-yellow-600 bg-yellow-50 inline-block px-2 py-0.5 rounded mt-1 border border-yellow-400">+ Get Premium</Link>
  </div>
  </div>
)}
                
              </div>
            </div>
          ) : null}
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {!isPending && navItems.map((item, index) => {
            const isActive = pathname === item.link;
            const Icon = item.icon; // Component reference
            return (
              <Link
                key={index}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900 shadow-sm border border-neutral-300/50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-neutral-900" : "text-gray-400 group-hover:text-black"
                  }`}
                />
                <span className={`font-semibold text-sm ${isActive ? "text-neutral-900" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group"
          >
            <HiOutlineLogout className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
            <span className="font-semibold text-sm">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;