"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BiShieldQuarter } from "react-icons/bi";
import { getAdminStats } from "@/lib/api";

const STAT_CARDS = [
  { key: "totalUsers",      label: "Total Users",      emoji: "👥", color: "text-blue-600" },
  { key: "totalListings",    label: "Total Listings",    emoji: "📋", color: "text-orange-500" },
  { key: "premiumMembers",  label: "Premium Members",  emoji: "👑", color: "text-purple-600" },
  { key: "pendingReports",  label: "Pending Reports",  emoji: "🚨", color: "text-rose-500" },
];

const QUICK_ACTIONS = [
  { label: "Manage Users",   emoji: "👤", href: "/dashboard/admin/totalUsers" },
  { label: "Manage Listings", emoji: "📄", href: "/dashboard/admin/totalListings" },
  { label: "Review Reports", emoji: "🛡️", href: "/dashboard/admin/totalreports" },
  { label: "Transactions",   emoji: "💳", href: "/dashboard/admin/transactions" },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data?.success ? data : null);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          Admin Overview <BiShieldQuarter className="text-red-400 w-7 h-7" />
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Platform statistics and management</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center"
          >
            <span className="text-3xl mb-3">{card.emoji}</span>
            {isLoading ? (
              <div className="h-8 w-10 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <span className={`text-3xl font-extrabold ${card.color}`}>
                {stats?.[card.key] ?? "—"}
              </span>
            )}
            <span className="text-sm text-gray-400 mt-1">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold transition-colors"
            >
              <span>{action.emoji}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}