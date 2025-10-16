'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatDateISO } from '@/types/agenda'

interface GridTableHeaderProps {
  weekDays: Date[]
  today: string
  memberColumnLabel?: string
}

export default function GridTableHeader({
  weekDays,
  today,
  memberColumnLabel = 'Membre',
}: GridTableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-50">
        <th className="p-2 sm:p-3 border-r-2 border-gray-200 sticky left-0 z-30 bg-gray-50 min-w-[100px] sm:min-w-[150px]">
          <span className="text-xs sm:text-sm font-bold text-gray-700">
            {memberColumnLabel}
          </span>
        </th>

        {weekDays.map((day, index) => {
          const dateISO = formatDateISO(day)
          const isToday = dateISO === today

          return (
            <th
              key={index}
              className={`p-2 sm:p-3 border-r border-gray-200 text-center min-w-[100px] sm:min-w-[120px] ${
                isToday ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
              }`}
            >
              <div className="text-xs sm:text-sm">
                {format(day, 'EEE', { locale: fr })}
              </div>
              <div className="text-base sm:text-lg font-bold">
                {format(day, 'd')}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
