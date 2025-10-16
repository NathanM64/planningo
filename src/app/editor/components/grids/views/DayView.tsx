// src/app/editor/components/grids/views/DayView.tsx
'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { formatDateLong, formatDateISO } from '@/lib/date-utils'

export default function DayView() {
  const agenda = useEditorStore((state) => state.agenda)
  const currentDay = useEditorStore((state) => state.currentDay)
  const setCurrentDay = useEditorStore((state) => state.setCurrentDay)

  // Si currentDay n'est pas défini, utiliser aujourd'hui
  const displayDate = currentDay || formatDateISO(new Date())

  const dayTitle = useMemo(() => {
    return formatDateLong(new Date(displayDate))
  }, [displayDate])

  const hours = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => i + 7) // 7h-20h
  }, [])

  const blocksForDay = useMemo(() => {
    if (!agenda) return []
    return agenda.blocks.filter((b) => b.date === displayDate)
  }, [agenda, displayDate])

  const handlePreviousDay = () => {
    const d = new Date(displayDate)
    d.setDate(d.getDate() - 1)
    setCurrentDay(formatDateISO(d))
  }

  const handleNextDay = () => {
    const d = new Date(displayDate)
    d.setDate(d.getDate() + 1)
    setCurrentDay(formatDateISO(d))
  }

  const handleToday = () => {
    setCurrentDay(formatDateISO(new Date()))
  }

  if (!agenda) return null

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={handlePreviousDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Jour précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold capitalize">{dayTitle}</h3>
          <button
            onClick={handleToday}
            className="text-sm text-blue-600 hover:underline"
          >
            Aujourd'hui
          </button>
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Jour suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Timeline */}
      <div className="flex max-h-[600px] overflow-y-auto">
        {/* Colonne des heures */}
        <div className="w-16 flex-shrink-0 border-r bg-gray-50">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b flex items-start justify-center pt-1"
            >
              <span className="text-xs text-gray-500 font-medium">
                {hour.toString().padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Colonne des créneaux */}
        <div className="flex-1 relative">
          {hours.map((hour) => {
            const blocksAtHour = blocksForDay.filter((b) => {
              const blockHour = parseInt(b.start.split(':')[0])
              return blockHour === hour
            })

            return (
              <div
                key={hour}
                className="h-16 border-b hover:bg-blue-50 transition cursor-pointer relative"
              >
                {/* Blocs à cette heure */}
                {blocksAtHour.map((block) => {
                  const member = agenda.members.find((m) => m.id === block.memberIds[0])

                  // Calculer position et hauteur
                  const [startHour, startMin] = block.start.split(':').map(Number)
                  const [endHour, endMin] = block.end.split(':').map(Number)

                  const topOffset = (startMin / 60) * 64 // 64px = h-16
                  const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin)
                  const height = (duration / 60) * 64

                  return (
                    <div
                      key={block.id}
                      className="absolute left-1 right-1 rounded-lg p-2 cursor-pointer
                                 hover:shadow-lg hover:z-10 transition border-l-4"
                      style={{
                        top: `${topOffset}px`,
                        height: `${height}px`,
                        backgroundColor: member ? `${member.color}20` : '#e5e7eb',
                        borderLeftColor: member?.color || '#9ca3af',
                      }}
                    >
                      <div className="text-sm font-semibold truncate">
                        {block.label || 'Sans titre'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {block.start} - {block.end}
                      </div>
                      {block.memberIds.length > 1 && (
                        <div className="text-xs text-gray-500">
                          +{block.memberIds.length - 1} autre
                          {block.memberIds.length > 2 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Message si aucun créneau */}
      {blocksForDay.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Aucun créneau pour cette journée
        </div>
      )}
    </div>
  )
}
