// src/types/template.ts
import { Member, AgendaBlock } from './agenda'

export type PersonaType =
  | 'enseignants'
  | 'clubs-sportifs'
  | 'associations'
  | 'professionnels-sante'
  | 'familles'
  | 'centres-loisirs'

export interface TemplateTimeSlot {
  start: string // "08:00"
  end: string // "12:00"
  label?: string // Optionnel : "Matinée", "Pause déjeuner", etc.
}

export interface TemplateMember {
  name: string
  color?: string // Optionnel, sera assigné automatiquement si absent
}

export interface TemplateBlock {
  day: number // 0 = Lundi, 1 = Mardi, ..., 6 = Dimanche
  timeSlotIndex: number // Index dans le tableau timeSlots
  memberIndexes: number[] // Indexes des membres concernés
  label?: string // Label personnalisé pour ce bloc
}

export interface AgendaTemplate {
  id: string
  persona: PersonaType
  useCase: string // ex: "Planning de surveillance"
  title: string
  description: string
  icon?: string // Optionnel : nom de l'icône lucide-react
  config: {
    // Jours actifs (0 = Lundi, 6 = Dimanche)
    activeDays: number[]
    // Créneaux horaires prédéfinis
    timeSlots: TemplateTimeSlot[]
    // Membres prédéfinis
    members: TemplateMember[]
    // Blocs pré-remplis (optionnel)
    blocks?: TemplateBlock[]
  }
}

export interface TemplateCategory {
  persona: PersonaType
  title: string
  description: string
  templates: AgendaTemplate[]
}
