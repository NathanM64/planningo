// src/data/templates/index.ts
import { AgendaTemplate, TemplateCategory, PersonaType } from '@/types/template'
import { enseignantsTemplates } from './enseignants'
import { clubsSportifsTemplates } from './clubs-sportifs'
import { associationsTemplates } from './associations'
import { professionnelsSanteTemplates } from './professionnels-sante'
import { famillesTemplates } from './familles'
import { centresLoisirsTemplates } from './centres-loisirs'

// Export de tous les templates par catégorie
export const templateCategories: TemplateCategory[] = [
  {
    persona: 'enseignants',
    title: 'Enseignants',
    description: 'Templates pour gérer surveillances, emplois du temps et réunions scolaires',
    templates: enseignantsTemplates,
  },
  {
    persona: 'clubs-sportifs',
    title: 'Clubs sportifs',
    description: 'Templates pour organiser entraînements, matchs et disponibilités',
    templates: clubsSportifsTemplates,
  },
  {
    persona: 'associations',
    title: 'Associations',
    description: 'Templates pour planifier permanences, événements et réservations',
    templates: associationsTemplates,
  },
  {
    persona: 'professionnels-sante',
    title: 'Professionnels de santé',
    description: 'Templates pour gérer consultations, gardes et formations médicales',
    templates: professionnelsSanteTemplates,
  },
  {
    persona: 'familles',
    title: 'Familles',
    description: 'Templates pour organiser emplois du temps, tâches et activités familiales',
    templates: famillesTemplates,
  },
  {
    persona: 'centres-loisirs',
    title: 'Centres de loisirs',
    description: 'Templates pour planifier activités, rotations et stages vacances',
    templates: centresLoisirsTemplates,
  },
]

// Export de tous les templates (array plat)
export const allTemplates: AgendaTemplate[] = templateCategories.flatMap(
  (category) => category.templates
)

// Helper : Récupérer un template par ID
export function getTemplateById(id: string): AgendaTemplate | undefined {
  return allTemplates.find((template) => template.id === id)
}

// Helper : Récupérer tous les templates d'une persona
export function getTemplatesByPersona(persona: PersonaType): AgendaTemplate[] {
  const category = templateCategories.find((cat) => cat.persona === persona)
  return category ? category.templates : []
}

// Helper : Rechercher des templates par mots-clés
export function searchTemplates(query: string): AgendaTemplate[] {
  const lowerQuery = query.toLowerCase()
  return allTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.useCase.toLowerCase().includes(lowerQuery)
  )
}

// Export des templates individuels pour usage direct
export {
  enseignantsTemplates,
  clubsSportifsTemplates,
  associationsTemplates,
  professionnelsSanteTemplates,
  famillesTemplates,
  centresLoisirsTemplates,
}
