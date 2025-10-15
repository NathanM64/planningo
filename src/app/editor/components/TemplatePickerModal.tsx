// src/app/editor/components/TemplatePickerModal.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { templateCategories } from '@/data/templates'
import { PersonaType, AgendaTemplate } from '@/types/template'
import { convertTemplateToAgenda } from '@/lib/templateConverter'
import { useEditorStore } from '@/stores/editorStore'
import { X, Check, Calendar, Users, Clock, Sparkles } from 'lucide-react'

interface TemplatePickerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TemplatePickerModal({
  isOpen,
  onClose,
}: TemplatePickerModalProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<AgendaTemplate | null>(null)
  const { setAgenda } = useEditorStore()

  if (!isOpen) return null

  const handleSelectTemplate = (template: AgendaTemplate) => {
    setSelectedTemplate(template)
  }

  const handleConfirm = () => {
    if (!selectedTemplate) return

    // Convertir le template en agenda
    const newAgenda = convertTemplateToAgenda(selectedTemplate)

    // Remplacer l'agenda actuel
    setAgenda(newAgenda)

    // Fermer le modal
    onClose()
  }

  const currentCategory = selectedPersona
    ? templateCategories.find((cat) => cat.persona === selectedPersona)
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-modal-title"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0000EE]/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0000EE]" />
              </div>
              <div>
                <h2
                  id="template-modal-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  Choisir un template
                </h2>
                <p className="text-sm text-gray-600">
                  Démarrez rapidement avec un planning pré-configuré
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {!selectedPersona ? (
              // Étape 1 : Sélection de la catégorie
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pour qui créez-vous ce planning ?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templateCategories.map((category) => (
                    <button
                      key={category.persona}
                      onClick={() => setSelectedPersona(category.persona)}
                      className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-[#0000EE] hover:shadow-md transition-all group"
                    >
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-[#0000EE]">
                        {category.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {category.templates.length} templates disponibles
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Étape 2 : Sélection du template
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentCategory?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentCategory?.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPersona(null)
                      setSelectedTemplate(null)
                    }}
                  >
                    Changer de catégorie
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {currentCategory?.templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`text-left p-4 border-2 rounded-xl transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-[#0000EE] bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-[#0000EE]/50 hover:shadow'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900">
                          {template.title}
                        </h4>
                        {selectedTemplate?.id === template.id && (
                          <div className="w-6 h-6 bg-[#0000EE] rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>

                      {/* Informations du template */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{template.config.members.length} membres</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{template.config.timeSlots.length} créneaux</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{template.config.activeDays.length} jours</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {selectedTemplate
                ? 'Votre agenda actuel sera remplacé par ce template'
                : 'Sélectionnez un template pour continuer'}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedTemplate}
                className="min-w-[120px]"
              >
                Utiliser ce template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
