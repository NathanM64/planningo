// src/components/PlanBadge.tsx
'use client'

import { usePlanLimits } from '@/hooks/usePlanLimits'
import { Crown, Zap, TestTube } from 'lucide-react'

interface PlanBadgeProps {
  showUpgrade?: boolean
  onUpgradeClick?: () => void
}

export default function PlanBadge({
  showUpgrade = false,
  onUpgradeClick,
}: PlanBadgeProps) {
  const { plan, planName, colors } = usePlanLimits()

  const icons = {
    test: TestTube,
    free: Zap,
    pro: Crown,
  }

  const Icon = icons[plan]

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 ${colors.bg} ${colors.border}`}
      >
        <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
        <span className={`text-sm font-semibold ${colors.text}`}>
          {planName}
        </span>
      </div>

      {showUpgrade && plan !== 'pro' && (
        <button
          onClick={onUpgradeClick}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
        >
          Mettre à niveau
        </button>
      )}
    </div>
  )
}
