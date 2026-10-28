"use client";

import React from "react";
import { motion } from "framer-motion";
import { BiCheck } from "react-icons/bi";
import { FaRegCreditCard, FaBitcoin } from "react-icons/fa6";

const pricingTiers = [
  {
    name: "Starter",
    id: "seller_starter",
    price: "1",
    description: "For sellers with a few accounts to move.",
    features: ["Up to 10 listings", "Listed in search and categories", "Email support", "Standard seller profile"],
    featured: false,
  },
  {
    name: "Pro",
    id: "seller_pro",
    price: "9",
    description: "For sellers who list regularly.",
    features: ["Up to 50 listings", "Listing analytics", "Priority placement in categories", "Priority support"],
    featured: true,
  },
  {
    name: "Master",
    id: "seller_master",
    price: "19",
    description: "For high-volume sellers and resellers.",
    features: ["Unlimited listings", "Sales insights", "Verified seller badge", "Dedicated support"],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="px-4 py-20">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Pick a plan and start selling</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
          Every account can list 2 items for free. Upgrade when you need more room. You need to log in before you pay.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 md:grid-cols-3">
        {pricingTiers.map((tier) => (
          <motion.div
            key={tier.id}
            whileHover={{ y: -8 }}
            className={`flex flex-col rounded-3xl border p-8 ${
              tier.featured ? "border-black bg-black text-white shadow-2xl" : "border-neutral-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              {tier.featured && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">Most popular</span>
              )}
            </div>

            <div className="my-6">
              <span className="font-display text-5xl font-extrabold">${tier.price}</span>
              <span className={`ml-2 ${tier.featured ? "text-neutral-400" : "text-neutral-500"}`}>/ month</span>
            </div>
            <p className={tier.featured ? "text-neutral-300" : "text-neutral-600"}>{tier.description}</p>

            <ul className="my-8 flex-1 space-y-3 text-left">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <BiCheck className="shrink-0 text-xl" /> {feature}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              {/* Card (Stripe subscription) */}
              <form action="/api/checkout_sessions" method="POST">
                <input type="hidden" name="plan_id" value={tier.id} />
                <button
                  type="submit"
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-semibold transition-colors ${
                    tier.featured ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"
                  }`}
                >
                  <FaRegCreditCard /> Pay with card
                </button>
              </form>

              {/* Crypto (one-time, 30 days) */}
              <form action="/api/crypto/plan" method="POST">
                <input type="hidden" name="plan_id" value={tier.id} />
                <button
                  type="submit"
                  className={`flex w-full items-center justify-center gap-2 rounded-full border-2 py-3 font-semibold transition-colors ${
                    tier.featured
                      ? "border-white text-white hover:bg-white hover:text-black"
                      : "border-black text-black hover:bg-black hover:text-white"
                  }`}
                >
                  <FaBitcoin /> Pay with crypto
                </button>
              </form>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-500">
        Card payments renew every month. Crypto payments are a one-time payment that unlocks the plan for 30 days.
      </p>
    </div>
  );
}
