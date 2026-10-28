import Link from 'next/link';
import React from 'react';

const unAuthorizedPage= () => {
    return (
       <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Visual Anchor Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>

        <p className="mt-4 text-base font-semibold text-red-500">401 Error</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Access Denied
        </h1>
        <p className="mt-6 text-base leading-7 text-slate-400 max-w-md">
          You are not authenticated to view this content. Please log in with an authorized account to continue.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/" 
            className="text-sm border px-4 py-2.5 rounded-md font-semibold text-slate-300 hover:text-white transition-colors"
          >  Back to Home &rarr;
          </Link>
        </div>
      </div>
    </main>
    );
};

export default unAuthorizedPage;