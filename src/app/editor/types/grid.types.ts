import { Member, AgendaBlock } from '@/types/agenda'

/**
 * Index optimisé pour accéder rapidement aux blocs
 * Clé : "memberId-date" ou "memberId-date-period"
 */
export interface BlockIndex {
  [key: string]: AgendaBlock[]
}

/**
 * Props communes pour toutes les cellules de grille
 */
export interface BaseGridCellProps {
  member: Member
  date: string
  dateObj: Date
  isToday: boolean
  blocks: AgendaBlock[]
  onBlockClick: (block: AgendaBlock) => void
  onAddClick: (memberId: string, date: string, period?: string) => void
}

/**
 * Configuration d'une grille
 */
export interface GridConfig {
  minCellWidth: string       // Tailwind class
  minCellHeight: string       // Tailwind class
  showTimeInBlocks: boolean   // Afficher heures dans blocs
  showPeriodLabels: boolean   // Afficher labels périodes
}
