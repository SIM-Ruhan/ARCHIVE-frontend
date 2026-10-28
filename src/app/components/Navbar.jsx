"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { HiMenu, HiX, HiChevronDown, HiChevronRight } from "react-icons/hi";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";
import { CATEGORIES, browseHref } from "@/lib/categories";

/* ---------- Desktop: nested flyout menu ---------- */
function CategoryMenu({ category }) {
  return (
    <li className="group/cat relative">
      <Link
        href={browseHref({ category: category.slug })}
        className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black group-focus-within/cat:bg-neutral-100 group-focus-within/cat:text-black"
      >
        {category.name}
        <HiChevronDown className="h-4 w-4 transition-transform group-hover/cat:rotate-180" />
      </Link>

      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition duration-150 group-hover/cat:visible group-hover/cat:opacity-100 group-focus-within/cat:visible group-focus-within/cat:opacity-100">
        <ul className="w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
          <li>
            <Link
              href={browseHref({ category: category.slug })}
              className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-neutral-100"
            >
              All {category.name}
            </Link>
          </li>

          {category.groups.length === 0 && (
            <li className="px-3 py-2 text-xs text-neutral-500">Sub-categories coming soon.</li>
          )}

          {category.groups.map((group) => (
            <li key={group.slug} className="group/grp relative">
              <Link
                href={browseHref({ category: category.slug, subcategory: group.slug })}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-black group-focus-within/grp:bg-neutral-100"
              >
                {group.name}
                {group.items.length > 0 && <HiChevronRight className="h-4 w-4 text-neutral-400" />}
              </Link>

              {group.items.length > 0 && (
                <div className="invisible absolute left-full top-0 z-50 pl-2 opacity-0 transition duration-150 group-hover/grp:visible group-hover/grp:opacity-100 group-focus-within/grp:visible group-focus-within/grp:opacity-100">
                  <ul className="w-72 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                    {group.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={browseHref({
                            category: category.slug,
                            subcategory: group.slug,
                            type: item.slug,
                          })}
                          className="block rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-black hover:text-white"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/* ---------- Mobile: accordion ---------- */
function MobileCategory({ category, close }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-1 py-3 text-left font-medium"
        aria-expanded={open}
      >
        {category.name}
        <HiChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="pb-3 pl-3">
          <Link
            href={browseHref({ category: category.slug })}
            onClick={close}
            className="block py-2 text-sm font-semibold"
          >
            All {category.name}
          </Link>
          {category.groups.map((group) => (
            <div key={group.slug}>
              <div className="flex items-center justify-between">
                <Link
                  href={browseHref({ category: category.slug, subcategory: group.slug })}
                  onClick={close}
                  className="flex-1 py-2 text-sm text-neutral-700"
                >
                  {group.name}
                </Link>
                {group.items.length > 0 && (
                  <button
                    onClick={() => setOpenGroup(openGroup === group.slug ? null : group.slug)}
                    aria-label={`Show ${group.name} options`}
                    aria-expanded={openGroup === group.slug}
                    className="p-2"
                  >
                    <HiChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openGroup === group.slug ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
              {openGroup === group.slug && (
                <div className="mb-1 ml-3 border-l border-neutral-200 pl-3">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={browseHref({
                        category: category.slug,
                        subcategory: group.slug,
                        type: item.slug,
                      })}
                      onClick={close}
                      className="block py-1.5 text-sm text-neutral-500 hover:text-black"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close the mobile menu after navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname.includes("dashboard")) return null;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const linkClass = (path) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      pathname === path ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
    }`;

  const avatar =
    user?.image || `https://ui-avatars.com/api/?background=000&color=fff&name=${encodeURIComponent(user?.name || "U")}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          <li>
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <CategoryMenu key={c.slug} category={c} />
          ))}
          <li>
            <Link href="/browse" className={linkClass("/browse")}>
              All
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {!isPending && !session && (
            <>
              <Link href="/login" className="rounded-full px-3.5 py-2 text-sm font-medium text-neutral-700 hover:text-black">
                Log in
              </Link>
              <Link
                href="/registration"
                className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Create account
              </Link>
            </>
          )}

          {session && (
            <>
              <Link
                href={`/dashboard/${user?.role}`}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-black"
              >
                Dashboard
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="Account menu"
                  aria-expanded={isDropdownOpen}
                >
                  <Image
                    unoptimized
                    width={40}
                    height={40}
                    src={avatar}
                    alt={user?.name || "Account"}
                    className="h-10 w-10 rounded-full border-2 border-black object-cover"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white py-1 shadow-xl">
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="truncate text-sm font-bold">{user?.name}</p>
                      <p className="truncate text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <Link
                      href={`/dashboard/${user?.role}/transaction`}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Your profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="rounded-full p-2 text-black hover:bg-neutral-100 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-neutral-200 bg-white px-4 pb-6 lg:hidden">
          <Link href="/" className="block border-b border-neutral-100 px-1 py-3 font-medium" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {CATEGORIES.map((c) => (
            <MobileCategory key={c.slug} category={c} close={() => setIsOpen(false)} />
          ))}
          <Link href="/browse" className="block border-b border-neutral-100 px-1 py-3 font-medium" onClick={() => setIsOpen(false)}>
            All
          </Link>

          {!isPending && !session && (
            <div className="mt-4 flex gap-3">
              <Link href="/login" className="flex-1 rounded-full border border-black py-2.5 text-center text-sm font-semibold" onClick={() => setIsOpen(false)}>
                Log in
              </Link>
              <Link href="/registration" className="flex-1 rounded-full bg-black py-2.5 text-center text-sm font-semibold text-white" onClick={() => setIsOpen(false)}>
                Create account
              </Link>
            </div>
          )}

          {session && (
            <div className="mt-4 space-y-1">
              <Link href={`/dashboard/${user?.role}`} className="block px-1 py-2 font-medium" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link href={`/dashboard/${user?.role}/transaction`} className="block px-1 py-2 font-medium" onClick={() => setIsOpen(false)}>
                Your profile
              </Link>
              <button onClick={handleLogout} className="block w-full px-1 py-2 text-left font-medium text-red-600">
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
