import { serverFetch } from '@/lib/core/server';
import React from 'react';
import Image from 'next/image';
import BlockButton from './BlockButton';

const getUsers = async () => {
  const res = await serverFetch("/api/users");
  return res || [];
};

// Helper function to handle badge styling based on the plan
const getPlanBadge = (plan) => {
  const normalizedPlan = plan ? plan.toLowerCase() : 'free';

  switch (normalizedPlan) {
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
    case 'free':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 capitalize">
          {plan || 'Free'}
        </span>
      );
  }
};

const ManageUsersPage = async () => {
  const users = await getUsers();

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Users 👥</h1>
        <p className="text-sm text-gray-500">Block/unblock users and manage roles</p>
      </div>

      <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 text-xs font-semibold uppercase">User</th>
              <th className="p-4 text-xs font-semibold uppercase">Role</th>
              <th className="p-4 text-xs font-semibold uppercase">Package</th>
              <th className="p-4 text-xs font-semibold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user._id || user.email} className="hover:bg-gray-50/50">
                <td className="p-4 flex items-center gap-3">
                  <Image unoptimized
                    src={user.image || 'https://via.placeholder.com/40'}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{user.name}</h3>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </td>
                <td className="p-4 text-sm capitalize">{user.role}</td>
                <td className="p-4 text-sm">
                  {getPlanBadge(user.plan)}
                </td>
                <td className="p-4 text-right">
                  <BlockButton userId={user._id} isBlocked={user.isBlocked} role={user.role}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;