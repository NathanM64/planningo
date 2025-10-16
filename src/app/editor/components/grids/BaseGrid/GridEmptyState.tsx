'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { Button, Input } from '@/components/ui'

export default function GridEmptyState() {
  const { addMember } = useEditorStore()
  const [memberName, setMemberName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddMember = () => {
    if (memberName.trim()) {
      addMember(memberName.trim())
      setMemberName('')
      setIsAdding(false)
    }
  }

  return (
    <div className="p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Commencez par ajouter des membres
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Ajoutez les personnes, ressources ou équipes que vous souhaitez planifier
        </p>

        {isAdding ? (
          <div className="space-y-3">
            <Input
              placeholder="Nom du membre"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddMember()
                if (e.key === 'Escape') setIsAdding(false)
              }}
              autoFocus
            />
            <div className="flex gap-2 justify-center">
              <Button onClick={handleAddMember} size="sm">
                Ajouter
              </Button>
              <Button
                onClick={() => setIsAdding(false)}
                variant="ghost"
                size="sm"
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Ajouter un membre
          </Button>
        )}
      </div>
    </div>
  )
}
