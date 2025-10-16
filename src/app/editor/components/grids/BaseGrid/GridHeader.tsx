'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { getWeekDays } from '@/types/agenda'

interface GridHeaderProps {
  weekStart: string
  onPreviousWeek: () => void
  onNextWeek: () => void
  onToday: () => void
}

export default function GridHeader({
  weekStart,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: GridHeaderProps) {
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])

  return (
    <div className="bg-gray-50 border-b-2 border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          {format(weekDays[0], 'd MMM', { locale: fr })} -{' '}
          {format(weekDays[6], 'd MMM yyyy', { locale: fr })}
        </h2>

        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={onPreviousWeek}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            aria-label="Semaine précédente"
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Précédente</span>
            <span className="sm:hidden">Préc.</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onToday}
            leftIcon={<Calendar className="w-4 h-4" />}
            aria-label="Revenir à aujourd'hui"
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Aujourd&apos;hui</span>
            <span className="sm:hidden">Auj.</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onNextWeek}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            aria-label="Semaine suivante"
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Suivante</span>
            <span className="sm:hidden">Suiv.</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
