'use client'

import { useState, useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { Button, Input } from '@/components/ui'
import { X, Trash2, Check } from 'lucide-react'
import { AgendaBlock } from '@/types/agenda'

interface BlockModalProps {
  isOpen: boolean
  onClose: () => void
  memberId?: string
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
  const [memberId, setMemberId] = useState(initialMemberId || '')
  const [date, setDate] = useState(initialDate || '')
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('10:00')
  const [label, setLabel] = useState('')

  // Pré-remplir le formulaire si on édite
  useEffect(() => {
    if (blockToEdit) {
      setMemberId(blockToEdit.memberId)
      setDate(blockToEdit.date)
      setStart(blockToEdit.start)
      setEnd(blockToEdit.end)
      setLabel(blockToEdit.label || '')
    } else {
      setMemberId(initialMemberId || '')
      setDate(initialDate || '')
      setStart('09:00')
      setEnd('10:00')
      setLabel('')
    }
  }, [blockToEdit, initialMemberId, initialDate, isOpen])

  const handleSave = () => {
    if (!memberId || !date) return

    if (blockToEdit) {
      // Mise à jour
      updateBlock(blockToEdit.id, {
        memberId,
        date,
        start,
        end,
        label: label.trim() || undefined,
      })
    } else {
      // Création
      addBlock({
        memberId,
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

  const selectedMember = agenda.members.find((m) => m.id === memberId)

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {blockToEdit ? 'Modifier le créneau' : 'Nouveau créneau'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Sélection membre */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Membre
              </label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white transition"
              >
                <option value="">Sélectionner un membre</option>
                {agenda.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {selectedMember && (
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedMember.color }}
                  />
                  <span className="text-sm text-gray-600">
                    Couleur : {selectedMember.color}
                  </span>
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white transition"
              />
            </div>

            {/* Horaires */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Début
                </label>
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Fin
                </label>
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white transition"
                />
              </div>
            </div>

            {/* Label (optionnel) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description (optionnel)
              </label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Matin, Réunion, Formation..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t-2 border-gray-200 flex items-center justify-between">
            {blockToEdit ? (
              <Button
                variant="danger"
                onClick={handleDelete}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Supprimer
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={!memberId || !date}
                leftIcon={<Check className="w-4 h-4" />}
              >
                {blockToEdit ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
