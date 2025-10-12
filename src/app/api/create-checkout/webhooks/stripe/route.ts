// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { supabase } from '@/lib/supabaseClient'
import Stripe from 'stripe'

// Désactiver le parsing du body pour les webhooks Stripe
export const runtime = 'edge'

export async function POST(request: NextRequest) {
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
    event = stripe.webhooks.constructEvent(
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

  // Gérer les événements Stripe
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id

      if (userId) {
        // Mettre à jour l'utilisateur en Pro
        const { error } = await supabase.from('users').upsert({
          id: userId,
          is_pro: true,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error('Erreur mise à jour utilisateur:', error)
        } else {
          console.log('✅ Utilisateur passé en Pro:', userId)
        }
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
        await supabase
          .from('users')
          .update({
            is_pro: false,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        console.log(
          '✅ Abonnement annulé, utilisateur repasse en Free:',
          user.id
        )
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
        await supabase
          .from('users')
          .update({
            is_pro: isActive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        console.log('✅ Abonnement mis à jour:', user.id, 'Pro:', isActive)
      }
      break
    }

    default:
      console.log(`Event non géré: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
