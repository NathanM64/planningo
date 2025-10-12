// src/lib/stripe.ts
import Stripe from 'stripe'
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js'

// Configuration Stripe côté serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

// Configuration Stripe côté client
let stripePromise: Promise<StripeJS | null>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// ID du prix Pro (depuis Stripe Dashboard)
export const STRIPE_PRICE_ID = 'price_1SHRoP8XtxxMmdak1Cnv7Gop'

// URLs de redirection
export const getSuccessUrl = (sessionId: string) =>
  `${
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }/success?session_id=${sessionId}`

export const getCancelUrl = () =>
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`
