// src/app/editor/components/grids/views/WeekViewSimple.tsx
'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useGridData } from '@/app/editor/hooks/useGridData'
import { useBlockModal } from '@/app/editor/hooks/useBlockModal'
import { formatDateISO } from '@/types/agenda'
import GridHeader from '../BaseGrid/GridHeader'
import PropertiesPanel from '../../panels/PropertiesPanel'

/**
 * WeekViewSimple - Vue semaine simple sans lignes
 * Pour les cas d'usage: team, personal, other
 * 7 colonnes (jours), créneaux empilés verticalement
 */
export default function WeekViewSimple() {
  const {
    agenda,
    weekDays,
    today,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  } = useGridData()

  const {
    isModalOpen,
    modalContext,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useBlockModal()

  // Grouper les blocs par date
  const blocksByDate = useMemo(() => {
    if (!agenda) return {}

    const grouped: Record<string, typeof agenda.blocks> = {}

    agenda.blocks.forEach((block) => {
      if (!grouped[block.date]) {
        grouped[block.date] = []
      }
      grouped[block.date].push(block)
    })

    // Trier les blocs par heure de début
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => a.start.localeCompare(b.start))
    })

    return grouped
  }, [agenda])

  if (!agenda) return null

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <GridHeader
          weekStart={agenda.currentWeekStart}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />

        {/* Grille 7 colonnes */}
        <div className="grid grid-cols-7 divide-x divide-gray-200 min-h-[500px]">
          {weekDays.map((day, dayIndex) => {
            const dateISO = formatDateISO(day)
            const isToday = dateISO === today
            const dayBlocks = blocksByDate[dateISO] || []

            // Nom du jour (court)
            const dayName = day.toLocaleDateString('fr-FR', { weekday: 'short' })
            const dayNumber = day.getDate()

            return (
              <div key={dayIndex} className="flex flex-col">
                {/* En-tête jour */}
                <div
                  className={`p-3 border-b text-center ${
                    isToday
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-xs uppercase text-gray-500 font-medium">
                    {dayName}
                  </div>
                  <div
                    className={`text-lg font-bold mt-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {dayNumber}
                  </div>
                </div>

                {/* Créneaux empilés */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {dayBlocks.map((block) => {
                    // Récupérer les membres assignés
                    const blockMembers = agenda.members.filter((m) =>
                      block.memberIds.includes(m.id)
                    )
                    const firstMember = blockMembers[0]

                    return (
                      <button
                        key={block.id}
                        onClick={() => openEditModal(block)}
                        className="w-full text-left p-2 rounded-lg border-l-4
                                   hover:shadow-md transition cursor-pointer"
                        style={{
                          backgroundColor: firstMember
                            ? `${firstMember.color}20`
                            : '#f3f4f6',
                          borderLeftColor: firstMember?.color || '#9ca3af',
                        }}
                      >
                        <div className="text-xs text-gray-600 mb-1">
                          {block.start} - {block.end}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {block.label || 'Sans titre'}
                        </div>

                        {/* Afficher les membres assignés */}
                        {blockMembers.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {blockMembers.map((member) => (
                              <span
                                key={member.id}
                                className="inline-block px-1.5 py-0.5 text-xs rounded"
                                style={{
                                  backgroundColor: `${member.color}40`,
                                  color: member.color,
                                }}
                              >
                                {member.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}

                  {/* Bouton ajouter créneau */}
                  <button
                    onClick={() => openCreateModal('', dateISO)}
                    className="w-full p-3 border-2 border-dashed border-gray-300
                               rounded-lg hover:border-blue-400 hover:bg-blue-50
                               transition text-gray-500 hover:text-blue-600
                               flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Ajouter</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <PropertiesPanel
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalContext}
      />
    </>
  )
}
