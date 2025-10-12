'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { Plus, Trash2, Edit2, Check, X, Crown, Lock } from 'lucide-react'

export default function MemberList() {
  const router = useRouter()
  const { agenda, addMember, updateMember, removeMember } = useEditorStore()
  const {
    plan,
    limits,
    canAddMember: canAdd,
    getRemainingMembers,
    isTest,
  } = usePlanLimits()

  const [isAdding, setIsAdding] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const currentMemberCount = agenda?.members.length || 0
  const canAddMore = canAdd(currentMemberCount)
  const remaining = getRemainingMembers(currentMemberCount)

  const handleAddMember = () => {
    if (!canAddMore) {
      setShowUpgradeModal(true)
      return
    }

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
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Membres de l&apos;équipe</CardTitle>
            {remaining !== null && (
              <span className="text-xs text-gray-500">
                {remaining} / {limits.maxMembers} restants
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Alerte limite */}
          {!canAddMore && (
            <div className="mb-4 p-3 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-900">
                    Limite atteinte
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    {isTest
                      ? 'Mode test : 3 membres max'
                      : 'Compte gratuit : 5 membres max'}
                  </p>
                  <Button
                    size="sm"
                    variant="accent"
                    className="mt-2"
                    onClick={() => router.push('/auth')}
                    leftIcon={<Crown className="w-3 h-3" />}
                  >
                    {isTest ? 'Créer un compte' : 'Passer en Pro'}
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: member.color }}
                />

                {editingId === member.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit()
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveEdit}
                      leftIcon={<Check className="w-3 h-3" />}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      leftIcon={<X className="w-3 h-3" />}
                    />
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-gray-900">
                      {member.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(member.id, member.name)}
                      leftIcon={<Edit2 className="w-3 h-3" />}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMember(member.id)}
                      leftIcon={<Trash2 className="w-3 h-3" />}
                    />
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
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddMember()
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewMemberName('')
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                  leftIcon={<Check className="w-3 h-3" />}
                >
                  Ajouter
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false)
                    setNewMemberName('')
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (canAddMore) {
                  setIsAdding(true)
                } else {
                  setShowUpgradeModal(true)
                }
              }}
              leftIcon={
                canAddMore ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )
              }
              disabled={!canAddMore && isTest}
            >
              {canAddMore ? 'Ajouter un membre' : 'Limite atteinte'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modal Upgrade */}
      {showUpgradeModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowUpgradeModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Limite atteinte
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                {isTest
                  ? 'Vous avez atteint la limite de 3 membres en mode test. Créez un compte gratuit pour passer à 5 membres et sauvegarder vos agendas.'
                  : 'Vous avez atteint la limite de 5 membres. Passez en Pro pour avoir des membres illimités !'}
              </p>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => router.push(isTest ? '/auth' : '/pricing')}
                  leftIcon={<Crown className="w-4 h-4" />}
                >
                  {isTest ? 'Créer un compte gratuit' : 'Passer en Pro'}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
