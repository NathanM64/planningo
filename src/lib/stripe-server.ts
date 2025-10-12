// src/lib/stripe-server.ts
import Stripe from 'stripe'

// Configuration Stripe côté SERVEUR uniquement
// Ce fichier ne doit être importé QUE dans les API routes et webhooks

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquante dans .env.local')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// URLs de redirection
export const getSuccessUrl = (sessionId: string) =>
  `${
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }/success?session_id=${sessionId}`

export const getCancelUrl = () =>
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`
