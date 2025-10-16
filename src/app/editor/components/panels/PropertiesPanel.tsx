'use client'

import { useState, useEffect, memo, useRef } from 'react'
import FocusTrap from 'focus-trap-react'
import { useEditorStore } from '@/stores/editorStore'
import { Button, Input } from '@/components/ui'
import { X, Trash2, Check } from 'lucide-react'
import { AgendaBlock } from '@/types/agenda'
import { detectConflict, Conflict } from '../../lib/conflict-detection'
import ConflictAlertModal from '../ConflictAlertModal'

interface PropertiesPanelProps {
  isOpen: boolean
  onClose: () => void
  memberId?: string // Membre pré-sélectionné (optionnel)
  date?: string
  period?: string // Période pré-sélectionnée (Matin/Soir) en mode fixed-periods
  blockToEdit?: AgendaBlock | null
}

function PropertiesPanel({
  isOpen,
  onClose,
  memberId: initialMemberId,
  date: initialDate,
  period: initialPeriod,
  blockToEdit,
}: PropertiesPanelProps) {
  const { agenda, addBlock, updateBlock, removeBlock } = useEditorStore()
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Déterminer si on est en mode périodes fixes
  const isFixedPeriods = agenda?.timeSlotDisplay === 'fixed-periods'

  // États du formulaire
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [date, setDate] = useState(initialDate || '')
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('10:00')
  const [label, setLabel] = useState('')

  // État pour la détection de conflits
  const [pendingBlock, setPendingBlock] = useState<AgendaBlock | null>(null)
  const [conflict, setConflict] = useState<Conflict | null>(null)
  const [showConflictModal, setShowConflictModal] = useState(false)

  // Gérer la touche Escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Pré-remplir le formulaire
  useEffect(() => {
    if (blockToEdit) {
      // Mode édition
      setSelectedMemberIds(blockToEdit.memberIds)
      setDate(blockToEdit.date)
      setStart(blockToEdit.start)
      setEnd(blockToEdit.end)
      setLabel(blockToEdit.label || '')
    } else {
      // Mode création
      setSelectedMemberIds(initialMemberId ? [initialMemberId] : [])
      setDate(initialDate || '')
      setStart('09:00')
      setEnd('10:00')
      // En mode périodes fixes, pré-remplir le label avec la période
      setLabel(isFixedPeriods && initialPeriod ? initialPeriod : '')
    }
  }, [blockToEdit, initialMemberId, initialDate, initialPeriod, isFixedPeriods, isOpen])

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleSave = () => {
    if (selectedMemberIds.length === 0 || !date) return

    // En mode périodes fixes, le label est obligatoire
    if (isFixedPeriods && !label.trim()) {
      alert("Le label (période) est obligatoire en mode Matin/Soir.")
      return
    }

    // Validation: l'heure de début doit être avant l'heure de fin (sauf en mode full-day)
    if (!isFixedPeriods && start >= end) {
      alert("L'heure de début doit être avant l'heure de fin.")
      return
    }

    // Créer le bloc temporaire pour détection de conflits
    const newBlock: AgendaBlock = {
      id: blockToEdit?.id || `temp-${Date.now()}`,
      memberIds: selectedMemberIds,
      date,
      start,
      end,
      label: label.trim() || undefined,
    }

    // Détecter les conflits
    if (agenda) {
      const detectedConflict = detectConflict(newBlock, agenda)

      if (detectedConflict) {
        // Conflit trouvé → afficher le modal
        setPendingBlock(newBlock)
        setConflict(detectedConflict)
        setShowConflictModal(true)
        return
      }
    }

    // Pas de conflit → sauvegarder directement
    saveBlock(newBlock)
  }

  const saveBlock = (block: AgendaBlock) => {
    if (blockToEdit) {
      // Mise à jour
      updateBlock(blockToEdit.id, {
        memberIds: block.memberIds,
        date: block.date,
        start: block.start,
        end: block.end,
        label: block.label,
      })
    } else {
      // Création
      addBlock({
        memberIds: block.memberIds,
        date: block.date,
        start: block.start,
        end: block.end,
        label: block.label,
      })
    }

    onClose()
  }

  const handleConflictCancel = () => {
    setShowConflictModal(false)
    setPendingBlock(null)
    setConflict(null)
  }

  const handleConflictForce = () => {
    if (pendingBlock) {
      saveBlock(pendingBlock)
    }
    setShowConflictModal(false)
    setPendingBlock(null)
    setConflict(null)
  }

  const handleDelete = () => {
    if (blockToEdit) {
      removeBlock(blockToEdit.id)
      onClose()
    }
  }

  if (!agenda) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <FocusTrap
          active={isOpen}
          focusTrapOptions={{
            clickOutsideDeactivates: false,
            allowOutsideClick: true,
            initialFocus: () => cancelButtonRef.current,
          }}
        >
          <div
            className="h-full flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="properties-panel-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 flex-shrink-0">
              <h2 id="properties-panel-title" className="text-xl font-bold text-gray-900">
                {blockToEdit ? 'Modifier le créneau' : 'Nouveau créneau'}
              </h2>
              <button
                onClick={onClose}
                aria-label="Fermer le panneau"
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Sélection des membres (plusieurs possibles) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Membre(s) assigné(s) *
                </label>
                <div className="space-y-2">
                  {agenda.members.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucun membre disponible. Ajoutez-en un d&apos;abord !
                    </p>
                  ) : (
                    agenda.members.map((member) => {
                      const isSelected = selectedMemberIds.includes(member.id)
                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => toggleMember(member.id)}
                          aria-label={`${isSelected ? 'Désélectionner' : 'Sélectionner'} ${member.name}`}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>

                          {/* Pastille couleur */}
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: member.color }}
                          />

                          {/* Nom */}
                          <span className="font-medium text-gray-900">
                            {member.name}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
                {selectedMemberIds.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedMemberIds.length} membre(s) sélectionné(s)
                  </p>
                )}
              </div>

              {/* Date */}
              <Input
                type="date"
                label="Date *"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              {/* Horaires - masqués en mode périodes fixes */}
              {!isFixedPeriods && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    label="Début *"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                  <Input
                    type="time"
                    label="Fin *"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              )}

              {/* Label */}
              <Input
                type="text"
                label={isFixedPeriods ? "Période *" : "Label (optionnel)"}
                placeholder={isFixedPeriods ? "Ex: Matin, Soir" : "Ex: Réunion, Formation"}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex items-center justify-between p-6 border-t-2 border-gray-200 gap-3 flex-shrink-0">
              {blockToEdit && (
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Supprimer
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button ref={cancelButtonRef} variant="ghost" onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={selectedMemberIds.length === 0 || !date}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  {blockToEdit ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </div>
          </div>
        </FocusTrap>
      </div>

      {/* Modal de conflit */}
      <ConflictAlertModal
        isOpen={showConflictModal}
        conflict={conflict}
        onCancel={handleConflictCancel}
        onForce={handleConflictForce}
      />
    </>
  )
}

export default memo(PropertiesPanel)
