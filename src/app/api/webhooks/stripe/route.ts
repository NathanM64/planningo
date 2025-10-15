// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Prix attendu en cents (5€ = 500 cents)
const EXPECTED_AMOUNT = 500

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      // IMPORTANT: Utiliser constructEventAsync au lieu de constructEvent
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Créer un client Supabase avec la Service Role Key (bypass RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    // SECURITE: Verifier l'idempotence (eviter le rejouage des webhooks)
    const { data: existingEvent } = await supabase
      .from('stripe_events')
      .select('id')
      .eq('event_id', event.id)
      .single()

    if (existingEvent) {
      return NextResponse.json({ received: true, skipped: 'already_processed' })
    }

    // Enregistrer l'event pour l'idempotence
    await supabase.from('stripe_events').insert({
      event_id: event.id,
      event_type: event.type,
      processed_at: new Date().toISOString(),
    })

    // Variable pour tracker les erreurs de traitement
    let processingError = false

    // Gérer les événements Stripe
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (!userId) {
          console.error('User ID manquant dans metadata')
          break
        }

        // SECURITE: Verifier le montant paye (protection contre manipulation)
        // Accepter 0€ (essai gratuit 7 jours) ou 500 cents (5€)
        const isValidAmount =
          session.amount_total === 0 || // Essai gratuit
          session.amount_total === EXPECTED_AMOUNT // Paiement normal

        if (!isValidAmount) {
          console.error(
            'Montant incorrect:',
            session.amount_total,
            'attendu: 0 (essai) ou',
            EXPECTED_AMOUNT,
            '(normal)'
          )
          break
        }

        // Utiliser UPSERT pour créer ou mettre à jour l'utilisateur
        const { error } = await supabase
          .from('users')
          .upsert({
            id: userId,
            is_pro: true,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          })

        if (error) {
          console.error('Erreur mise a jour utilisateur:', error)
          processingError = true
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Trouver l'utilisateur et le repasser en Free
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          const { error } = await supabase
            .from('users')
            .update({
              is_pro: false,
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (error) {
            console.error('Erreur suppression abonnement:', error)
            processingError = true
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const isActive = subscription.status === 'active'

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          const { error } = await supabase
            .from('users')
            .update({
              is_pro: isActive,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (error) {
            console.error('Erreur mise à jour abonnement:', error)
            processingError = true
          }
        }
        break
      }

      default:
        // Event non gere, ignorer silencieusement
        break
    }

    // Retourner 500 si une erreur SQL s'est produite pour que Stripe retry
    if (processingError) {
      return NextResponse.json(
        { error: 'Database error during webhook processing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
