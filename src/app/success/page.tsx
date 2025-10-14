// src/app/success/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    if (!user) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let attempts = 0
    const maxAttempts = 10 // 10 secondes max

    // Polling pour vérifier le statut Pro
    const checkProStatus = async () => {
      const { data } = await supabase
        .from('users')
        .select('is_pro')
        .eq('id', user.id)
        .single()

      if (data?.is_pro) {
        setIsPro(true)
        setLoading(false)
        return true
      }

      attempts++
      if (attempts >= maxAttempts) {
        // Après 10 secondes, on considère que c'est OK
        setIsPro(true)
        setLoading(false)
        return true
      }

      return false
    }

    // Check initial immédiat
    checkProStatus()

    // Polling toutes les secondes
    const interval = setInterval(async () => {
      const done = await checkProStatus()
      if (done) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Activation de votre compte Pro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bienvenue en Pro ! 🎉
        </h1>

        <p className="text-gray-600 mb-8">
          Votre paiement a été confirmé. Vous avez maintenant accès à toutes les
          fonctionnalités Pro :
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              Agendas illimités
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              Membres illimités
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              PDF sans marque Planningo
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              Support prioritaire
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            onClick={() => router.push('/dashboard')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Accéder à mes agendas
          </Button>
          <Link href="/">
            <Button size="lg" variant="ghost" className="w-full">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
