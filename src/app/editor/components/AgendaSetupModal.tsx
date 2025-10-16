// src/app/editor/components/AgendaSetupModal.tsx
'use client'

import { useState } from 'react'
import { X, Calendar, Clock, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui'
import { AgendaMode, TimeSlotDisplay } from '@/types/agenda'

interface AgendaSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (mode: AgendaMode, timeSlotDisplay: TimeSlotDisplay) => void
}

export default function AgendaSetupModal({
  isOpen,
  onClose,
  onConfirm,
}: AgendaSetupModalProps) {
  const [selectedMode, setSelectedMode] = useState<AgendaMode>('simple')
  const [selectedDisplay, setSelectedDisplay] = useState<TimeSlotDisplay>('precise-hours')

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(selectedMode, selectedDisplay)
    // Ne pas appeler onClose() ici - le modal se fermera automatiquement
    // via le useEffect dans page.tsx quand l'agenda sera créé
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Configurer votre agenda
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Mode d'agenda */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Mode d'agenda
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option Simple */}
              <button
                onClick={() => setSelectedMode('simple')}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  selectedMode === 'simple'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">
                  Simple
                </div>
                <p className="text-sm text-gray-600">
                  Planning libre, semaine par semaine. Idéal pour des emplois du temps flexibles.
                </p>
              </button>

              {/* Option Cycle - Désactivé pour le moment */}
              <button
                disabled
                className="p-4 border-2 rounded-lg text-left transition border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
              >
                <div className="font-semibold text-gray-900 mb-1">
                  Cycle
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                    Bientôt
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Roulement cyclique (ex: 3 semaines qui se répètent). Pour les plannings réguliers.
                </p>
              </button>
            </div>
          </div>

          {/* Section 2: Type d'affichage */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Type d'affichage
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {/* Option Heures précises */}
              <button
                onClick={() => setSelectedDisplay('precise-hours')}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  selectedDisplay === 'precise-hours'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Heures précises
                </div>
                <p className="text-sm text-gray-600">
                  Créneaux avec horaires précis (ex: 09:00 - 10:30). Pour un planning détaillé.
                </p>
              </button>

              {/* Option Périodes fixes */}
              <button
                onClick={() => setSelectedDisplay('fixed-periods')}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  selectedDisplay === 'fixed-periods'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <Moon className="w-4 h-4" />
                  Périodes fixes (Matin/Soir)
                </div>
                <p className="text-sm text-gray-600">
                  Créneaux par période (Matin, Soir). Idéal pour un planning simplifié.
                </p>
              </button>

              {/* Option Journée complète - Désactivé pour le moment */}
              <button
                disabled
                className="p-4 border-2 rounded-lg text-left transition border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
              >
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Journée complète
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                    Bientôt
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Une seule case par jour (présent/absent). Pour des plannings très simples.
                </p>
              </button>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note :</strong> Ces paramètres sont définis à la création et ne peuvent pas être modifiés par la suite.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>
            Créer l'agenda
          </Button>
        </div>
      </div>
    </div>
  )
}
