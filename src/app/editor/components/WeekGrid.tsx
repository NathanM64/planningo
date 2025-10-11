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

// Heures de 8h à 18h
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8)

export default function WeekGrid() {
  const { agenda, goToPreviousWeek, goToNextWeek, goToToday } = useEditorStore()

  // État du modal
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
              Aujourd'hui
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Message si pas de membres */}
        {!hasMembers && (
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucun membre dans l'équipe
              </h3>
              <p className="text-gray-600">
                Ajoutez des membres dans la barre latérale pour commencer à
                créer votre planning.
              </p>
            </div>
          </div>
        )}

        {/* Grille avec membres */}
        {hasMembers && (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* En-tête des jours */}
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-32 p-3 text-left text-sm font-semibold text-gray-700 border-r-2 border-gray-200 sticky left-0 bg-gray-50 z-10">
                    Membre
                  </th>
                  {weekDays.map((day, index) => {
                    const isToday =
                      formatDateISO(day) === formatDateISO(new Date())
                    return (
                      <th
                        key={index}
                        className={`p-3 text-center text-sm font-semibold border-r border-gray-200 min-w-[120px] ${
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

                      // Récupérer les blocs de ce membre pour ce jour
                      const blocksForDay = agenda.blocks.filter(
                        (block) =>
                          block.memberId === member.id && block.date === dateISO
                      )

                      return (
                        <td
                          key={dayIndex}
                          className={`relative border-r border-gray-200 align-top p-2 ${
                            isToday ? 'bg-blue-50/30' : ''
                          }`}
                          style={{ height: '120px' }}
                        >
                          {/* Zone cliquable pour ajouter un créneau */}
                          <div
                            className="w-full h-full rounded hover:bg-gray-100 cursor-pointer transition flex flex-col gap-1 p-1"
                            onClick={() =>
                              handleCreateBlock(member.id, dateISO)
                            }
                          >
                            {/* Afficher les blocs existants */}
                            {blocksForDay.map((block) => (
                              <div
                                key={block.id}
                                className="rounded px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-80 transition"
                                style={{
                                  backgroundColor: member.color,
                                  color: 'white',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditBlock(block)
                                }}
                              >
                                <div className="font-bold">
                                  {block.start} - {block.end}
                                </div>
                                {block.label && (
                                  <div className="truncate">{block.label}</div>
                                )}
                              </div>
                            ))}
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

      {/* Modal de création/édition */}
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
