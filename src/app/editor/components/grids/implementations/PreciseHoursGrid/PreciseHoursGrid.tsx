'use client'

import { useMemo, memo } from 'react'
import { formatDateISO } from '@/types/agenda'
import { useGridData } from '@/app/editor/hooks/useGridData'
import { useBlockModal } from '@/app/editor/hooks/useBlockModal'
import { createBlockIndexByMemberDate } from '@/app/editor/lib/block-indexer'
import GridHeader from '../../BaseGrid/GridHeader'
import GridEmptyState from '../../BaseGrid/GridEmptyState'
import GridTableHeader from '../../BaseGrid/GridTableHeader'
import MemberCell from '../../BaseGrid/MemberCell'
import PreciseHoursCell from './PreciseHoursCell'
import BlockModal from '../../../BlockModal'

function PreciseHoursGrid() {
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

  // Indexer les blocs pour un accès O(1)
  const blocksByMemberAndDate = useMemo(() => {
    if (!agenda) return {}
    return createBlockIndexByMemberDate(agenda.blocks)
  }, [agenda])

  if (!agenda) return null

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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <GridTableHeader weekDays={weekDays} today={today} />

              <tbody>
                {agenda.members.map((member) => (
                  <tr key={member.id} className="border-b-2 border-gray-200">
                    <MemberCell member={member} />

                    {weekDays.map((day, dayIndex) => {
                      const dateISO = formatDateISO(day)
                      const isToday = dateISO === today
                      const key = `${member.id}-${dateISO}`
                      const blocksForDay = blocksByMemberAndDate[key] || []

                      return (
                        <PreciseHoursCell
                          key={dayIndex}
                          member={member}
                          date={dateISO}
                          dateObj={day}
                          isToday={isToday}
                          blocks={blocksForDay}
                          onBlockClick={openEditModal}
                          onAddClick={openCreateModal}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal d'édition/création */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalContext}
      />
    </>
  )
}

export default memo(PreciseHoursGrid)
