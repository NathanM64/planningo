import { AgendaBlock } from '@/types/agenda'
import { BlockIndex } from '@/app/editor/types/grid.types'

/**
 * Crée un index des blocs par membre et date
 * Utilisé pour PreciseHoursGrid et FullDayGrid
 *
 * @example
 * const index = createBlockIndexByMemberDate(blocks)
 * const blocksForMember1OnMonday = index['member1-2025-10-16']
 */
export function createBlockIndexByMemberDate(
  blocks: AgendaBlock[]
): BlockIndex {
  const index: BlockIndex = {}

  blocks.forEach(block => {
    block.memberIds.forEach(memberId => {
      const key = `${memberId}-${block.date}`
      if (!index[key]) {
        index[key] = []
      }
      index[key].push(block)
    })
  })

  return index
}

/**
 * Crée un index des blocs par membre, date ET période
 * Utilisé pour FixedPeriodsGrid
 *
 * @example
 * const index = createBlockIndexByMemberDatePeriod(blocks)
 * const blocksForMember1OnMondayMorning = index['member1-2025-10-16-Matin']
 */
export function createBlockIndexByMemberDatePeriod(
  blocks: AgendaBlock[]
): BlockIndex {
  const index: BlockIndex = {}

  blocks.forEach(block => {
    const period = block.label || 'Matin' // Fallback sur "Matin"
    block.memberIds.forEach(memberId => {
      const key = `${memberId}-${block.date}-${period}`
      if (!index[key]) {
        index[key] = []
      }
      index[key].push(block)
    })
  })

  return index
}

/**
 * Filtre les blocs d'une semaine donnée
 */
export function filterBlocksForWeek(
  blocks: AgendaBlock[],
  weekStart: string
): AgendaBlock[] {
  const start = new Date(weekStart)
  const end = new Date(weekStart)
  end.setDate(end.getDate() + 7)

  return blocks.filter(block => {
    const blockDate = new Date(block.date)
    return blockDate >= start && blockDate < end
  })
}
