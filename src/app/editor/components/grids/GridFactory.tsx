'use client'

import { useEditorStore } from '@/stores/editorStore'
import PreciseHoursGrid from './implementations/PreciseHoursGrid/PreciseHoursGrid'
import FixedPeriodsGrid from './implementations/FixedPeriodsGrid/FixedPeriodsGrid'

/**
 * Factory Pattern : Sélectionne la grille selon le mode d'affichage
 *
 * Ajouter un nouveau mode :
 * 1. Créer le dossier implementations/NouveauModeGrid/
 * 2. Implémenter les composants (Cell, Block, Grid)
 * 3. Ajouter un case ici
 */
export default function GridFactory() {
  const agenda = useEditorStore((state) => state.agenda)

  if (!agenda) return null

  switch (agenda.timeSlotDisplay) {
    case 'precise-hours':
      return <PreciseHoursGrid />

    case 'fixed-periods':
      return <FixedPeriodsGrid />

    // case 'full-day':
    //   return <FullDayGrid />

    default:
      // Fallback sur heures précises
      return <PreciseHoursGrid />
  }
}
