// src/components/CheckoutButton.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui'
import { Crown, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

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

    await performCheckout(0)
  }

  const performCheckout = async (retryCount: number) => {

    try {
      // Récupérer la session active pour obtenir le token
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('Session expirée, veuillez vous reconnecter')
      }

      // Appeler l'API pour créer une session Stripe avec le token
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // Si Stripe est down (5xx) et qu'on n'a pas encore retry, on réessaie
        if (response.status >= 500 && retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)))
          return performCheckout(retryCount + 1)
        }
        throw new Error(
          data.error || 'Erreur lors de la création de la session'
        )
      }

      // Rediriger directement vers l'URL Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de paiement manquante')
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
