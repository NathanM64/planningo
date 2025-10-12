'use client'

import { useAuth } from '@/contexts/AuthContext'
import {
  getUserPlan,
  PLANS,
  canAddMember,
  getRemainingMembers,
  canAddAgenda,
  canUseFeature,
  getUpgradeMessage,
  PLAN_COLORS,
  type PlanKey,
  type PlanConfig,
} from '@/config/plans'

/**
 * Hook principal pour gérer les limites freemium
 * Expose des helpers ergonomiques pour vérifier les permissions
 */
export function usePlanLimits() {
  const { user } = useAuth()

  // TODO: Récupérer isPro depuis la BDD (users.is_pro)
  const isPro = false

  const planKey: PlanKey = getUserPlan(!!user, isPro)
  const config: PlanConfig = PLANS[planKey]
  const colors = PLAN_COLORS[planKey]
  const upgradeMessage = getUpgradeMessage(planKey)

  return {
    // Plan info
    plan: planKey,
    planName: config.name,
    config,
    colors,
    upgradeMessage,

    // Plan booleans
    isTest: planKey === 'test',
    isFree: planKey === 'free',
    isPro: planKey === 'pro',

    // Limites
    limits: {
      maxMembers: config.maxMembers,
      maxAgendas: config.maxAgendas,
    },

    // Feature checks (helper "can")
    can: (feature: keyof PlanConfig) => canUseFeature(planKey, feature),

    // Specific checks
    canAddMember: (currentCount: number) => canAddMember(currentCount, planKey),
    canAddAgenda: (currentCount: number) => canAddAgenda(currentCount, planKey),

    // Remaining counts
    getRemainingMembers: (currentCount: number) =>
      getRemainingMembers(currentCount, planKey),

    // Check if limited
    isLimited: (feature: keyof PlanConfig) => !canUseFeature(planKey, feature),

    // Format display
    formatMemberLimit: (currentCount: number) => {
      const max = config.maxMembers
      if (max === null) return `${currentCount} membres`
      return `${currentCount}/${max} membres`
    },
  }
}
