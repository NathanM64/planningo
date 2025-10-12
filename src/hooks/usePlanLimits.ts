'use client'

import { useAuth } from '@/contexts/AuthContext'
import {
  getUserPlan,
  PLANS,
  canAddMember,
  getRemainingMembers,
} from '@/config/plans'
import type { PlanType } from '@/config/plans'

export function usePlanLimits() {
  const { user } = useAuth()

  // TODO: Récupérer isPro depuis la BDD (users.is_pro)
  const isPro = false

  const plan: PlanType = getUserPlan(!!user, isPro)
  const limits = PLANS[plan]

  return {
    plan,
    limits,
    isTest: plan === 'test',
    isFree: plan === 'free',
    isPro: plan === 'pro',
    canAddMember: (currentCount: number) => canAddMember(currentCount, plan),
    getRemainingMembers: (currentCount: number) =>
      getRemainingMembers(currentCount, plan),
  }
}
