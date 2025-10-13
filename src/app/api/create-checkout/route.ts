// src/app/api/create-checkout/route.ts
// Alternative avec token dans le header
import { NextRequest, NextResponse } from 'next/server'
import { stripe, getSuccessUrl, getCancelUrl } from '@/lib/stripe-server'
import { STRIPE_PRICE_ID } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token d'auth depuis le header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 })
    }

    // Créer un client Supabase avec le token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Vérifier l'utilisateur avec le token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      console.error('Auth failed:', userError)
      return NextResponse.json(
        { error: 'Non authentifié', details: userError?.message },
        { status: 401 }
      )
    }

    // Créer une session de paiement Stripe avec essai gratuit de 7 jours
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: getSuccessUrl('{CHECKOUT_SESSION_ID}'),
      cancel_url: getCancelUrl(),
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        trial_period_days: 7, // Essai gratuit de 7 jours
        metadata: {
          user_id: user.id,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Erreur creation session Stripe:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de la création de la session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
