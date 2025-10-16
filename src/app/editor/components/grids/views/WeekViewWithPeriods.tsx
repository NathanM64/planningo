// src/app/editor/components/grids/views/WeekViewWithPeriods.tsx
'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { formatDateISO } from '@/types/agenda'
import { useGridData } from '@/app/editor/hooks/useGridData'
import { useBlockModal } from '@/app/editor/hooks/useBlockModal'
import GridHeader from '../BaseGrid/GridHeader'
import GridTableHeader from '../BaseGrid/GridTableHeader'
import PropertiesPanel from '../../panels/PropertiesPanel'

/**
 * WeekViewWithPeriods - Vue semaine avec périodes en lignes
 * Pour le cas d'usage: rotation
 * Grille : Périodes (Matin/Midi/Soir) × Jours
 */
export default function WeekViewWithPeriods() {
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

  // Récupérer les périodes fixes (par défaut Matin/Soir)
  const periods = useMemo(() => {
    if (!agenda) {
      return [
        { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
        { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' },
      ]
    }
    return (
      agenda.fixedPeriods || [
        { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
        { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' },
      ]
    )
  }, [agenda])

  // Indexer les blocs par date et période
  const blocksByDateAndPeriod = useMemo(() => {
    if (!agenda) return {}

    const indexed: Record<string, typeof agenda.blocks> = {}

    agenda.blocks.forEach((block) => {
      // Déterminer la période du bloc selon son horaire
      const period = periods.find((p) => {
        if (!p.defaultStart || !p.defaultEnd) return false
        return block.start >= p.defaultStart && block.end <= p.defaultEnd
      })

      if (period) {
        const key = `${block.date}-${period.id}`
        if (!indexed[key]) {
          indexed[key] = []
        }
        indexed[key].push(block)
      }
    })

    return indexed
  }, [agenda, periods])

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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <GridTableHeader weekDays={weekDays} today={today} />

            <tbody>
              {periods.map((period) => (
                <tr key={period.id} className="border-b-2 border-gray-200">
                  {/* Cellule période (ligne) */}
                  <td className="w-40 p-4 bg-gray-50 border-r-2 border-gray-200 sticky left-0 z-10">
                    <div className="font-semibold text-gray-900">
                      {period.label}
                    </div>
                    {period.defaultStart && period.defaultEnd && (
                      <div className="text-xs text-gray-500 mt-1">
                        {period.defaultStart} - {period.defaultEnd}
                      </div>
                    )}
                  </td>

                  {/* Cellules jours */}
                  {weekDays.map((day, dayIndex) => {
                    const dateISO = formatDateISO(day)
                    const isToday = dateISO === today
                    const cellKey = `${dateISO}-${period.id}`
                    const cellBlocks = blocksByDateAndPeriod[cellKey] || []

                    return (
                      <td
                        key={dayIndex}
                        className={`p-2 align-top border-r border-gray-200 min-w-[140px] ${
                          isToday ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Créneaux dans cette cellule */}
                        <div className="space-y-2 min-h-[80px]">
                          {cellBlocks.map((block) => {
                            // Récupérer les membres assignés
                            const blockMembers = agenda.members.filter((m) =>
                              block.memberIds.includes(m.id)
                            )

                            return (
                              <button
                                key={block.id}
                                onClick={() => openEditModal(block)}
                                className="w-full text-left p-2 rounded-lg border
                                           hover:shadow-md transition cursor-pointer
                                           bg-white"
                              >
                                <div className="text-sm font-semibold text-gray-900 truncate mb-1">
                                  {block.label || 'Sans titre'}
                                </div>

                                {/* Badges membres */}
                                {blockMembers.length > 0 && (
                                  <div className="flex gap-1 flex-wrap">
                                    {blockMembers.map((member) => (
                                      <span
                                        key={member.id}
                                        className="inline-block px-2 py-0.5 text-xs
                                                   rounded-full font-medium"
                                        style={{
                                          backgroundColor: `${member.color}30`,
                                          color: member.color,
                                        }}
                                      >
                                        {member.name}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {blockMembers.length === 0 && (
                                  <div className="text-xs text-gray-500">
                                    Aucun membre assigné
                                  </div>
                                )}
                              </button>
                            )
                          })}

                          {/* Bouton ajouter créneau */}
                          <button
                            onClick={() => {
                              // Ouvrir le modal avec horaires pré-remplis de la période
                              openCreateModal('', dateISO, period.id)
                            }}
                            className="w-full p-2 border-2 border-dashed border-gray-300
                                       rounded-lg hover:border-blue-400 hover:bg-blue-50
                                       transition text-gray-400 hover:text-blue-600
                                       flex items-center justify-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-xs font-medium">Ajouter</span>
                          </button>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
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
