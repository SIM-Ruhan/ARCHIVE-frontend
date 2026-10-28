import Link from "next/link";
import React from "react";

const DashNavbar = () => {
  return (
    <div className="flex items-center space-x-8 font-semibold">
      <Link href="/" className="hover:text-neutral-500">
        Home
      </Link>
      <Link href="/browse" className="hover:text-neutral-500">
        Browse listings
      </Link>
    </div>
  );
};

export default DashNavbar;
