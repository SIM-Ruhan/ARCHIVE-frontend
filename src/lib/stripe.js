import 'server-only'

import Stripe from 'stripe'

// Created lazily so the app can build/start without STRIPE_SECRET_KEY set.
let _stripe
export const stripe = new Proxy({}, {
  get(_t, prop) {
    if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    return _stripe[prop]
  },
})

export const PLAN_PRICE_ID = {
    'seller_starter' : "price_1TnZ1XKGUpah4RcASMc4Jsqk",
    'seller_pro' : "price_1TnYZ0KGUpah4RcAbnw1iRKj",
    'seller_master' : "price_1TnZ2KKGUpah4RcAuq0Kzi9D"

}