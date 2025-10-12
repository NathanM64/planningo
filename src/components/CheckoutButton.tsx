// src/components/CheckoutButton.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui'
import { Crown, Loader2, AlertCircle } from 'lucide-react'
import { getStripe } from '@/lib/stripe'

interface CheckoutButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export default function CheckoutButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children = 'Passer en Pro',
}: CheckoutButtonProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/auth'
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Appeler l'API pour créer une session Stripe
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Erreur lors de la création de la session'
        )
      }

      // Rediriger vers Stripe Checkout
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Stripe non chargé')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err) {
      console.error('Erreur checkout:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleCheckout}
        disabled={loading}
        className={className}
        leftIcon={
          loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Crown className="w-4 h-4" />
          )
        }
      >
        {loading ? 'Redirection...' : children}
      </Button>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
