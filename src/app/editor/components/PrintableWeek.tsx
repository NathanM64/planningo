// src/app/editor/components/PrintableWeek.tsx
import { forwardRef } from 'react'
import { Agenda, getWeekDays, formatDateISO } from '@/types/agenda'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PrintableWeekProps {
  agenda: Agenda
}

const PrintableWeek = forwardRef<HTMLDivElement, PrintableWeekProps>(
  ({ agenda }, ref) => {
    const weekDays = getWeekDays(agenda.currentWeekStart)

    return (
      <div ref={ref} className="p-8 bg-white">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {agenda.name}
          </h1>
          <p className="text-gray-600">
            Semaine du {format(weekDays[0], 'd MMMM', { locale: fr })} au{' '}
            {format(weekDays[6], 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        {/* Tableau */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-2 border-gray-800 p-3 bg-gray-100 text-left font-bold">
                Membre
              </th>
              {weekDays.map((day, index) => {
                const isToday = formatDateISO(day) === formatDateISO(new Date())
                return (
                  <th
                    key={index}
                    className={`border-2 border-gray-800 p-3 text-center ${
                      isToday ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <div className="text-sm text-gray-700">
                      {format(day, 'EEE', { locale: fr })}
                    </div>
                    <div className="text-xl text-gray-900">
                      {format(day, 'd')}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {agenda.members.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="border-2 border-gray-800 p-8 text-center text-gray-500"
                >
                  Aucun membre dans l&apos;équipe
                </td>
              </tr>
            ) : (
              agenda.members.map((member) => (
                <tr key={member.id}>
                  {/* Colonne membre */}
                  <td
                    className="border-2 border-gray-800 p-3 font-bold"
                    style={{ backgroundColor: member.color + '20' }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-gray-800"
                        style={{ backgroundColor: member.color }}
                      />
                      <span className="text-gray-900">{member.name}</span>
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
                        className={`border-2 border-gray-800 p-2 align-top ${
                          isToday ? 'bg-blue-50' : ''
                        }`}
                        style={{ minHeight: '80px' }}
                      >
                        {blocksForDay.length === 0 ? (
                          <div className="text-gray-300 text-center py-4">
                            —
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {blocksForDay.map((block) => {
                              // 🆕 Afficher combien de membres sont sur ce bloc
                              const memberCount = block.memberIds.length
                              const isMultiMember = memberCount > 1

                              return (
                                <div
                                  key={block.id}
                                  className="text-xs p-2 rounded"
                                  style={{
                                    backgroundColor: member.color + '30',
                                    borderLeft: `3px solid ${member.color}`,
                                  }}
                                >
                                  <div className="font-bold text-gray-900">
                                    {block.start} - {block.end}
                                  </div>
                                  {block.label && (
                                    <div className="text-gray-700 mt-1">
                                      {block.label}
                                    </div>
                                  )}
                                  {/* 🆕 Badge si plusieurs membres */}
                                  {isMultiMember && (
                                    <div className="text-gray-600 mt-1">
                                      👥 {memberCount} membres
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          Généré par Planningo le{' '}
          {format(new Date(), 'd MMMM yyyy', { locale: fr })}
        </div>
      </div>
    )
  }
)

PrintableWeek.displayName = 'PrintableWeek'

export default PrintableWeek
