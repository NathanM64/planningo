'use client'

import { useRouter } from 'next/navigation'
import { usePlanLimits } from '@/contexts/PlanContext'
import { useTelemetry } from '@/hooks/useTelemetry'
import { Button } from '@/components/ui'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export default function TestModeBanner() {
  const router = useRouter()
  const { isTest, upgradeMessage, colors } = usePlanLimits()
  const { trackUpgradeClick } = useTelemetry()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isTest || isDismissed) return null

  const handleUpgrade = () => {
    trackUpgradeClick('test', 'free')
    router.push('/auth')
  }

  return (
    <div className={`${colors.bg} border-b-2 ${colors.border}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${colors.text}`}>
                {upgradeMessage.title}
              </p>
              <p className={`text-sm sm:text-xs ${colors.text} opacity-90`}>
                {upgradeMessage.description} Vos données ne sont PAS
                sauvegardées.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="accent" onClick={handleUpgrade}>
              {upgradeMessage.cta}
            </Button>
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Masquer la bannière"
              className={`${colors.text} hover:opacity-70 transition`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
