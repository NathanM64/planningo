// src/app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe, getSuccessUrl, getCancelUrl } from '@/lib/stripe-server'
import { STRIPE_PRICE_ID } from '@/lib/stripe'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  try {
    // Créer le client Supabase côté serveur
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Récupérer l'utilisateur connecté
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Créer une session de paiement Stripe
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
        metadata: {
          user_id: user.id,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}
