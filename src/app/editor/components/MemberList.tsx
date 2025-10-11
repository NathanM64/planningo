'use client'

import { useState } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

export default function MemberList() {
  const { agenda, addMember, updateMember, removeMember } = useEditorStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addMember(newMemberName.trim())
      setNewMemberName('')
      setIsAdding(false)
    }
  }

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
  }

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      updateMember(editingId, { name: editingName.trim() })
      setEditingId(null)
      setEditingName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  if (!agenda) return null

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Membres de l'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Liste des membres */}
        <div className="space-y-2 mb-4">
          {agenda.members.length === 0 && !isAdding && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun membre. Ajoutez-en un !
            </p>
          )}

          {agenda.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 p-3 rounded-lg border-2 hover:border-gray-300 transition"
              style={{
                borderColor: member.color + '40',
                backgroundColor: member.color + '10',
              }}
            >
              {/* Pastille couleur */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: member.color }}
              />

              {/* Nom (éditable) */}
              {editingId === member.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                    className="text-sm py-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveEdit}
                    className="p-1 h-auto"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex-1 font-medium text-gray-900">
                    {member.name}
                  </span>

                  {/* Actions */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStartEdit(member.id, member.name)}
                    className="p-1 h-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMember(member.id)}
                    className="p-1 h-auto text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Formulaire d'ajout */}
        {isAdding ? (
          <div className="space-y-2">
            <Input
              placeholder="Nom du membre"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddMember()
                if (e.key === 'Escape') {
                  setIsAdding(false)
                  setNewMemberName('')
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleAddMember} size="sm" className="flex-1">
                <Check className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false)
                  setNewMemberName('')
                }}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            variant="secondary"
            className="w-full"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Ajouter un membre
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
