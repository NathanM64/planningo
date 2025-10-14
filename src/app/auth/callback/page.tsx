'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Vérifie si l'utilisateur a confirmé son email
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Redirige vers le dashboard après confirmation
        router.push('/dashboard')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vérification en cours...
        </h2>
        <p className="text-gray-600">Vous allez être redirigé dans un instant</p>
      </div>
    </div>
  )
}
