'use client'

import { useMemo } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { getWeekDays, formatDateISO } from '@/types/agenda'

/**
 * Hook centralisé pour les données communes des grilles
 */
export function useGridData() {
  const { agenda, goToPreviousWeek, goToNextWeek, goToToday } = useEditorStore()

  const weekDays = useMemo(
    () => (agenda ? getWeekDays(agenda.currentWeekStart) : []),
    [agenda]
  )

  const today = useMemo(() => formatDateISO(new Date()), [])

  const hasMembers = agenda ? agenda.members.length > 0 : false

  return {
    agenda,
    weekDays,
    today,
    hasMembers,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  }
}
