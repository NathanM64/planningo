'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { BaseGridCellProps } from '@/app/editor/types/grid.types'
import PreciseHoursBlock from './PreciseHoursBlock'

export default function PreciseHoursCell({
  member,
  date,
  dateObj,
  isToday,
  blocks,
  onBlockClick,
  onAddClick,
}: BaseGridCellProps) {
  return (
    <td
      className={`relative border-r border-gray-200 align-top p-1.5 sm:p-2 ${
        isToday ? 'bg-blue-50/30' : ''
      }`}
      style={{ minHeight: '80px' }}
    >
      {/* Liste des blocs */}
      <div className="space-y-1 min-h-[60px]">
        {blocks.map((block) => (
          <PreciseHoursBlock
            key={block.id}
            block={block}
            member={member}
            onClick={() => onBlockClick(block)}
          />
        ))}
      </div>

      {/* Bouton + pour ajouter un créneau */}
      <button
        onClick={() => onAddClick(member.id, date)}
        className="mt-1 w-full py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center gap-1"
        aria-label={`Ajouter un créneau pour ${member.name} le ${format(
          dateObj,
          'EEEE d MMMM',
          { locale: fr }
        )}`}
      >
        <Plus className="w-3 h-3" />
        <span className="hidden sm:inline">Ajouter</span>
      </button>
    </td>
  )
}
