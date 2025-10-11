'use client'

import { forwardRef } from 'react'
import { Agenda } from '@/types/agenda'
import { getWeekDays, formatDateISO } from '@/types/agenda'
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
        {/* En-tête */}
        <div className="mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {agenda.name}
          </h1>
          <p className="text-lg text-gray-700">
            Semaine du {format(weekDays[0], 'd MMMM', { locale: fr })} au{' '}
            {format(weekDays[6], 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        {/* Tableau */}
        <table className="w-full border-collapse">
          {/* En-tête des jours */}
          <thead>
            <tr>
              <th className="border-2 border-gray-800 bg-gray-100 p-3 text-left font-bold text-gray-900 w-32">
                Membre
              </th>
              {weekDays.map((day, index) => {
                const isToday = formatDateISO(day) === formatDateISO(new Date())
                return (
                  <th
                    key={index}
                    className={`border-2 border-gray-800 p-3 text-center font-bold ${
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

          {/* Corps du tableau */}
          <tbody>
            {agenda.members.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="border-2 border-gray-800 p-8 text-center text-gray-500"
                >
                  Aucun membre dans l'équipe
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

                    // Récupérer les blocs de ce membre pour ce jour
                    const blocksForDay = agenda.blocks.filter(
                      (block) =>
                        block.memberId === member.id && block.date === dateISO
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
                          <div className="h-16" />
                        ) : (
                          <div className="space-y-1">
                            {blocksForDay.map((block) => (
                              <div
                                key={block.id}
                                className="rounded px-2 py-1 text-xs border-2 border-gray-800"
                                style={{
                                  backgroundColor: member.color + '40',
                                }}
                              >
                                <div className="font-bold text-gray-900">
                                  {block.start} - {block.end}
                                </div>
                                {block.label && (
                                  <div className="text-gray-800 mt-0.5">
                                    {block.label}
                                  </div>
                                )}
                              </div>
                            ))}
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

        {/* Pied de page */}
        <div className="mt-6 pt-4 border-t border-gray-400 text-sm text-gray-600 text-center">
          Généré avec Planningo • {format(new Date(), 'dd/MM/yyyy à HH:mm')}
        </div>

        {/* Styles pour l'impression */}
        <style jsx>{`
          @media print {
            @page {
              size: A4 landscape;
              margin: 1cm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}</style>
      </div>
    )
  }
)

PrintableWeek.displayName = 'PrintableWeek'

export default PrintableWeek
