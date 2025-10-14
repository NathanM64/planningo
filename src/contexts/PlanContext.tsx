'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

interface PlanContextType {
  plan: PlanKey
  planName: string
  config: PlanConfig
  colors: { bg: string; text: string; border: string }
  upgradeMessage: {
    title: string
    description: string
    cta: string
    targetPlan: PlanKey
  }
  loading: boolean
  isTest: boolean
  isFree: boolean
  isPro: boolean
  limits: {
    maxMembers: number | null
    maxAgendas: number | null
  }
  can: (feature: keyof PlanConfig) => boolean
  canAddMember: (currentCount: number) => boolean
  canAddAgenda: (currentCount: number) => boolean
  getRemainingMembers: (currentCount: number) => number | null
  isLimited: (feature: keyof PlanConfig) => boolean
  formatMemberLimit: (currentCount: number) => string
}

const PlanContext = createContext<PlanContextType | undefined>(undefined)

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  // Charger le statut Pro depuis la BDD (UNE SEULE FOIS)
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

        if (!isMounted) return

        if (error) {
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

  const value: PlanContextType = {
    plan: planKey,
    planName: config.name,
    config,
    colors,
    upgradeMessage,
    loading,
    isTest: planKey === 'test',
    isFree: planKey === 'free',
    isPro: planKey === 'pro',
    limits: {
      maxMembers: config.maxMembers,
      maxAgendas: config.maxAgendas,
    },
    can: (feature: keyof PlanConfig) => canUseFeature(planKey, feature),
    canAddMember: (currentCount: number) => canAddMember(currentCount, planKey),
    canAddAgenda: (currentCount: number) => canAddAgenda(currentCount, planKey),
    getRemainingMembers: (currentCount: number) =>
      getRemainingMembers(currentCount, planKey),
    isLimited: (feature: keyof PlanConfig) => !canUseFeature(planKey, feature),
    formatMemberLimit: (currentCount: number) => {
      const max = config.maxMembers
      if (max === null) return `${currentCount} membres`
      return `${currentCount}/${max} membres`
    },
  }

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlanLimits() {
  const context = useContext(PlanContext)
  if (context === undefined) {
    throw new Error('usePlanLimits must be used within a PlanProvider')
  }
  return context
}
