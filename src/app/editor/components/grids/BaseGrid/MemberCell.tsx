'use client'

import { Member } from '@/types/agenda'

interface MemberCellProps {
  member: Member
}

export default function MemberCell({ member }: MemberCellProps) {
  return (
    <td className="p-2 sm:p-3 border-r-2 border-gray-200 sticky left-0 z-20 bg-white">
      {/* Background coloré avec opacité */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: member.color }}
      />

      {/* Contenu */}
      <div className="relative flex items-center gap-1.5 sm:gap-2">
        <div
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: member.color }}
          aria-hidden="true"
        />
        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
          {member.name}
        </span>
      </div>
    </td>
  )
}
