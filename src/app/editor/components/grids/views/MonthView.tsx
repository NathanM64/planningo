// src/app/editor/components/grids/views/MonthView.tsx
'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { getMonthDays, formatMonthYear, getPreviousMonth, getNextMonth } from '@/lib/date-utils'

export default function MonthView() {
  const agenda = useEditorStore((state) => state.agenda)
  const setCurrentDay = useEditorStore((state) => state.setCurrentDay)
  const setCurrentView = useEditorStore((state) => state.setCurrentView)

  const monthDays = useMemo(() => {
    if (!agenda) return []
    return getMonthDays(agenda.currentWeekStart)
  }, [agenda?.currentWeekStart])

  const monthTitle = useMemo(() => {
    if (!agenda) return ''
    return formatMonthYear(new Date(agenda.currentWeekStart))
  }, [agenda?.currentWeekStart])

  const handlePreviousMonth = () => {
    if (!agenda) return
    const newWeekStart = getPreviousMonth(agenda.currentWeekStart)
    useEditorStore.setState({
      agenda: { ...agenda, currentWeekStart: newWeekStart },
    })
  }

  const handleNextMonth = () => {
    if (!agenda) return
    const newWeekStart = getNextMonth(agenda.currentWeekStart)
    useEditorStore.setState({
      agenda: { ...agenda, currentWeekStart: newWeekStart },
    })
  }

  const handleDayClick = (dateISO: string) => {
    setCurrentDay(dateISO)
    setCurrentView('day')
  }

  if (!agenda) return null

  const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold capitalize">{monthTitle}</h3>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Mois suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Grille calendrier */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Headers jours de la semaine */}
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}

        {/* Cellules jours */}
        {monthDays.map((day) => {
          const blocksForDay = agenda.blocks.filter((b) => b.date === day.dateISO)
          const memberColors = new Set<string>()
          blocksForDay.forEach((block) => {
            block.memberIds.forEach((memberId) => {
              const member = agenda.members.find((m) => m.id === memberId)
              if (member) memberColors.add(member.color)
            })
          })
          const colors = Array.from(memberColors).slice(0, 5)

          return (
            <button
              key={day.dateISO}
              onClick={() => handleDayClick(day.dateISO)}
              className={`min-h-[80px] p-2 bg-white hover:bg-gray-50 transition text-left ${
                !day.isCurrentMonth ? 'opacity-40' : ''
              } ${day.isToday ? 'ring-2 ring-blue-600 ring-inset' : ''}`}
            >
              <div
                className={`text-sm font-semibold mb-1 ${
                  day.isToday ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                {day.dayNumber}
              </div>

              {blocksForDay.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">
                    {blocksForDay.length} créneau{blocksForDay.length > 1 ? 'x' : ''}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {memberColors.size > 5 && (
                      <div className="text-xs text-gray-500">+</div>
                    )}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
