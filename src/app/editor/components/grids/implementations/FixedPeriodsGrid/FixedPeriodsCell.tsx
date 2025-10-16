'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { Member, AgendaBlock, FixedPeriod } from '@/types/agenda'
import PeriodBlock from './PeriodBlock'

interface FixedPeriodsCellProps {
  member: Member
  date: string
  dateObj: Date
  isToday: boolean
  periods: FixedPeriod[]
  blocksByPeriod: Record<string, AgendaBlock[]>
  onBlockClick: (block: AgendaBlock) => void
  onAddClick: (memberId: string, date: string, period: string) => void
}

export default function FixedPeriodsCell({
  member,
  date,
  dateObj,
  isToday,
  periods,
  blocksByPeriod,
  onBlockClick,
  onAddClick,
}: FixedPeriodsCellProps) {
  return (
    <td
      className={`relative border-r border-gray-200 align-top p-0 ${
        isToday ? 'bg-blue-50/30' : ''
      }`}
    >
      {/* Diviser en sous-colonnes (une par période) */}
      <div className="grid divide-x divide-gray-200" style={{ gridTemplateColumns: `repeat(${periods.length}, 1fr)` }}>
        {periods.map((period) => {
          const key = `${member.id}-${date}-${period.label}`
          const blocksForPeriod = blocksByPeriod[key] || []

          return (
            <div
              key={period.id}
              className="p-1.5 sm:p-2 min-h-[80px] flex flex-col"
            >
              {/* Titre de la période */}
              <div className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1 text-center">
                {period.label}
              </div>

              {/* Liste des blocs */}
              <div className="space-y-1 flex-1">
                {blocksForPeriod.map((block) => (
                  <PeriodBlock
                    key={block.id}
                    block={block}
                    member={member}
                    onClick={() => onBlockClick(block)}
                  />
                ))}
              </div>

              {/* Bouton + pour ajouter */}
              <button
                onClick={() => onAddClick(member.id, date, period.label)}
                className="mt-1 w-full py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center gap-0.5"
                aria-label={`Ajouter un créneau ${period.label} pour ${
                  member.name
                } le ${format(dateObj, 'EEEE d MMMM', { locale: fr })}`}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </td>
  )
}
