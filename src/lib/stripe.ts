// src/lib/stripe.ts
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js'

// Configuration Stripe côté CLIENT uniquement
let stripePromise: Promise<StripeJS | null>

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!key) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY manquante')
      return Promise.resolve(null)
    }

    stripePromise = loadStripe(key)
  }
  return stripePromise
}

// ID du prix Pro - PRODUCTION (depuis Stripe Dashboard)
export const STRIPE_PRICE_ID = 'price_1SHtac4oSdyKF9IFc6OtssOm'
