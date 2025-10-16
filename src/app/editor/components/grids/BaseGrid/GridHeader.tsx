'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button, Input } from '@/components/ui'
import { ChevronLeft, ChevronRight, Calendar, UserPlus, X, Check } from 'lucide-react'
import { getWeekDays } from '@/types/agenda'
import { useEditorStore } from '@/stores/editorStore'

interface GridHeaderProps {
  weekStart: string
  onPreviousWeek: () => void
  onNextWeek: () => void
  onToday: () => void
  showAddMember?: boolean
}

export default function GridHeader({
  weekStart,
  onPreviousWeek,
  onNextWeek,
  onToday,
  showAddMember = true,
}: GridHeaderProps) {
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])
  const { addMember } = useEditorStore()
  const [isAdding, setIsAdding] = useState(false)
  const [memberName, setMemberName] = useState('')

  const handleAddMember = () => {
    if (memberName.trim()) {
      addMember(memberName.trim())
      setMemberName('')
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-gray-50 border-b-2 border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            {format(weekDays[0], 'd MMM', { locale: fr })} -{' '}
            {format(weekDays[6], 'd MMM yyyy', { locale: fr })}
          </h2>

          {showAddMember && (
            <>
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nom du membre"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddMember()
                      if (e.key === 'Escape') {
                        setIsAdding(false)
                        setMemberName('')
                      }
                    }}
                    className="w-40 h-8 text-sm"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddMember}
                    className="p-1 h-8"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAdding(false)
                      setMemberName('')
                    }}
                    className="p-1 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAdding(true)}
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  <span className="hidden sm:inline">Ajouter membre</span>
                  <span className="sm:hidden">Membre</span>
                </Button>
              )}
            </>
          )}
        </div>

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
