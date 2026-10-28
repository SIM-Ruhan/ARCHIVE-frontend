'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function BlockButton({ userId, isBlocked, role }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const isAdmin = role === 'admin';

  const handleToggleBlock = async () => {
    if (loading || isPending || isAdmin) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/toggle-block`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isBlocked: !isBlocked,
          }),
        }
      );

      if (response.ok) {
        startTransition(() => {
          router.refresh();
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          'Failed to change block state:',
          errorData.message || response.statusText
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleBlock}
      disabled={loading || isPending || isAdmin}
      className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition duration-200
        ${
          isAdmin
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : isBlocked
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-50 text-red-600 hover:bg-red-100'
        }
        disabled:opacity-70`}
    >
      {isAdmin
        ? 'Admin'
        : loading || isPending
        ? 'Processing...'
        : isBlocked
        ? 'Unblock'
        : 'Block'}
    </button>
  );
}