'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { useTelemetry } from '@/hooks/useTelemetry'
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
    canAddMember: canAdd,
    formatMemberLimit,
    upgradeMessage,
    colors,
    isTest,
    isFree,
  } = usePlanLimits()
  const { trackMemberAdd, trackLimitReached, trackUpgradeClick } =
    useTelemetry()

  const [isAdding, setIsAdding] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const currentMemberCount = agenda?.members.length || 0
  const canAddMore = canAdd(currentMemberCount)

  const handleAddMember = () => {
    if (!canAddMore) {
      trackLimitReached('members')
      setShowUpgradeModal(true)
      return
    }

    if (newMemberName.trim()) {
      addMember(newMemberName.trim())
      trackMemberAdd()
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

  const handleUpgrade = () => {
    trackUpgradeClick(isTest ? 'test' : 'free', isTest ? 'free' : 'pro')
    router.push(isTest ? '/auth' : '/pricing')
    setShowUpgradeModal(false)
  }

  if (!agenda) return null

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Membres de l&apos;équipe</CardTitle>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  canAddMore ? 'text-gray-500' : colors.text
                }`}
              >
                {formatMemberLimit(currentMemberCount)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Alerte limite atteinte */}
          {!canAddMore && (
            <div
              className={`mb-4 p-3 ${colors.bg} border-2 ${colors.border} rounded-lg`}
            >
              <div className="flex items-start gap-2">
                <Lock className={`w-4 h-4 ${colors.text} mt-0.5`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${colors.text}`}>
                    Limite atteinte
                  </p>
                  <p className={`text-xs ${colors.text} opacity-90 mt-1`}>
                    {upgradeMessage.description}
                  </p>
                  <Button
                    size="sm"
                    variant="accent"
                    className="mt-2"
                    onClick={() => setShowUpgradeModal(true)}
                    leftIcon={<Crown className="w-3 h-3" />}
                  >
                    {upgradeMessage.cta}
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
                      className="flex-1 text-sm py-1"
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
                      aria-label="Enregistrer les modifications"
                      className="p-1 h-auto"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      aria-label="Annuler les modifications"
                      className="p-1 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
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
                      aria-label={`Modifier le membre ${member.name}`}
                      className="p-1 h-auto"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMember(member.id)}
                      aria-label={`Supprimer le membre ${member.name}`}
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
                  aria-label="Annuler l'ajout"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => {
                if (canAddMore) {
                  setIsAdding(true)
                } else {
                  setShowUpgradeModal(true)
                }
              }}
              variant={canAddMore ? 'secondary' : 'outline'}
              className="w-full"
              leftIcon={
                canAddMore ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )
              }
              disabled={!canAddMore}
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
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}
                >
                  <Crown className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {upgradeMessage.title}
                </h2>
              </div>

              <p className="text-gray-600 mb-6">{upgradeMessage.description}</p>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleUpgrade}
                  leftIcon={<Crown className="w-4 h-4" />}
                >
                  {upgradeMessage.cta}
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
