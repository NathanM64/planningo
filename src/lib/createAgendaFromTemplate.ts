// src/lib/createAgendaFromTemplate.ts
import { v4 as uuidv4 } from 'uuid'
import { Agenda } from '@/types/agenda'
import { AgendaTemplate } from '@/config/agenda-templates'

/**
 * Crée un agenda complet depuis un template
 * Génère les IDs, mappe les memberIds des sample blocks, et retourne un agenda prêt à l'emploi
 */
export function createAgendaFromTemplate(template: AgendaTemplate): Agenda {
  // Générer IDs pour les membres
  const membersWithIds = template.members.map((m) => ({
    ...m,
    id: uuidv4(),
  }))

  // Créer un Map pour convertir les noms en IDs
  const nameToIdMap = new Map(membersWithIds.map((m) => [m.name, m.id]))

  // Convertir les sample blocks avec les vrais IDs
  const blocksWithIds = template.sampleBlocks.map((block) => ({
    ...block,
    id: uuidv4(),
    // Convertir les noms de membres en IDs réels
    memberIds: block.memberIds
      .map((name) => nameToIdMap.get(name))
      .filter((id): id is string => id !== undefined),
  }))

  // Créer l'agenda complet
  const agenda: Agenda = {
    id: uuidv4(),
    name: template.name,
    members: membersWithIds,
    blocks: blocksWithIds,
    currentWeekStart: template.sampleBlocks[0]?.date || new Date().toISOString().split('T')[0],
    modeConfig: template.mode === 'cycle'
      ? { mode: 'cycle' as const, cycleConfig: { cycleWeeks: 2, repeatIndefinitely: true } }
      : { mode: 'simple' as const },
    timeSlotDisplay: template.timeSlotDisplay,
    fixedPeriods: template.fixedPeriods,
    activeDays: [1, 2, 3, 4, 5, 6, 0], // Tous les jours
    created_at: new Date().toISOString(),
  }

  return agenda
}
