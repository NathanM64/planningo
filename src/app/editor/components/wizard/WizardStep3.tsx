// src/app/editor/components/wizard/WizardStep3.tsx
'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'

interface WizardStep3Props {
  onNext: (periods: string[]) => void
  onBack: () => void
}

interface PeriodTemplate {
  id: string
  name: string
  periods: string[]
}

const PERIOD_TEMPLATES: PeriodTemplate[] = [
  { id: '2-periods', name: 'Matin / Soir', periods: ['Matin', 'Soir'] },
  {
    id: '3-periods',
    name: 'Matin / Midi / Soir',
    periods: ['Matin', 'Midi', 'Soir'],
  },
  {
    id: '3-hospital',
    name: 'Nuit / Matin / Après-midi',
    periods: ['Nuit', 'Matin', 'Après-midi'],
  },
  { id: 'custom', name: 'Créer mes périodes', periods: [] },
]

export default function WizardStep3({ onNext, onBack }: WizardStep3Props) {
  const [template, setTemplate] = useState<string | null>(null)
  const [customPeriods, setCustomPeriods] = useState<string[]>(['', ''])

  const handleAddPeriod = () => {
    setCustomPeriods([...customPeriods, ''])
  }

  const handleRemovePeriod = (index: number) => {
    setCustomPeriods(customPeriods.filter((_, i) => i !== index))
  }

  const handleUpdatePeriod = (index: number, value: string) => {
    const updated = [...customPeriods]
    updated[index] = value
    setCustomPeriods(updated)
  }

  const handleConfirm = () => {
    if (template === 'custom') {
      const filtered = customPeriods.filter((p) => p.trim())
      if (filtered.length < 2) {
        alert('Veuillez définir au moins 2 périodes')
        return
      }
      onNext(filtered)
    } else {
      const selectedTemplate = PERIOD_TEMPLATES.find((t) => t.id === template)
      if (selectedTemplate) {
        onNext(selectedTemplate.periods)
      }
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">
        Définissez vos périodes
      </h3>
      <p className="text-gray-600 mb-6">
        Ces périodes s'appliqueront à chaque jour de la semaine
      </p>

      {/* Templates */}
      <div className="space-y-3 mb-6">
        {PERIOD_TEMPLATES.map((tmpl) => {
          const isSelected = template === tmpl.id

          return (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl.id)}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">
                {tmpl.name}
              </div>
              {tmpl.periods.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {tmpl.periods.map((p, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Custom periods input */}
      {template === 'custom' && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nommez vos périodes :
          </label>
          {customPeriods.map((period, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Période ${index + 1}`}
                value={period}
                onChange={(e) => handleUpdatePeriod(index, e.target.value)}
                className="flex-1"
              />
              {customPeriods.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePeriod(index)}
                  aria-label={`Supprimer période ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPeriod}
            className="w-full mt-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une période
          </Button>
        </div>
      )}

      <div className="flex justify-between gap-3 mt-8">
        <Button variant="ghost" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={handleConfirm} disabled={!template}>
          Créer mon planning
        </Button>
      </div>
    </div>
  )
}
