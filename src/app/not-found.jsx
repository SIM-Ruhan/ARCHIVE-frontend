import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 font-sans">
      <div className="text-center max-w-lg w-full">
        {/* Floating 404 text */}
        <div className="text-8xl font-extrabold text-indigo-600 mb-4 inline-block animate-[bounce_4s_ease-in-out_infinite]">
          404
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Lost in Space?
        </h1>
        
        <p className="text-gray-500 text-lg leading-relaxed mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let&apos;s get you back on track.
        </p>
        
        <Link
          href="/" 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-200 active:translate-y-0"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}