"use client"
import Link from 'next/link';
import React from 'react';

export default function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-5 font-sans">
      <div className="text-center max-w-xl w-full bg-white p-12 rounded-3xl shadow-sm border border-red-100">
        
        {/* Alert Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 stroke-red-500 fill-none stroke-2" 
            viewBox="0 0 24 24" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-red-800 mb-4">
          Something went wrong
        </h1>
        
        <p className="text-gray-600 text-base leading-relaxed mb-8">
          Our servers are having a minor meltdown. We&apos;ve been notified and are looking into it. Please try refreshing the page or head back home.
        </p>
        
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <button 
            onClick={handleRefresh}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-7 py-3 rounded-xl transition-colors duration-200"
          >
            Refresh Page
          </button>
          
          <Link
            href="/" 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-7 py-3 rounded-xl transition-colors duration-200 border border-gray-200 text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}