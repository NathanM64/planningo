// src/app/editor/components/PrintableWeek.tsx
import { forwardRef } from 'react'
import { Agenda, getWeekDays, formatDateISO } from '@/types/agenda'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { WatermarkSize } from '@/config/plans'

interface PrintableWeekProps {
  agenda: Agenda
  watermark?: WatermarkSize
}

const PrintableWeek = forwardRef<HTMLDivElement, PrintableWeekProps>(
  ({ agenda, watermark = 'none' }, ref) => {
    const weekDays = getWeekDays(agenda.currentWeekStart)

    return (
      <div ref={ref} className="p-8 bg-white relative">
        {/* Watermark MODE DÉMO (Test) */}
        {watermark === 'large' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="transform -rotate-45 opacity-10">
              <div className="text-9xl font-black text-red-500 whitespace-nowrap">
                MODE DÉMO
              </div>
              <div className="text-4xl font-bold text-center text-gray-800 mt-4">
                Créez un compte sur planningo.app
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 relative z-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {agenda.name}
          </h1>
          <p className="text-gray-600">
            Semaine du {format(weekDays[0], 'd MMMM', { locale: fr })} au{' '}
            {format(weekDays[6], 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        {/* Tableau */}
        <table className="w-full border-collapse relative z-20">
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

        {/* Footer avec watermark petit (Free) ou sans (Pro) */}
        <div className="mt-6 text-sm text-center relative z-20">
          {watermark === 'small' ? (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span>Créé avec</span>
              <a
                href="https://planningo.app"
                className="font-semibold text-[#0000EE] hover:underline"
              >
                Planningo
              </a>
              <span>
                le {format(new Date(), 'd MMMM yyyy', { locale: fr })}
              </span>
            </div>
          ) : watermark === 'none' ? (
            <p className="text-gray-500">
              Généré le {format(new Date(), 'd MMMM yyyy', { locale: fr })}
            </p>
          ) : (
            <div className="text-red-600 font-bold">
              MODE DÉMO - Créez un compte gratuit sur{' '}
              <a href="https://planningo.app" className="underline">
                planningo.app
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }
)

PrintableWeek.displayName = 'PrintableWeek'

export default PrintableWeek
