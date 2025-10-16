'use client'

import { Member, AgendaBlock } from '@/types/agenda'
import { Users } from 'lucide-react'

interface PreciseHoursBlockProps {
  block: AgendaBlock
  member: Member
  onClick: () => void
}

export default function PreciseHoursBlock({
  block,
  member,
  onClick,
}: PreciseHoursBlockProps) {
  const memberCount = block.memberIds.length
  const isMultiMember = memberCount > 1

  return (
    <div
      className="rounded p-1.5 sm:p-2 text-xs cursor-pointer hover:opacity-80 transition-opacity duration-150"
      style={{
        backgroundColor: member.color + '40',
        borderLeft: `2px solid ${member.color}`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      role="button"
      tabIndex={0}
      aria-label={`Modifier le créneau de ${block.start} à ${block.end}${
        block.label ? `, ${block.label}` : ''
      }${isMultiMember ? `, partagé avec ${memberCount} membres` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }
      }}
    >
      {/* Horaires */}
      <div className="font-semibold text-[10px] sm:text-xs text-gray-900">
        {block.start} - {block.end}
      </div>

      {/* Label optionnel */}
      {block.label && (
        <div className="text-gray-700 mt-0.5 text-[10px] sm:text-xs">
          {block.label}
        </div>
      )}

      {/* Badge multi-membre */}
      {isMultiMember && (
        <div className="text-[9px] sm:text-xs text-gray-600 mt-0.5 flex items-center gap-0.5">
          <Users className="w-3 h-3" />
          <span>{memberCount}</span>
        </div>
      )}
    </div>
  )
}
