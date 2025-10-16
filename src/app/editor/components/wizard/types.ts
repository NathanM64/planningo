// src/app/editor/components/wizard/types.ts
import { AgendaMode, TimeSlotDisplay, FixedPeriod } from '@/types/agenda'

export type UseCaseType = 'team' | 'rotation' | 'personal' | 'other'
export type DisplayModeType = 'precise-hours' | 'fixed-periods' | 'full-day'

export interface WizardData {
  useCase: UseCaseType | null
  displayMode: DisplayModeType | null
  periods?: string[]
  templateId?: string // ID du template sélectionné (optionnel)
}

export interface WizardConfig {
  mode: AgendaMode
  timeSlotDisplay: TimeSlotDisplay
  fixedPeriods?: FixedPeriod[]
  defaultView?: 'week' | 'month' | 'day'
  activeDays: number[]
}
