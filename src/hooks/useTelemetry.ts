'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePlanLimits } from './usePlanLimits'
import { supabase } from '@/lib/supabaseClient'

/**
 * Hook de telemetry léger pour comprendre l'usage
 * Stocke dans Supabase sans être invasif
 */

interface TelemetryEvent {
  event: string
  plan: string
  user_id?: string
  metadata?: Record<string, unknown>
}

export function useTelemetry() {
  const { user } = useAuth()
  const { plan } = usePlanLimits()

  const track = async (event: string, metadata?: Record<string, unknown>) => {
    // Ne track que si Supabase est configuré
    if (!supabase) return

    try {
      const eventData: TelemetryEvent = {
        event,
        plan,
        user_id: user?.id,
        metadata,
      }

      // Stocker dans une table "events" (à créer dans Supabase)
      // await supabase.from('events').insert(eventData)

      // Pour l'instant, juste un console.log
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Telemetry:', eventData)
      }
    } catch (error) {
      // Silencieux en cas d'erreur
      console.error('Telemetry error:', error)
    }
  }

  return {
    // Événements principaux
    trackSignUp: () => track('user_signup'),
    trackSignIn: () => track('user_signin'),
    trackUpgradeClick: (from: string, to: string) =>
      track('upgrade_click', { from, to }),

    // Limites atteintes
    trackLimitReached: (limitType: 'members' | 'agendas') =>
      track('limit_reached', { limitType }),

    // Actions utilisateur
    trackMemberAdd: () => track('member_added'),
    trackAgendaCreate: () => track('agenda_created'),
    trackPdfExport: () => track('pdf_exported'),
    trackAgendaSave: () => track('agenda_saved'),

    // Custom
    track,
  }
}
