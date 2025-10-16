'use client'

import { Member, AgendaBlock } from '@/types/agenda'
import { Users } from 'lucide-react'

interface PeriodBlockProps {
  block: AgendaBlock
  member: Member
  onClick: () => void
}

export default function PeriodBlock({
  block,
  member,
  onClick,
}: PeriodBlockProps) {
  const memberCount = block.memberIds.length
  const isMultiMember = memberCount > 1

  return (
    <div
      className="rounded p-1.5 text-xs cursor-pointer hover:opacity-80 transition-opacity duration-150"
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
      aria-label={`Modifier le créneau ${block.label || 'sans période'}${
        isMultiMember ? `, partagé avec ${memberCount} membres` : ''
      }`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }
      }}
    >
      {/* Badge multi-membre ou simple marqueur */}
      {isMultiMember ? (
        <div className="text-[9px] sm:text-xs text-gray-600 flex items-center justify-center gap-0.5">
          <Users className="w-3 h-3" />
          <span>{memberCount}</span>
        </div>
      ) : (
        <div className="text-center text-gray-600 font-bold">•</div>
      )}
    </div>
  )
}
