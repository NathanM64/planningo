// src/app/editor/components/WeekGrid.tsx
'use client'

import { useState } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { getWeekDays, formatDateISO } from '@/types/agenda'
import { AgendaBlock } from '@/types/agenda'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import BlockModal from './BlockModal'

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8)

export default function WeekGrid() {
  const { agenda, goToPreviousWeek, goToNextWeek, goToToday } = useEditorStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMemberId, setModalMemberId] = useState<string | undefined>()
  const [modalDate, setModalDate] = useState<string | undefined>()
  const [blockToEdit, setBlockToEdit] = useState<AgendaBlock | null>(null)

  const handleCreateBlock = (memberId: string, date: string) => {
    setModalMemberId(memberId)
    setModalDate(date)
    setBlockToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditBlock = (block: AgendaBlock) => {
    setBlockToEdit(block)
    setModalMemberId(undefined)
    setModalDate(undefined)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalMemberId(undefined)
    setModalDate(undefined)
    setBlockToEdit(null)
  }

  if (!agenda) return null

  const weekDays = getWeekDays(agenda.currentWeekStart)
  const hasMembers = agenda.members.length > 0

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Header avec navigation */}
        <div className="bg-gray-50 border-b-2 border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              {format(weekDays[0], 'd MMM', { locale: fr })} -{' '}
              {format(weekDays[6], 'd MMM yyyy', { locale: fr })}
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={goToToday}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Aujourd&apos;hui
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={goToPreviousWeek}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Précédente
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={goToNextWeek}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Suivante
            </Button>
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
                  <th className="p-3 border-r-2 border-gray-200 sticky left-0 z-20 bg-gray-50 min-w-[150px]">
                    <span className="text-sm font-bold text-gray-700">
                      Membre
                    </span>
                  </th>
                  {weekDays.map((day, index) => {
                    const isToday =
                      formatDateISO(day) === formatDateISO(new Date())
                    return (
                      <th
                        key={index}
                        className={`p-3 border-r border-gray-200 text-center min-w-[120px] ${
                          isToday ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                        }`}
                      >
                        <div>{format(day, 'EEE', { locale: fr })}</div>
                        <div className="text-lg font-bold">
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
                      className="p-3 border-r-2 border-gray-200 sticky left-0 z-10"
                      style={{ backgroundColor: member.color + '15' }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: member.color }}
                        />
                        <span className="font-semibold text-gray-900 text-sm truncate">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    {/* Colonnes des jours */}
                    {weekDays.map((day, dayIndex) => {
                      const dateISO = formatDateISO(day)
                      const isToday = dateISO === formatDateISO(new Date())

                      // 🆕 Récupérer les blocs qui contiennent ce membre pour ce jour
                      const blocksForDay = agenda.blocks.filter(
                        (block) =>
                          block.memberIds.includes(member.id) &&
                          block.date === dateISO
                      )

                      return (
                        <td
                          key={dayIndex}
                          className={`relative border-r border-gray-200 align-top p-2 cursor-pointer hover:bg-gray-50 transition ${
                            isToday ? 'bg-blue-50/30' : ''
                          }`}
                          style={{ minHeight: '100px' }}
                          onClick={() => handleCreateBlock(member.id, dateISO)}
                        >
                          {/* Afficher les blocs */}
                          <div className="space-y-1">
                            {blocksForDay.map((block) => {
                              // 🆕 Afficher combien de membres sont sur ce bloc
                              const memberCount = block.memberIds.length
                              const isMultiMember = memberCount > 1

                              return (
                                <div
                                  key={block.id}
                                  className="rounded p-2 text-xs cursor-pointer hover:opacity-80 transition"
                                  style={{
                                    backgroundColor: member.color + '40',
                                    borderLeft: `3px solid ${member.color}`,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditBlock(block)
                                  }}
                                >
                                  <div className="font-semibold">
                                    {block.start} - {block.end}
                                  </div>
                                  {block.label && (
                                    <div className="text-gray-700 mt-1">
                                      {block.label}
                                    </div>
                                  )}
                                  {/* 🆕 Badge si plusieurs membres */}
                                  {isMultiMember && (
                                    <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                      <span>👥</span>
                                      <span>{memberCount} membres</span>
                                    </div>
                                  )}
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
        blockToEdit={blockToEdit}
      />
    </>
  )
}
