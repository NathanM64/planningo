// src/app/editor/components/wizard/WizardStep2.tsx
'use client'

import { useState, useEffect } from 'react'
import { Clock, Sun, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui'
import { UseCaseType, DisplayModeType } from './types'

interface WizardStep2Props {
  useCase: UseCaseType
  selectedDisplayMode: DisplayModeType | null
  onNext: (displayMode: DisplayModeType) => void
  onBack: () => void
}

interface DisplayModeOption {
  id: DisplayModeType
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  disabled?: boolean
}

const DISPLAY_MODES: Record<UseCaseType, DisplayModeOption[]> = {
  team: [
    {
      id: 'precise-hours',
      icon: Clock,
      title: 'Heures précises',
      desc: 'Créneaux avec horaires (09:00 → 10:30)',
    },
    {
      id: 'fixed-periods',
      icon: Sun,
      title: 'Périodes de la journée',
      desc: 'Matin / Après-midi / Soir',
    },
    {
      id: 'full-day',
      icon: CalendarDays,
      title: 'Journées complètes',
      desc: 'Présent/absent par jour',
      disabled: true,
    },
  ],
  rotation: [
    {
      id: 'fixed-periods',
      icon: Sun,
      title: 'Périodes personnalisées',
      desc: 'Matin/Soir, Nuit/Jour, etc.',
    },
  ],
  personal: [
    {
      id: 'precise-hours',
      icon: Clock,
      title: 'Heures précises',
      desc: 'Horaires détaillés type Google Agenda',
    },
  ],
  other: [
    {
      id: 'precise-hours',
      icon: Clock,
      title: 'Heures précises',
      desc: 'Réservations avec horaires détaillés',
    },
  ],
}

export default function WizardStep2({
  useCase,
  selectedDisplayMode,
  onNext,
  onBack,
}: WizardStep2Props) {
  const modes = DISPLAY_MODES[useCase]
  const [selected, setSelected] = useState<DisplayModeType | null>(
    selectedDisplayMode
  )

  // Si un seul choix, auto-select
  useEffect(() => {
    if (modes.length === 1 && !modes[0].disabled) {
      setSelected(modes[0].id)
    }
  }, [modes])

  // Texte du bouton selon le use case
  const nextButtonText =
    useCase === 'rotation' ? 'Suivant' : 'Créer mon planning'

  return (
    <div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">
        Comment organiser vos créneaux ?
      </h3>
      <p className="text-gray-600 mb-6">
        Choisissez le niveau de détail souhaité
      </p>

      <div className="space-y-3">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isSelected = selected === mode.id
          const isDisabled = mode.disabled

          return (
            <button
              key={mode.id}
              onClick={() => !isDisabled && setSelected(mode.id)}
              disabled={isDisabled}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                isDisabled
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  : isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {mode.title}
                    {isDisabled && (
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                        Bientôt
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{mode.desc}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {modes.length === 1 && !modes[0].disabled && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            Pour ce type de planning, nous recommandons l'affichage par{' '}
            <strong>{modes[0].title.toLowerCase()}</strong>.
          </p>
        </div>
      )}

      <div className="flex justify-between gap-3 mt-8">
        <Button variant="ghost" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={() => selected && onNext(selected)} disabled={!selected}>
          {nextButtonText}
        </Button>
      </div>
    </div>
  )
}
