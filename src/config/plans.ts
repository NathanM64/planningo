export const PLANS = {
  test: {
    id: 'test',
    name: 'Mode test',
    description: 'Essayez gratuitement sans compte',
    price: 0,
    color: 'orange', // Pour la UI
    maxMembers: 3,
    maxAgendas: 1,
    canSave: false,
    canExportPdf: true,
    hasWatermark: 'large' as const,
    canCustomizeTheme: false,
    canShareAgenda: false,
    hasSupport: false,
    features: [
      'Accès immédiat sans compte',
      "Jusqu'à 3 membres",
      'Export PDF avec watermark',
      'Aucune sauvegarde',
    ],
    limitations: [
      'Données perdues à la fermeture',
      'Pas de sauvegarde cloud',
      'Watermark sur les exports',
    ],
  },
  free: {
    id: 'free',
    name: 'Gratuit',
    description: 'Pour les petites équipes',
    price: 0,
    color: 'blue',
    maxMembers: 5,
    maxAgendas: 3,
    canSave: true,
    canExportPdf: true,
    hasWatermark: 'small' as const,
    canCustomizeTheme: false,
    canShareAgenda: false,
    hasSupport: false,
    features: [
      'Sauvegarde cloud',
      "Jusqu'à 5 membres par agenda",
      '3 agendas maximum',
      'Export PDF',
      'Synchronisation multi-appareils',
    ],
    limitations: [
      'Watermark sur les exports',
      'Pas de thèmes personnalisés',
      'Support communautaire uniquement',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les équipes professionnelles',
    price: 9.99, // €/mois
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
      'Agendas illimités',
      'Export PDF sans watermark',
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

/**
 * Helper pour obtenir le plan d'un utilisateur
 */
export function getUserPlan(
  isAuthenticated: boolean,
  isPro: boolean = false
): PlanKey {
  if (isPro) return 'pro'
  if (isAuthenticated) return 'free'
  return 'test'
}

/**
 * Vérifier si une feature est disponible pour un plan
 */
export function canUseFeature(
  plan: PlanKey,
  feature: keyof PlanConfig
): boolean {
  const config = PLANS[plan]
  return Boolean(config[feature])
}

/**
 * Vérifier si un utilisateur peut ajouter un membre
 */
export function canAddMember(currentCount: number, plan: PlanKey): boolean {
  const limit = PLANS[plan].maxMembers
  if (limit === null) return true // Illimité
  return currentCount < limit
}

/**
 * Obtenir le nombre de membres restants
 */
export function getRemainingMembers(
  currentCount: number,
  plan: PlanKey
): number | null {
  const limit = PLANS[plan].maxMembers
  if (limit === null) return null // Illimité
  return Math.max(0, limit - currentCount)
}

/**
 * Vérifier si un utilisateur peut ajouter un agenda
 */
export function canAddAgenda(currentCount: number, plan: PlanKey): boolean {
  const limit = PLANS[plan].maxAgendas
  if (limit === null) return true // Illimité
  return currentCount < limit
}

/**
 * Obtenir les couleurs du plan pour la UI
 */
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

/**
 * Messages d'upgrade selon le plan actuel
 */
export function getUpgradeMessage(currentPlan: PlanKey): {
  title: string
  description: string
  cta: string
  targetPlan: PlanKey
} {
  if (currentPlan === 'test') {
    return {
      title: 'Créez un compte gratuit',
      description: 'Sauvegardez vos agendas et passez à 5 membres.',
      cta: 'Créer un compte',
      targetPlan: 'free',
    }
  }

  return {
    title: 'Passez en Pro',
    description: 'Membres illimités, export sans watermark et bien plus.',
    cta: 'Passer en Pro',
    targetPlan: 'pro',
  }
}
