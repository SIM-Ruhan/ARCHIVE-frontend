"use client";

import React, { useState, useEffect } from "react";
import { BiCreditCard, BiCrown, BiSearchAlt } from "react-icons/bi";
import { getAdminTransactions } from "@/lib/api";

const TYPE_CONFIG = {
  Premium: { icon: BiCrown,       badgeClass: "bg-purple-50 text-purple-700 border-purple-200" },
  Listing:  { icon: BiSearchAlt,   badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
};

const truncate = (str, len = 14) => {
  if (!str) return "—";
  return str.length > len ? `${str.slice(0, len)}...` : str;
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB"); 
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAdminTransactions();
        setTransactions(data?.success ? data.transactions : []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          Transactions <BiCreditCard className="w-7 h-7" />
        </h1>
        <p className="text-gray-400 mt-1 text-sm">All payment records on the platform</p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">

              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => {
                  const config = TYPE_CONFIG[tx.type];
                  const Icon = config?.icon;

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{tx.user}</td>
                      <td className="px-6 py-4">
                        {config ? (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {tx.type}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
                            Payment
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-neutral-900">
                        ${Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-900 border border-neutral-300 capitalize">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-400">
                        {truncate(tx.transactionId)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(tx.date)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}