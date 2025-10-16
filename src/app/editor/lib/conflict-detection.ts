import type { AgendaBlock, Agenda } from '@/types/agenda'

export interface Conflict {
  type: 'overlap' | 'double-booking'
  conflictingBlock: AgendaBlock
  conflictingMembers: string[] // Noms des membres en conflit
  message: string
}

/**
 * Vérifie si deux plages horaires se chevauchent
 */
function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  // Convertir les heures en minutes pour faciliter la comparaison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)

  // Chevauchement si :
  // - start1 < end2 ET end1 > start2
  return s1 < e2 && e1 > s2
}

/**
 * Détecte les conflits pour un nouveau créneau
 *
 * Un conflit se produit quand :
 * - Même membre assigné à 2 créneaux qui se chevauchent
 * - Même jour
 * - Horaires qui se chevauchent
 */
export function detectConflict(
  newBlock: AgendaBlock,
  agenda: Agenda
): Conflict | null {
  // Trouver les créneaux qui chevauchent
  const overlappingBlocks = agenda.blocks.filter((existingBlock) => {
    // Ignorer le même créneau (en cas d'édition)
    if (existingBlock.id === newBlock.id) return false

    // Doit être le même jour
    if (existingBlock.date !== newBlock.date) return false

    // Trouver les membres en commun
    const sharedMembers = existingBlock.memberIds.filter((id) =>
      newBlock.memberIds.includes(id)
    )

    if (sharedMembers.length === 0) return false

    // Vérifier si les horaires se chevauchent
    return timeRangesOverlap(
      existingBlock.start,
      existingBlock.end,
      newBlock.start,
      newBlock.end
    )
  })

  if (overlappingBlocks.length === 0) return null

  // Prendre le premier conflit trouvé
  const conflictingBlock = overlappingBlocks[0]

  // Trouver les membres en conflit
  const conflictingMemberIds = conflictingBlock.memberIds.filter((id) =>
    newBlock.memberIds.includes(id)
  )

  const conflictingMemberNames = conflictingMemberIds
    .map((id) => {
      const member = agenda.members.find((m) => m.id === id)
      return member?.name || 'Membre inconnu'
    })

  const memberList = conflictingMemberNames.join(', ')

  return {
    type: 'overlap',
    conflictingBlock,
    conflictingMembers: conflictingMemberNames,
    message: `Conflit détecté : ${memberList} déjà assigné${conflictingMemberNames.length > 1 ? 's' : ''} de ${conflictingBlock.start} à ${conflictingBlock.end}`,
  }
}

/**
 * Détecte tous les conflits dans un agenda (pour affichage d'alertes)
 */
export function detectAllConflicts(agenda: Agenda): Conflict[] {
  const conflicts: Conflict[] = []

  // Vérifier chaque créneau
  for (const block of agenda.blocks) {
    const conflict = detectConflict(block, {
      ...agenda,
      blocks: agenda.blocks.filter((b) => b.id !== block.id),
    })

    if (conflict) {
      // Éviter les doublons (A conflit avec B = B conflit avec A)
      const isDuplicate = conflicts.some(
        (c) =>
          (c.conflictingBlock.id === block.id ||
            c.conflictingBlock.id === conflict.conflictingBlock.id) &&
          c.type === conflict.type
      )

      if (!isDuplicate) {
        conflicts.push(conflict)
      }
    }
  }

  return conflicts
}
