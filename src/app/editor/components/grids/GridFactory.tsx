'use client'

import { useEditorStore } from '@/stores/editorStore'
import WeekViewSimple from './views/WeekViewSimple'
import WeekViewWithPeriods from './views/WeekViewWithPeriods'
import MonthView from './views/MonthView'
import DayView from './views/DayView'

/**
 * Factory Pattern : Sélectionne la vue selon currentView et useCase
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
      // Vue semaine : selon le useCase
      if (agenda.useCase === 'rotation') {
        // Rotation → Grille avec périodes en lignes
        return <WeekViewWithPeriods />
      } else {
        // Team, Personal, Other → Vue simple sans lignes
        return <WeekViewSimple />
      }
  }
}
