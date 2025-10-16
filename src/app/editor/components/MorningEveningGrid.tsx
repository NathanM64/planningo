// src/app/editor/components/MorningEveningGrid.tsx
'use client'

import { useState, useMemo, memo, useCallback } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { getWeekDays, formatDateISO } from '@/types/agenda'
import { AgendaBlock } from '@/types/agenda'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react'
import BlockModal from './BlockModal'

function MorningEveningGrid() {
  const { agenda, goToPreviousWeek, goToNextWeek, goToToday } = useEditorStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMemberId, setModalMemberId] = useState<string | undefined>()
  const [modalDate, setModalDate] = useState<string | undefined>()
  const [modalPeriod, setModalPeriod] = useState<string | undefined>()
  const [blockToEdit, setBlockToEdit] = useState<AgendaBlock | null>(null)

  // Memoize calculations
  const weekDays = useMemo(
    () => agenda ? getWeekDays(agenda.currentWeekStart) : [],
    [agenda]
  )
  const today = useMemo(() => formatDateISO(new Date()), [])

  // Récupérer les périodes fixes (par défaut: Matin/Soir)
  const periods = useMemo(() => {
    if (!agenda) return [
      { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
      { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' }
    ]
    return agenda.fixedPeriods || [
      { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
      { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' }
    ]
  }, [agenda])

  // Optimisation: créer un index des blocs par membre, date et période
  const blocksByMemberDatePeriod = useMemo(() => {
    if (!agenda) return {}
    const index: Record<string, AgendaBlock[]> = {}
    agenda.blocks.forEach(block => {
      // Pour les blocs avec périodes fixes, on utilise le label comme période
      const period = block.label || 'Matin'
      block.memberIds.forEach(memberId => {
        const key = `${memberId}-${block.date}-${period}`
        if (!index[key]) index[key] = []
        index[key].push(block)
      })
    })
    return index
  }, [agenda])

  const handleCreateBlock = useCallback((memberId: string, date: string, period: string) => {
    setModalMemberId(memberId)
    setModalDate(date)
    setModalPeriod(period)
    setBlockToEdit(null)
    setIsModalOpen(true)
  }, [])

  const handleEditBlock = useCallback((block: AgendaBlock) => {
    setBlockToEdit(block)
    setModalMemberId(undefined)
    setModalDate(undefined)
    setModalPeriod(undefined)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setModalMemberId(undefined)
    setModalDate(undefined)
    setModalPeriod(undefined)
    setBlockToEdit(null)
  }, [])

  if (!agenda) return null

  const hasMembers = agenda.members.length > 0

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Header avec navigation */}
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
                onClick={goToPreviousWeek}
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
                onClick={goToToday}
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
                onClick={goToNextWeek}
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

        {/* Message si pas de membres */}
        {!hasMembers ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-semibold mb-2">
              Aucun membre dans l&apos;équipe
            </p>
            <p className="text-sm">
              Ajoutez des membres dans la sidebar pour commencer
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 sm:p-3 border-r-2 border-gray-200 sticky left-0 z-30 bg-gray-50 min-w-[100px] sm:min-w-[150px]">
                    <span className="text-xs sm:text-sm font-bold text-gray-700">
                      Membre
                    </span>
                  </th>
                  {weekDays.map((day, index) => {
                    const dateISO = formatDateISO(day)
                    const isToday = dateISO === today
                    return (
                      <th
                        key={index}
                        className={`p-2 sm:p-3 border-r border-gray-200 text-center min-w-[150px] sm:min-w-[180px] ${
                          isToday ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                        }`}
                      >
                        <div className="text-xs sm:text-sm">{format(day, 'EEE', { locale: fr })}</div>
                        <div className="text-base sm:text-lg font-bold">
                          {format(day, 'd')}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody>
                {agenda.members.map((member) => (
                  <tr key={member.id} className="border-b-2 border-gray-200">
                    {/* Colonne membre */}
                    <td
                      className="p-2 sm:p-3 border-r-2 border-gray-200 sticky left-0 z-20 bg-white"
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundColor: member.color }}
                      />
                      <div className="relative flex items-center gap-1.5 sm:gap-2">
                        <div
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: member.color }}
                        />
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    {/* Colonnes des jours (avec sous-colonnes pour chaque période) */}
                    {weekDays.map((day, dayIndex) => {
                      const dateISO = formatDateISO(day)
                      const isToday = dateISO === today

                      return (
                        <td
                          key={dayIndex}
                          className={`relative border-r border-gray-200 align-top p-0 ${
                            isToday ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {/* Diviser en périodes (Matin / Soir) */}
                          <div className="grid grid-cols-2 divide-x divide-gray-200">
                            {periods.map((period) => {
                              const key = `${member.id}-${dateISO}-${period.label}`
                              const blocksForPeriod = blocksByMemberDatePeriod[key] || []

                              return (
                                <div
                                  key={period.id}
                                  className="p-1.5 sm:p-2 min-h-[80px] flex flex-col"
                                >
                                  {/* Titre de la période */}
                                  <div className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1 text-center">
                                    {period.label}
                                  </div>

                                  {/* Afficher les blocs */}
                                  <div className="space-y-1 flex-1">
                                    {blocksForPeriod.map((block) => {
                                      const memberCount = block.memberIds.length
                                      const isMultiMember = memberCount > 1

                                      return (
                                        <div
                                          key={block.id}
                                          className="rounded p-1.5 text-xs cursor-pointer hover:opacity-80 transition"
                                          style={{
                                            backgroundColor: member.color + '40',
                                            borderLeft: `2px solid ${member.color}`,
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditBlock(block)
                                          }}
                                          role="button"
                                          tabIndex={0}
                                          aria-label={`Modifier le créneau ${period.label}`}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                              e.preventDefault()
                                              e.stopPropagation()
                                              handleEditBlock(block)
                                            }
                                          }}
                                        >
                                          {/* Pas d'heures affichées en mode périodes fixes - la période est déjà dans le titre */}
                                          {/* Badge si plusieurs membres */}
                                          {isMultiMember && (
                                            <div className="text-[9px] sm:text-xs text-gray-600 flex items-center justify-center gap-0.5">
                                              <span>👥</span>
                                              <span>{memberCount}</span>
                                            </div>
                                          )}
                                          {!isMultiMember && (
                                            <div className="text-center text-gray-600">•</div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>

                                  {/* Bouton + pour ajouter un créneau */}
                                  <button
                                    onClick={() => handleCreateBlock(member.id, dateISO, period.label)}
                                    className="mt-1 w-full py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center gap-0.5"
                                    aria-label={`Ajouter un créneau ${period.label} pour ${member.name} le ${format(day, 'EEEE d MMMM', { locale: fr })}`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        memberId={modalMemberId}
        date={modalDate}
        period={modalPeriod}
        blockToEdit={blockToEdit}
      />
    </>
  )
}

export default memo(MorningEveningGrid)
