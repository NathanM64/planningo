'use client'

import { useMemo, memo } from 'react'
import { formatDateISO } from '@/types/agenda'
import { useGridData } from '@/app/editor/hooks/useGridData'
import { useBlockModal } from '@/app/editor/hooks/useBlockModal'
import { createBlockIndexByMemberDatePeriod } from '@/app/editor/lib/block-indexer'
import GridHeader from '../../BaseGrid/GridHeader'
import GridEmptyState from '../../BaseGrid/GridEmptyState'
import GridTableHeader from '../../BaseGrid/GridTableHeader'
import MemberCell from '../../BaseGrid/MemberCell'
import FixedPeriodsCell from './FixedPeriodsCell'
import BlockModal from '../../../BlockModal'

function FixedPeriodsGrid() {
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

  // Récupérer les périodes fixes (par défaut Matin/Soir)
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

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <GridHeader
          weekStart={agenda.currentWeekStart}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />

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

                      return (
                        <FixedPeriodsCell
                          key={dayIndex}
                          member={member}
                          date={dateISO}
                          dateObj={day}
                          isToday={isToday}
                          periods={periods}
                          blocksByPeriod={blocksByMemberDatePeriod}
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

      <BlockModal
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalContext}
      />
    </>
  )
}

export default memo(FixedPeriodsGrid)
