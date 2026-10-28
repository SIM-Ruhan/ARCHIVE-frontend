"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import Logo from "@/components/Logo";
import { CATEGORIES, browseHref } from "@/lib/categories";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  if (pathname.includes("dashboard")) return null;

  const social = [
    { label: "Facebook", Icon: FaFacebookF },
    { label: "X", Icon: FaXTwitter },
    { label: "Instagram", Icon: FaInstagram },
    { label: "LinkedIn", Icon: FaLinkedinIn },
  ];

  return (
    <footer className="bg-black pb-8 pt-16 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo inverted />
            <p className="max-w-xs text-sm leading-relaxed">
              A marketplace for unused social media, gaming and marketplace accounts.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={browseHref({ category: c.slug })} className="transition-colors hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Seller plans</Link></li>
              <li><Link href="/login" className="hover:text-white">Log in</Link></li>
              <li><Link href="/registration" className="hover:text-white">Create account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
            <p className="mb-4 flex items-center gap-3 text-sm">
              <HiOutlineMail className="h-5 w-5 shrink-0" />
              <a href="mailto:support@archive.example" className="hover:text-white">support@archive.example</a>
            </p>
            <div className="flex gap-3">
              {social.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-neutral-300 transition-colors hover:bg-white hover:text-black"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 text-xs text-neutral-500 sm:flex-row">
          <p>&copy; {currentYear} ARCHIVE. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300">Privacy policy</a>
            <a href="#" className="hover:text-neutral-300">Terms of service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
