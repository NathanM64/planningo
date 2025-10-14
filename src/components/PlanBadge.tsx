// src/components/PlanBadge.tsx
'use client'

import Link from 'next/link'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { Zap, TestTube, Crown } from 'lucide-react'

export default function PlanBadge() {
  const { plan, planName, colors } = usePlanLimits()

  const icons = {
    test: TestTube,
    free: Zap,
    pro: Crown,
  }

  const Icon = icons[plan]

  // Si Pro, badge non cliquable (juste un indicateur de statut)
  if (plan === 'pro') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${colors.bg} ${colors.border}`}
      >
        <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
        <span className={`text-xs font-semibold ${colors.text}`}>{planName}</span>
      </div>
    )
  }

  // Pour Test/Free, badge cliquable pour upgrade
  const upgradeLink = plan === 'test' ? '/auth' : '/pricing'
  const upgradeLabel = plan === 'test' ? 'Créer un compte' : 'Passer Pro'

  return (
    <Link
      href={upgradeLink}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${colors.bg} ${colors.border} cursor-pointer hover:scale-105 transition-transform`}
      title={upgradeLabel}
    >
      <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
      <span className={`text-xs font-semibold ${colors.text}`}>{planName}</span>
    </Link>
  )
}
