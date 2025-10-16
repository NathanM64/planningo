// src/app/editor/components/wizard/AgendaSetupWizard.tsx
'use client'

import { useState } from 'react'
import WizardStep1 from './WizardStep1'
import WizardStep2 from './WizardStep2'
import WizardStep3 from './WizardStep3'
import { WizardData, WizardConfig } from './types'
import { Agenda } from '@/types/agenda'
import { getTemplateById } from '@/config/agenda-templates'
import { createAgendaFromTemplate } from '@/lib/createAgendaFromTemplate'

interface AgendaSetupWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (config: WizardConfig, templateAgenda?: Agenda) => void
}

export default function AgendaSetupWizard({
  isOpen,
  onClose,
  onComplete,
}: AgendaSetupWizardProps) {
  const [step, setStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    useCase: null,
    displayMode: null,
    periods: undefined,
  })

  if (!isOpen) return null

  // Calculer le nombre total d'étapes selon le use case
  const totalSteps = wizardData.useCase === 'rotation' ? 3 : 2

  const handleStep1Next = (useCase: WizardData['useCase'], templateId?: string) => {
    const updatedData = { ...wizardData, useCase, templateId }
    setWizardData(updatedData)

    // Si un template est sélectionné, terminer directement
    if (templateId) {
      handleComplete(updatedData)
    } else {
      // Sinon, continuer avec l'étape 2
      setStep(2)
    }
  }

  const handleStep2Next = (displayMode: WizardData['displayMode']) => {
    setWizardData({ ...wizardData, displayMode })

    // Si rotation, aller à l'étape 3 pour configurer les périodes
    if (wizardData.useCase === 'rotation') {
      setStep(3)
    } else {
      // Sinon, terminer directement
      handleComplete({ ...wizardData, displayMode })
    }
  }

  const handleStep3Next = (periods: string[]) => {
    handleComplete({ ...wizardData, periods })
  }

  const handleComplete = (finalData: WizardData) => {
    // Si un template est sélectionné, créer l'agenda depuis le template
    if (finalData.templateId) {
      const template = getTemplateById(finalData.templateId)
      if (template) {
        const templateAgenda = createAgendaFromTemplate(template)
        // Retourner une config vide + l'agenda template
        const config = convertWizardDataToConfig(finalData)
        onComplete(config, templateAgenda)
        return
      }
    }

    // Sinon, convertir normalement les données du wizard en configuration
    const config = convertWizardDataToConfig(finalData)
    onComplete(config)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Progress bar */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              Créer votre planning
            </h2>
            <span className="text-sm text-gray-500">
              Étape {step}/{totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="p-6">
          {step === 1 && (
            <WizardStep1
              selectedUseCase={wizardData.useCase}
              selectedTemplate={wizardData.templateId || null}
              onNext={handleStep1Next}
              onCancel={onClose}
            />
          )}
          {step === 2 && (
            <WizardStep2
              useCase={wizardData.useCase!}
              selectedDisplayMode={wizardData.displayMode}
              onNext={handleStep2Next}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <WizardStep3
              onNext={handleStep3Next}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Fonction de conversion wizard → config
function convertWizardDataToConfig(data: WizardData): WizardConfig {
  const mode = 'simple' // Pour Phase 18, toujours simple

  const timeSlotDisplay = data.displayMode as 'precise-hours' | 'fixed-periods' | 'full-day'
  let fixedPeriods = undefined

  // Si périodes fixes, créer les FixedPeriod objects
  if (data.displayMode === 'fixed-periods' && data.periods && data.periods.length > 0) {
    fixedPeriods = data.periods.map((label, index) => ({
      id: `period-${index}`,
      label,
    }))
  }

  // Vue par défaut selon use case
  const defaultView = data.useCase === 'personal' ? 'day' : 'week'

  return {
    mode,
    timeSlotDisplay,
    fixedPeriods,
    defaultView: defaultView as 'week' | 'month' | 'day',
    activeDays: [1, 2, 3, 4, 5, 6, 0], // Tous les jours par défaut
  }
}
