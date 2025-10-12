export const PLANS = {
  test: {
    id: 'test',
    name: 'Mode test',
    description: 'Essayez gratuitement sans compte',
    price: 0,
    color: 'orange',
    maxMembers: 2,
    maxAgendas: 1,
    canSave: false,
    canExportPdf: true,
    hasWatermark: 'large' as const,
    canCustomizeTheme: false,
    canShareAgenda: false,
    hasSupport: false,
    features: [
      'Accès immédiat sans compte',
      "Jusqu'à 2 membres",
      'Export PDF avec marque Planningo',
      'Aucune sauvegarde',
    ],
    limitations: [
      'Données perdues à la fermeture',
      'Pas de sauvegarde cloud',
      'Marque Planningo sur les PDF',
    ],
  },
  free: {
    id: 'free',
    name: 'Gratuit',
    description: 'Pour les petites équipes',
    price: 0,
    color: 'blue',
    maxMembers: 5,
    maxAgendas: 1,
    canSave: true,
    canExportPdf: true,
    hasWatermark: 'small' as const,
    canCustomizeTheme: false,
    canShareAgenda: false,
    hasSupport: false,
    features: [
      'Sauvegarde cloud',
      "Jusqu'à 5 membres par agenda",
      '1 agenda sauvegardé',
      'Export PDF',
      'Synchronisation multi-appareils',
    ],
    limitations: [
      '1 seul agenda (supprimer pour créer un nouveau)',
      'Petite signature Planningo sur les PDF',
      'Pas de thèmes personnalisés',
      'Support communautaire uniquement',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les équipes professionnelles',
    price: 9.99,
    color: 'gold',
    maxMembers: null, // Illimité
    maxAgendas: null, // Illimité
    canSave: true,
    canExportPdf: true,
    hasWatermark: 'none' as const,
    canCustomizeTheme: true,
    canShareAgenda: true,
    hasSupport: true,
    features: [
      'Membres illimités',
      'Agendas illimités', // ✅ Mise en avant
      'PDF sans marque (100% votre marque)',
      'Thèmes personnalisés',
      "Partage d'agendas",
      'Templates premium',
      'Support prioritaire',
    ],
    limitations: [],
  },
} as const

export type PlanKey = keyof typeof PLANS
export type PlanConfig = (typeof PLANS)[PlanKey]
export type WatermarkSize = 'none' | 'small' | 'large'

export function getUserPlan(
  isAuthenticated: boolean,
  isPro: boolean = false
): PlanKey {
  if (isPro) return 'pro'
  if (isAuthenticated) return 'free'
  return 'test'
}

export function canUseFeature(
  plan: PlanKey,
  feature: keyof PlanConfig
): boolean {
  const config = PLANS[plan]
  return Boolean(config[feature])
}

export function canAddMember(currentCount: number, plan: PlanKey): boolean {
  const limit = PLANS[plan].maxMembers
  if (limit === null) return true
  return currentCount < limit
}

export function getRemainingMembers(
  currentCount: number,
  plan: PlanKey
): number | null {
  const limit = PLANS[plan].maxMembers
  if (limit === null) return null
  return Math.max(0, limit - currentCount)
}

export function canAddAgenda(currentCount: number, plan: PlanKey): boolean {
  const limit = PLANS[plan].maxAgendas
  if (limit === null) return true
  return currentCount < limit
}

export const PLAN_COLORS = {
  test: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    button: 'bg-orange-500 hover:bg-orange-600',
  },
  free: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    button: 'bg-blue-500 hover:bg-blue-600',
  },
  pro: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    button: 'bg-yellow-500 hover:bg-yellow-600',
  },
} as const

export function getUpgradeMessage(currentPlan: PlanKey): {
  title: string
  description: string
  cta: string
  targetPlan: PlanKey
} {
  if (currentPlan === 'test') {
    return {
      title: 'Créez un compte gratuit',
      description: 'Sauvegardez votre agenda et passez à 5 membres.',
      cta: 'Créer un compte',
      targetPlan: 'free',
    }
  }

  return {
    title: 'Passez en Pro',
    description: 'Agendas illimités, membres illimités, PDF sans marque.',
    cta: 'Passer en Pro',
    targetPlan: 'pro',
  }
}
