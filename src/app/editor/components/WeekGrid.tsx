// src/app/editor/components/WeekGrid.tsx
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

function WeekGrid() {
  const { agenda, goToPreviousWeek, goToNextWeek, goToToday } = useEditorStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMemberId, setModalMemberId] = useState<string | undefined>()
  const [modalDate, setModalDate] = useState<string | undefined>()
  const [blockToEdit, setBlockToEdit] = useState<AgendaBlock | null>(null)

  // Memoize calculations to avoid recalculating on every render
  // MUST be before any conditional returns to follow React Hooks rules
  const weekDays = useMemo(
    () => agenda ? getWeekDays(agenda.currentWeekStart) : [],
    [agenda]
  )
  const today = useMemo(() => formatDateISO(new Date()), [])

  // Optimisation: créer un index des blocs par membre et date pour éviter les filtres répétés
  const blocksByMemberAndDate = useMemo(() => {
    if (!agenda) return {}
    const index: Record<string, AgendaBlock[]> = {}
    agenda.blocks.forEach(block => {
      block.memberIds.forEach(memberId => {
        const key = `${memberId}-${block.date}`
        if (!index[key]) index[key] = []
        index[key].push(block)
      })
    })
    return index
  }, [agenda])

  const handleCreateBlock = useCallback((memberId: string, date: string) => {
    setModalMemberId(memberId)
    setModalDate(date)
    setBlockToEdit(null)
    setIsModalOpen(true)
  }, [])

  const handleEditBlock = useCallback((block: AgendaBlock) => {
    setBlockToEdit(block)
    setModalMemberId(undefined)
    setModalDate(undefined)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setModalMemberId(undefined)
    setModalDate(undefined)
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
                        className={`p-2 sm:p-3 border-r border-gray-200 text-center min-w-[100px] sm:min-w-[120px] ${
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

                    {/* Colonnes des jours */}
                    {weekDays.map((day, dayIndex) => {
                      const dateISO = formatDateISO(day)
                      const isToday = dateISO === today

                      // 🆕 Récupérer les blocs depuis l'index optimisé
                      const key = `${member.id}-${dateISO}`
                      const blocksForDay = blocksByMemberAndDate[key] || []

                      return (
                        <td
                          key={dayIndex}
                          className={`relative border-r border-gray-200 align-top p-1.5 sm:p-2 ${
                            isToday ? 'bg-blue-50/30' : ''
                          }`}
                          style={{ minHeight: '80px' }}
                        >
                          {/* Afficher les blocs */}
                          <div className="space-y-1 min-h-[60px]">
                            {blocksForDay.map((block) => {
                              // 🆕 Afficher combien de membres sont sur ce bloc
                              const memberCount = block.memberIds.length
                              const isMultiMember = memberCount > 1

                              return (
                                <div
                                  key={block.id}
                                  className="rounded p-1.5 sm:p-2 text-xs cursor-pointer hover:opacity-80 transition"
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
                                  aria-label={`Modifier le créneau de ${block.start} à ${block.end}${block.label ? `, ${block.label}` : ''}`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleEditBlock(block)
                                    }
                                  }}
                                >
                                  <div className="font-semibold text-[10px] sm:text-xs">
                                    {block.start} - {block.end}
                                  </div>
                                  {block.label && (
                                    <div className="text-gray-700 mt-0.5 text-[10px] sm:text-xs">
                                      {block.label}
                                    </div>
                                  )}
                                  {/* 🆕 Badge si plusieurs membres */}
                                  {isMultiMember && (
                                    <div className="text-[9px] sm:text-xs text-gray-600 mt-0.5 flex items-center gap-0.5">
                                      <span>👥</span>
                                      <span>{memberCount}</span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Bouton + pour ajouter un créneau */}
                          <button
                            onClick={() => handleCreateBlock(member.id, dateISO)}
                            className="mt-1 w-full py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center gap-1"
                            aria-label={`Ajouter un créneau pour ${member.name} le ${format(day, 'EEEE d MMMM', { locale: fr })}`}
                          >
                            <Plus className="w-3 h-3" />
                            <span className="hidden sm:inline">Ajouter</span>
                          </button>
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
        blockToEdit={blockToEdit}
      />
    </>
  )
}

export default memo(WeekGrid)
