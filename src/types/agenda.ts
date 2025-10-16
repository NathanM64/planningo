// src/types/agenda.ts - Version extensible avec modes et cycles

export interface Member {
  id: string
  name: string
  color: string
}

export interface AgendaBlock {
  id: string
  memberIds: string[]
  date: string // "2025-11-04"
  start: string // "09:00"
  end: string // "13:00"
  label?: string
  patternId?: string // Référence au bloc source si généré par cycle
}

// ========================================
// MODES D'AGENDA (extensible)
// ========================================

export type AgendaMode =
  | 'simple'               // Planning libre, semaine par semaine
  | 'cycle'                // Roulement cyclique (N semaines qui se répètent)
  // Futurs modes à ajouter :
  // | 'monthly'
  // | 'project-timeline'
  // | 'resource-booking'

// ========================================
// AFFICHAGE DES CRÉNEAUX
// ========================================

export type TimeSlotDisplay =
  | 'precise-hours'        // Heures précises (09:00, 10:30, etc.)
  | 'fixed-periods'        // Périodes fixes (Matin/Soir, Matin/AM/Soir)
  | 'full-day'             // Journée complète sans découpage

export interface FixedPeriod {
  id: string
  label: string            // "Matin", "Après-midi", "Soir"
  defaultStart?: string    // Suggestion : "08:00"
  defaultEnd?: string      // Suggestion : "12:00"
}

// ========================================
// CONFIG PAR MODE (type discriminé)
// ========================================

export interface CycleConfig {
  cycleWeeks: number           // Nombre de semaines dans le cycle (ex: 3)
  repeatIndefinitely: boolean  // Répéter à l'infini ou jusqu'à une date
  endDate?: string             // Date de fin si pas indéfini
}

export interface CycleException {
  weekOffset: number                    // Quelle occurrence du cycle (0, 1, 2...)
  modifiedFields: Partial<AgendaBlock>  // Champs modifiés
}

// Type discriminé pour la config du mode
export type AgendaModeConfig =
  | { mode: 'simple' }
  | { mode: 'cycle'; cycleConfig: CycleConfig; cycleExceptions?: Record<string, CycleException> }
  // Futurs modes :
  // | { mode: 'monthly'; monthlyConfig: MonthlyConfig }

// ========================================
// INTERFACE AGENDA PRINCIPALE
// ========================================

export type AgendaUseCase = 'team' | 'rotation' | 'personal' | 'other'

export interface Agenda {
  // Propriétés de base
  id: string
  user_id?: string
  name: string
  members: Member[]
  blocks: AgendaBlock[]

  // Cas d'usage (détermine le type de grille)
  useCase: AgendaUseCase

  // Mode et configuration (nouvelle architecture)
  modeConfig: AgendaModeConfig

  // Affichage des créneaux
  timeSlotDisplay: TimeSlotDisplay
  fixedPeriods?: FixedPeriod[]      // Si timeSlotDisplay = 'fixed-periods'

  // Jours actifs (0=dimanche, 1=lundi, ..., 6=samedi)
  activeDays: number[]              // Ex: [1,2,3,4,5] = lun-ven

  // Navigation
  currentWeekStart: string

  // Métadonnées
  created_at?: string
  updated_at?: string
}

// ========================================
// UTILITAIRES
// ========================================

export const createEmptyMember = (): Omit<Member, 'id'> => ({
  name: 'Nouveau membre',
  color: '#3B82F6',
})

export const createEmptyBlock = (
  memberIds: string[],
  date: string
): Omit<AgendaBlock, 'id'> => ({
  memberIds,
  date,
  start: '09:00',
  end: '10:00',
  label: '',
})

export const createEmptyAgenda = (): Omit<
  Agenda,
  'id' | 'created_at' | 'updated_at'
> => {
  const today = new Date()
  const monday = getMonday(today)

  return {
    name: 'Nouvel agenda',
    members: [],
    blocks: [],
    currentWeekStart: monday.toISOString().split('T')[0],
    // Nouvelles propriétés avec valeurs par défaut
    useCase: 'team', // Valeur par défaut
    modeConfig: { mode: 'simple' },
    timeSlotDisplay: 'precise-hours',
    activeDays: [1, 2, 3, 4, 5, 6, 0], // Tous les jours par défaut
  }
}

// Helpers dates inchangés
export const getMonday = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export const getWeekDays = (mondayDate: string): Date[] => {
  const monday = new Date(mondayDate)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0]
}
