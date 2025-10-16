'use client'

import { useEditorStore } from '@/stores/editorStore'
import PreciseHoursGrid from './implementations/PreciseHoursGrid/PreciseHoursGrid'
import FixedPeriodsGrid from './implementations/FixedPeriodsGrid/FixedPeriodsGrid'
import MonthView from './views/MonthView'
import DayView from './views/DayView'

/**
 * Factory Pattern : Sélectionne la vue selon currentView et timeSlotDisplay
 */
export default function GridFactory() {
  const agenda = useEditorStore((state) => state.agenda)
  const currentView = useEditorStore((state) => state.currentView)

  if (!agenda) return null

  // Switch principal par vue
  switch (currentView) {
    case 'month':
      return <MonthView />

    case 'day':
      return <DayView />

    case 'week':
    default:
      // Vue semaine : selon le timeSlotDisplay
      switch (agenda.timeSlotDisplay) {
        case 'precise-hours':
          return <PreciseHoursGrid />

        case 'fixed-periods':
          return <FixedPeriodsGrid />

        default:
          return <PreciseHoursGrid />
      }
  }
}
