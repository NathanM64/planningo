// src/lib/templateConverter.ts
import { v4 as uuidv4 } from 'uuid'
import { Agenda, Member, AgendaBlock, getMonday, formatDateISO } from '@/types/agenda'
import { AgendaTemplate } from '@/types/template'
import { blockColors } from './colors'

/**
 * Convertit un template en agenda utilisable
 * Génère les IDs, assigne les couleurs, calcule les dates
 */
export function convertTemplateToAgenda(template: AgendaTemplate): Agenda {
  const today = new Date()
  const monday = getMonday(today)

  // 1. Créer les membres avec IDs et couleurs
  const members: Member[] = template.config.members.map((memberTemplate, index) => ({
    id: uuidv4(),
    name: memberTemplate.name,
    color: memberTemplate.color || blockColors[index % blockColors.length].value,
  }))

  // 2. Créer les blocs avec dates réelles
  const blocks: AgendaBlock[] = []

  if (template.config.blocks) {
    for (const blockTemplate of template.config.blocks) {
      // Calculer la date du bloc (jour de la semaine relatif au lundi)
      const blockDate = new Date(monday)
      blockDate.setDate(monday.getDate() + blockTemplate.day)

      // Récupérer le time slot correspondant
      const timeSlot = template.config.timeSlots[blockTemplate.timeSlotIndex]

      if (timeSlot) {
        blocks.push({
          id: uuidv4(),
          memberIds: blockTemplate.memberIndexes.map((index) => members[index].id),
          date: formatDateISO(blockDate),
          start: timeSlot.start,
          end: timeSlot.end,
          label: blockTemplate.label || timeSlot.label || '',
        })
      }
    }
  }

  // 3. Créer l'agenda complet
  const agenda: Agenda = {
    id: uuidv4(),
    name: template.title,
    members,
    blocks,
    currentWeekStart: formatDateISO(monday),
    // Nouvelles propriétés obligatoires
    modeConfig: { mode: 'simple' },
    timeSlotDisplay: 'precise-hours',
    activeDays: template.config.activeDays,
    created_at: new Date().toISOString(),
  }

  return agenda
}

/**
 * Génère un agenda vide basé sur un template (sans blocs pré-remplis)
 * Utile pour les utilisateurs qui veulent juste la structure (membres + créneaux suggérés)
 */
export function convertTemplateToEmptyAgenda(template: AgendaTemplate): Agenda {
  const today = new Date()
  const monday = getMonday(today)

  // Créer uniquement les membres
  const members: Member[] = template.config.members.map((memberTemplate, index) => ({
    id: uuidv4(),
    name: memberTemplate.name,
    color: memberTemplate.color || blockColors[index % blockColors.length].value,
  }))

  const agenda: Agenda = {
    id: uuidv4(),
    name: template.title,
    members,
    blocks: [], // Pas de blocs pré-remplis
    currentWeekStart: formatDateISO(monday),
    // Nouvelles propriétés obligatoires
    modeConfig: { mode: 'simple' },
    timeSlotDisplay: 'precise-hours',
    activeDays: template.config.activeDays,
    created_at: new Date().toISOString(),
  }

  return agenda
}

/**
 * Helper : Extrait les créneaux horaires suggérés d'un template
 * Peut être utilisé pour afficher une preview ou des suggestions
 */
export function extractSuggestedTimeSlots(template: AgendaTemplate) {
  return template.config.timeSlots.map((slot) => ({
    start: slot.start,
    end: slot.end,
    label: slot.label,
  }))
}

/**
 * Helper : Extrait les jours actifs d'un template (pour affichage)
 */
export function getActiveDaysLabels(template: AgendaTemplate): string[] {
  const daysMap = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  return template.config.activeDays.map((dayIndex) => daysMap[dayIndex])
}
