'use client'

import { useRouter } from 'next/navigation'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { Button } from '@/components/ui'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export default function TestModeBanner() {
  const router = useRouter()
  const { isTest } = usePlanLimits()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isTest || isDismissed) return null

  return (
    <div className="bg-orange-50 border-b-2 border-orange-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-900">
                Mode test - Vos données ne seront PAS sauvegardées
              </p>
              <p className="text-xs text-orange-700">
                Créez un compte gratuit pour sauvegarder dans le cloud et
                augmenter à 5 membres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="accent"
              onClick={() => router.push('/auth')}
            >
              Créer un compte
            </Button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-orange-600 hover:text-orange-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
