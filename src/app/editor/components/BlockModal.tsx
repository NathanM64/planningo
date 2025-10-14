'use client'

import { useState, useEffect } from 'react'
import FocusTrap from 'focus-trap-react'
import { useEditorStore } from '@/stores/editorStore'
import { Button, Input } from '@/components/ui'
import { X, Trash2, Check } from 'lucide-react'
import { AgendaBlock } from '@/types/agenda'

interface BlockModalProps {
  isOpen: boolean
  onClose: () => void
  memberId?: string // Membre pré-sélectionné (optionnel)
  date?: string
  blockToEdit?: AgendaBlock | null
}

export default function BlockModal({
  isOpen,
  onClose,
  memberId: initialMemberId,
  date: initialDate,
  blockToEdit,
}: BlockModalProps) {
  const { agenda, addBlock, updateBlock, removeBlock } = useEditorStore()

  // États du formulaire
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [date, setDate] = useState(initialDate || '')
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('10:00')
  const [label, setLabel] = useState('')

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
      setLabel('')
    }
  }, [blockToEdit, initialMemberId, initialDate, isOpen])

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleSave = () => {
    if (selectedMemberIds.length === 0 || !date) return

    if (blockToEdit) {
      // Mise à jour
      updateBlock(blockToEdit.id, {
        memberIds: selectedMemberIds,
        date,
        start,
        end,
        label: label.trim() || undefined,
      })
    } else {
      // Création
      addBlock({
        memberIds: selectedMemberIds,
        date,
        start,
        end,
        label: label.trim() || undefined,
      })
    }

    onClose()
  }

  const handleDelete = () => {
    if (blockToEdit) {
      removeBlock(blockToEdit.id)
      onClose()
    }
  }

  if (!isOpen || !agenda) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: true,
            clickOutsideDeactivates: true,
            onDeactivate: onClose,
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-900">
              {blockToEdit ? 'Modifier le créneau' : 'Nouveau créneau'}
            </h2>
            <button
              onClick={onClose}
              aria-label="Fermer la fen\u00eatre"
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
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

            {/* Horaires */}
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

            {/* Label */}
            <Input
              type="text"
              label="Label (optionnel)"
              placeholder="Ex: Matin, Réunion, etc."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t-2 border-gray-200 gap-3">
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
              <Button variant="ghost" onClick={onClose}>
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
    </>
  )
}
