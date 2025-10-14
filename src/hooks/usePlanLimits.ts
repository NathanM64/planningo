// src/hooks/usePlanLimits.ts
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
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
 * Charge le statut Pro depuis la BDD
 */
export function usePlanLimits() {
  const { user } = useAuth()
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  // Charger le statut Pro depuis la BDD
  useEffect(() => {
    let isMounted = true

    const fetchProStatus = async () => {
      if (!user) {
        setIsPro(false)
        setLoading(false)
        return
      }

      const supabase = createClient()

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_pro')
          .eq('id', user.id)
          .single()

        // Vérifier si le composant est toujours monté
        if (!isMounted) return

        if (error) {
          // Si l'utilisateur n'existe pas encore dans users, considérer comme non-Pro
          if (error.code === 'PGRST116') {
            setIsPro(false)
          } else {
            setIsPro(false)
          }
        } else {
          setIsPro(data?.is_pro || false)
        }
      } catch (err) {
        if (isMounted) {
          setIsPro(false)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProStatus()

    return () => {
      isMounted = false
    }
  }, [user])

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
    loading,

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
