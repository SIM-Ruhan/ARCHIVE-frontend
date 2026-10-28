import { serverFetch } from '@/lib/core/server';
import React from 'react';
import Image from 'next/image';
import { MdOutlineWorkspacePremium } from "react-icons/md";

const getUsers = async () => {
  const res = await serverFetch("/api/users");
  return res || [];
};


const getPlanBadge = (plan) => {
  switch (plan) {
    case 'seller_starter':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
          Starter
        </span>
      );
    case 'seller_pro':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
          Pro
        </span>
      );
    case 'seller_master':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
          Master
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 capitalize">
          {plan}
        </span>
      );
  }
};

const PremiumUsers = async () => {
  const allUsers = await getUsers();

  // Filter out users whose plan is undefined, null, 'free', or empty
  const premiumUsers = allUsers.filter(
    (user) => user.plan && user.plan.toLowerCase() !== 'free'
  );

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-2xl font-bold">Premium Users</h1>
        <div className='text-xl font-bold bg-amber-300 rounded-full p-1 text-amber-900'>
          <MdOutlineWorkspacePremium />
        </div> 
      </div>

      <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Package</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {premiumUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-sm text-gray-400">
                  No premium users found.
                </td>
              </tr>
            ) : (
              premiumUsers.map((user) => (
                <tr key={user._id || user.email} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <Image 
                      unoptimized
                      src={user.image || 'https://via.placeholder.com/40'}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">{user.name}</h3>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm capitalize text-gray-600">{user.role}</td>
                  <td className="p-4 text-sm">
                    {getPlanBadge(user.plan)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PremiumUsers;
