// Types de base pour les agendas Planningo - Version avec membres

export interface Member {
  id: string
  name: string
  color: string // Référence à une couleur de blockColors
}

export interface AgendaBlock {
  id: string
  memberId: string // ID du membre assigné
  date: string // Date ISO "2025-11-04"
  start: string // "09:00"
  end: string // "13:00"
  label?: string // "Matin", "Réunion", etc. (optionnel)
}

export interface Agenda {
  id: string
  user_id?: string
  name: string
  members: Member[] // Liste des membres de l'équipe
  blocks: AgendaBlock[]
  layout: 'daily' | 'weekly' | 'monthly'
  currentWeekStart: string // Date ISO du lundi de la semaine courante
  created_at?: string
  updated_at?: string
}

// Utilitaire pour créer un membre vide
export const createEmptyMember = (): Omit<Member, 'id'> => ({
  name: 'Nouveau membre',
  color: '#3B82F6', // Bleu par défaut
})

// Utilitaire pour créer un bloc vide
export const createEmptyBlock = (
  memberId: string,
  date: string
): Omit<AgendaBlock, 'id'> => ({
  memberId,
  date,
  start: '09:00',
  end: '10:00',
  label: '',
})

// Utilitaire pour créer un agenda vide
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

// Helper pour obtenir le lundi de la semaine
export const getMonday = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

// Helper pour obtenir les 7 jours d'une semaine
export const getWeekDays = (mondayDate: string): Date[] => {
  const monday = new Date(mondayDate)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

// Helper pour formater une date en ISO (YYYY-MM-DD)
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0]
}
