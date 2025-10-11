// Types de base pour les agendas Planningo

export interface AgendaBlock {
  id: string
  day: string // "lundi", "mardi", etc. ou date ISO
  start: string // "09:00"
  end: string // "10:00"
  label: string // "Réunion", "Formation", etc.
  color: string // "#3b82f6" ou nom de couleur Tailwind
}

export interface Agenda {
  id: string
  user_id?: string // Optionnel pour l'instant (avant auth)
  name: string // "Planning Semaine 42"
  layout: 'daily' | 'weekly' | 'monthly'
  theme: string // "default", "colorful", "minimal"
  blocks: AgendaBlock[]
  created_at?: string
  updated_at?: string
}

export type AgendaLayout = 'daily' | 'weekly' | 'monthly'

export type AgendaTheme = 'default' | 'colorful' | 'minimal' | 'professional'

// Utilitaire pour créer un bloc vide
export const createEmptyBlock = (): Omit<AgendaBlock, 'id'> => ({
  day: '',
  start: '09:00',
  end: '10:00',
  label: 'Nouveau créneau',
  color: '#3b82f6', // Bleu par défaut
})

// Utilitaire pour créer un agenda vide
export const createEmptyAgenda = (): Omit<
  Agenda,
  'id' | 'created_at' | 'updated_at'
> => ({
  name: 'Nouvel agenda',
  layout: 'weekly',
  theme: 'default',
  blocks: [],
})
