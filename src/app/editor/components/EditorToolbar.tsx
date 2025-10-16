// src/app/editor/components/EditorToolbar.tsx
'use client'

import { useState } from 'react'
import { Printer, Save, Loader2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { UseReactToPrintFn } from 'react-to-print'
import ViewSwitcher from './layout/ViewSwitcher'

interface EditorToolbarProps {
  agendaName: string
  onAgendaNameChange: (name: string) => void
  onPrint: UseReactToPrintFn
  onSave: () => Promise<void>
  isSaving: boolean
}

export default function EditorToolbar({
  agendaName,
  onAgendaNameChange,
  onPrint,
  onSave,
  isSaving,
}: EditorToolbarProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="container mx-auto px-4 max-w-7xl pt-6 pb-4">
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-4">
        <div className="flex flex-col gap-4">
          {/* Première ligne: Nom + Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Nom de l'agenda (éditable) */}
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            {isEditing ? (
              <input
                type="text"
                value={agendaName}
                onChange={(e) => onAgendaNameChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditing(false)
                  if (e.key === 'Escape') setIsEditing(false)
                }}
                className="text-2xl font-bold text-gray-900 border-b-2 border-[#0000EE] focus:outline-none bg-transparent w-full"
                autoFocus
                aria-label="Nom de l'agenda"
              />
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-[#0000EE] transition">
                  {agendaName || 'Sans titre'}
                </h1>
                <Edit2 className="w-5 h-5 text-gray-400 group-hover:text-[#0000EE] transition opacity-0 group-hover:opacity-100" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="ghost"
              onClick={onPrint}
              leftIcon={<Printer className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              <span className="sm:inline">Imprimer</span>
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              leftIcon={
                isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
              className="flex-1 sm:flex-none"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>

        {/* Deuxième ligne: ViewSwitcher */}
        <div className="flex justify-center">
          <ViewSwitcher />
        </div>
      </div>
      </div>
    </div>
  )
}
