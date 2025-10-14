// src/types/agenda.ts - Version avec support multi-membres

export interface Member {
  id: string
  name: string
  color: string
}

// CHANGEMENT : memberId devient memberIds (array)
export interface AgendaBlock {
  id: string
  memberIds: string[] // 🆕 Tableau de IDs au lieu d'un seul
  date: string // "2025-11-04"
  start: string // "09:00"
  end: string // "13:00"
  label?: string
}

export interface Agenda {
  id: string
  user_id?: string
  name: string
  members: Member[]
  blocks: AgendaBlock[]
  layout: 'daily' | 'weekly' | 'monthly'
  currentWeekStart: string
  created_at?: string
  updated_at?: string
}

// Utilitaires inchangés
export const createEmptyMember = (): Omit<Member, 'id'> => ({
  name: 'Nouveau membre',
  color: '#3B82F6',
})

// 🆕 Utilitaire mis à jour pour memberIds
export const createEmptyBlock = (
  memberIds: string[], // Peut être vide ou contenir plusieurs IDs
  date: string
): Omit<AgendaBlock, 'id'> => ({
  memberIds, // 🆕
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
    layout: 'weekly',
    currentWeekStart: monday.toISOString().split('T')[0],
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
