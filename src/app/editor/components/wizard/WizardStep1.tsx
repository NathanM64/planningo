// src/app/editor/components/wizard/WizardStep1.tsx
'use client'

import { useState } from 'react'
import { Users, RefreshCw, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import { UseCaseType } from './types'
import { getTemplatesByUseCase } from '@/config/agenda-templates'

interface WizardStep1Props {
  selectedUseCase: UseCaseType | null
  selectedTemplate: string | null
  onNext: (useCase: UseCaseType, templateId?: string) => void
  onCancel: () => void
}

const USE_CASES = [
  {
    id: 'team' as const,
    icon: Users,
    title: "Planning d'équipe",
    description: 'Organiser les activités de plusieurs personnes',
    examples: 'Cours, disponibilités équipe, projets',
  },
  {
    id: 'rotation' as const,
    icon: RefreshCw,
    title: 'Roulement & gardes',
    description: 'Gérer les services par périodes (matin/soir/nuit)',
    examples: 'Restaurant, hôpital, crèche',
  },
  {
    id: 'personal' as const,
    icon: Calendar,
    title: 'Agenda personnel',
    description: 'Planifier mes rendez-vous avec horaires précis',
    examples: 'Consultations, réunions client',
  },
  {
    id: 'other' as const,
    icon: FileText,
    title: 'Autre besoin',
    description: 'Planning de ressources, équipements, salles',
    examples: 'Terrains sportifs, salles de réunion',
  },
]

export default function WizardStep1({
  selectedUseCase,
  selectedTemplate,
  onNext,
  onCancel,
}: WizardStep1Props) {
  const [selected, setSelected] = useState<UseCaseType | null>(
    selectedUseCase
  )
  const [template, setTemplate] = useState<string | null>(selectedTemplate)

  // Récupérer les templates disponibles pour le use case sélectionné
  const availableTemplates = selected ? getTemplatesByUseCase(selected) : []

  const handleNext = () => {
    if (selected) {
      onNext(selected, template || undefined)
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">
        Quel type de planning souhaitez-vous créer ?
      </h3>
      <p className="text-gray-600 mb-6">
        Choisissez l'option qui correspond le mieux à votre besoin
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {USE_CASES.map((useCase) => {
          const Icon = useCase.icon
          const isSelected = selected === useCase.id

          return (
            <button
              key={useCase.id}
              onClick={() => {
                setSelected(useCase.id)
                setTemplate(null) // Reset template quand on change de use case
              }}
              className={`p-6 border-2 rounded-xl text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-blue-600' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1">
                    {useCase.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {useCase.description}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Ex: {useCase.examples}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Sélection template si use case sélectionné et templates disponibles */}
      {selected && availableTemplates.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">
            Voulez-vous partir d'un exemple ?
          </h4>
          <div className="space-y-2">
            {/* Option vierge */}
            <button
              onClick={() => setTemplate(null)}
              className={`w-full p-3 border-2 rounded-lg text-left transition ${
                template === null
                  ? 'border-blue-600 bg-white shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">Agenda vierge</div>
              <div className="text-sm text-gray-600">Partir de zéro</div>
            </button>

            {/* Templates disponibles */}
            {availableTemplates.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplate(tmpl.id)}
                className={`w-full p-3 border-2 rounded-lg text-left transition ${
                  template === tmpl.id
                    ? 'border-blue-600 bg-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{tmpl.name}</div>
                <div className="text-sm text-gray-600">{tmpl.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleNext} disabled={!selected}>
          Suivant
        </Button>
      </div>
    </div>
  )
}
