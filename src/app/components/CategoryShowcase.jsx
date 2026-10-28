import Link from "next/link";
import { FaShareNodes, FaGamepad, FaStore, FaArrowRight } from "react-icons/fa6";
import { CATEGORIES, browseHref } from "@/lib/categories";

const ICONS = { "social-media": FaShareNodes, games: FaGamepad, marketplace: FaStore };

export default function CategoryShowcase() {
  return (
    <section className="px-4 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Shop by category</h2>
          <p className="mt-2 text-neutral-600">Start with a category, then narrow it down to the exact kind of account.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.slug] || FaStore;
            return (
              <div key={c.slug} className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{c.name}</h3>
                <p className="mt-1 text-sm text-neutral-600">{c.blurb}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {c.groups.length === 0 && <span className="text-xs text-neutral-500">More sub-categories soon.</span>}
                  {c.groups.map((g) => (
                    <Link
                      key={g.slug}
                      href={browseHref({ category: c.slug, subcategory: g.slug })}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-black hover:bg-black hover:text-white"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>

                <Link
                  href={browseHref({ category: c.slug })}
                  className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold"
                >
                  Browse {c.name}
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
