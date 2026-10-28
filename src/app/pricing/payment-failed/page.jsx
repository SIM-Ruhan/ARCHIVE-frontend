import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export default async function PaymentFailed({ searchParams }) {
  const { message } = await searchParams;
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <FiAlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold">Payment did not start</h1>
        <p className="mt-2 text-neutral-600">{message || "Something went wrong. You were not charged."}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/browse" className="rounded-full bg-black py-3 font-semibold text-white hover:bg-neutral-800">
            Back to browse
          </Link>
          <Link href="/pricing" className="py-2 text-sm font-medium text-neutral-600 hover:text-black">
            View seller plans
          </Link>
        </div>
      </div>
    </section>
  );
}
