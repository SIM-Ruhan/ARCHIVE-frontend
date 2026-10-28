import Link from "next/link";

// Small call-to-action card shown just above the footer on the home page.
export default function SellCtaCard() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-3xl bg-black px-8 py-10 text-center text-white sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Want to sell your old unused account?</h2>
          <p className="mt-2 text-sm text-neutral-300">See the seller plans and what each one includes.</p>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-transform hover:-translate-y-0.5 hover:bg-neutral-200"
        >
          View details
        </Link>
      </div>
    </section>
  );
}
