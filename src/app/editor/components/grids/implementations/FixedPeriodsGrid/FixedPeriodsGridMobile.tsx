'use client'

import { useMemo, memo, useState } from 'react'
import { formatDateISO } from '@/types/agenda'
import { useGridData } from '@/app/editor/hooks/useGridData'
import { useBlockModal } from '@/app/editor/hooks/useBlockModal'
import { createBlockIndexByMemberDatePeriod } from '@/app/editor/lib/block-indexer'
import GridHeader from '../../BaseGrid/GridHeader'
import GridEmptyState from '../../BaseGrid/GridEmptyState'
import FixedPeriodsCell from './FixedPeriodsCell'
import PropertiesPanel from '../../../panels/PropertiesPanel'

/**
 * Version mobile de FixedPeriodsGrid
 * - Tabs horizontaux pour sélectionner un membre
 * - Scroll horizontal pour les jours
 * - Périodes affichées verticalement dans chaque jour
 */
function FixedPeriodsGridMobile() {
  const {
    agenda,
    weekDays,
    today,
    hasMembers,
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

  // État local pour le membre sélectionné
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0)

  // Récupérer les périodes fixes
  const periods = useMemo(() => {
    if (!agenda) {
      return [
        { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
        { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' },
      ]
    }
    return agenda.fixedPeriods || [
      { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
      { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' },
    ]
  }, [agenda])

  // Indexer les blocs par membre, date ET période
  const blocksByMemberDatePeriod = useMemo(() => {
    if (!agenda) return {}
    return createBlockIndexByMemberDatePeriod(agenda.blocks)
  }, [agenda])

  if (!agenda) return null

  const selectedMember = agenda.members[selectedMemberIndex]

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Header avec navigation */}
        <GridHeader
          weekStart={agenda.currentWeekStart}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />

        {/* État vide si pas de membres */}
        {!hasMembers ? (
          <GridEmptyState />
        ) : (
          <>
            {/* Tabs pour sélectionner un membre */}
            <div className="border-b-2 border-gray-200 overflow-x-auto">
              <div className="flex min-w-max">
                {agenda.members.map((member, index) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMemberIndex(index)}
                    className={`
                      px-4 py-3 text-sm font-medium whitespace-nowrap
                      border-b-2 transition-colors
                      ${
                        selectedMemberIndex === index
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Grille des jours (scroll horizontal) */}
            <div className="overflow-x-auto">
              <div className="flex min-w-max">
                {weekDays.map((day, dayIndex) => {
                  const dateISO = formatDateISO(day)
                  const isToday = dateISO === today

                  // Format jour de la semaine
                  const dayName = day.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                  })
                  const dayNumber = day.getDate()

                  return (
                    <div
                      key={dayIndex}
                      className={`
                        w-40 flex-shrink-0 border-r border-gray-200 last:border-r-0
                        ${isToday ? 'bg-blue-50' : ''}
                      `}
                    >
                      {/* En-tête du jour */}
                      <div
                        className={`
                          p-3 text-center border-b border-gray-200
                          ${isToday ? 'bg-blue-100' : 'bg-gray-50'}
                        `}
                      >
                        <div className="text-xs font-medium text-gray-600 uppercase">
                          {dayName}
                        </div>
                        <div
                          className={`
                            text-lg font-bold mt-1
                            ${isToday ? 'text-blue-600' : 'text-gray-900'}
                          `}
                        >
                          {dayNumber}
                        </div>
                      </div>

                      {/* Cellule avec périodes */}
                      <FixedPeriodsCell
                        member={selectedMember}
                        date={dateISO}
                        dateObj={day}
                        isToday={isToday}
                        periods={periods}
                        blocksByPeriod={blocksByMemberDatePeriod}
                        onBlockClick={openEditModal}
                        onAddClick={openCreateModal}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Properties Panel (drawer en bottom sheet sur mobile) */}
      <PropertiesPanel
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalContext}
      />
    </>
  )
}

export default memo(FixedPeriodsGridMobile)
