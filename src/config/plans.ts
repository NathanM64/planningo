export type PlanType = 'test' | 'free' | 'pro'

export interface PlanLimits {
  maxMembers: number | null // null = illimité
  maxAgendas: number | null
  canSave: boolean
  watermark: 'none' | 'small' | 'large'
  features: string[]
}

export const PLANS: Record<PlanType, PlanLimits> = {
  test: {
    maxMembers: 3,
    maxAgendas: 1, // Session uniquement
    canSave: false,
    watermark: 'large',
    features: [
      'Accès immédiat',
      '3 membres maximum',
      'Aucune sauvegarde',
      'Export PDF avec watermark',
    ],
  },
  free: {
    maxMembers: 5,
    maxAgendas: 3,
    canSave: true,
    watermark: 'small',
    features: [
      'Sauvegarde cloud',
      '5 membres par agenda',
      '3 agendas maximum',
      'Export PDF avec watermark',
      'Synchronisation multi-appareils',
    ],
  },
  pro: {
    maxMembers: null, // Illimité
    maxAgendas: null, // Illimité
    canSave: true,
    watermark: 'none',
    features: [
      'Membres illimités',
      'Agendas illimités',
      'Export PDF sans watermark',
      'Thèmes personnalisés',
      'Templates premium',
      'Support prioritaire',
    ],
  },
}

// Helper pour obtenir le plan d'un utilisateur
export function getUserPlan(
  isAuthenticated: boolean,
  isPro: boolean = false
): PlanType {
  if (isPro) return 'pro'
  if (isAuthenticated) return 'free'
  return 'test'
}

// Helper pour vérifier les limites
export function canAddMember(
  currentMemberCount: number,
  plan: PlanType
): boolean {
  const limit = PLANS[plan].maxMembers
  if (limit === null) return true // Illimité
  return currentMemberCount < limit
}

export function getRemainingMembers(
  currentMemberCount: number,
  plan: PlanType
): number | null {
  const limit = PLANS[plan].maxMembers
  if (limit === null) return null // Illimité
  return Math.max(0, limit - currentMemberCount)
}
