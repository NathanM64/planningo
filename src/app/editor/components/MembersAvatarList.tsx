// src/app/editor/components/MembersAvatarList.tsx
'use client'

import { useState } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { Users, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * Composant compact affichant les membres sous forme d'avatars
 * Avec un bouton pour gérer les membres (modal)
 */
export default function MembersAvatarList() {
  const { agenda, addMember, removeMember, updateMember } = useEditorStore()
  const [showManageModal, setShowManageModal] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  if (!agenda) return null

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addMember(newMemberName.trim())
      setNewMemberName('')
      setIsAdding(false)
    }
  }

  return (
    <>
      {/* Barre d'avatars compacte */}
      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200">
        <Users className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Membres:</span>

        {/* Liste d'avatars */}
        <div className="flex items-center gap-2 flex-1">
          {agenda.members.length === 0 ? (
            <span className="text-sm text-gray-400 italic">Aucun membre</span>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {agenda.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 hover:shadow-md transition cursor-default"
                  style={{
                    backgroundColor: `${member.color}20`,
                    borderColor: member.color,
                  }}
                  title={member.name}
                >
                  {/* Avatar circulaire */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: member.color }}
                  >
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton gérer les membres */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowManageModal(true)}
          leftIcon={<Users className="w-4 h-4" />}
        >
          Gérer
        </Button>
      </div>

      {/* Modal de gestion des membres */}
      {showManageModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowManageModal(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="manage-members-title"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2
                  id="manage-members-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Gérer les membres
                </h2>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Liste des membres */}
              <div className="p-4 space-y-3">
                {agenda.members.length === 0 && !isAdding && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun membre. Ajoutez-en un !
                  </p>
                )}

                {agenda.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 hover:border-gray-300 transition"
                    style={{
                      borderColor: `${member.color}40`,
                      backgroundColor: `${member.color}10`,
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Nom */}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {agenda.blocks.filter((b) =>
                          b.memberIds.includes(member.id)
                        ).length}{' '}
                        créneau(x)
                      </div>
                    </div>

                    {/* Color picker */}
                    <label
                      htmlFor={`color-picker-${member.id}`}
                      className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-gray-400 transition relative border-2 border-white shadow"
                      style={{ backgroundColor: member.color }}
                      title="Changer la couleur"
                    >
                      <input
                        id={`color-picker-${member.id}`}
                        type="color"
                        value={member.color}
                        onChange={(e) =>
                          updateMember(member.id, { color: e.target.value })
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label={`Changer la couleur de ${member.name}`}
                      />
                    </label>

                    {/* Bouton supprimer */}
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Supprimer ${member.name} ? Il sera retiré de tous ses créneaux.`
                          )
                        ) {
                          removeMember(member.id)
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      aria-label={`Supprimer ${member.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Formulaire d'ajout */}
                {isAdding ? (
                  <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <input
                      type="text"
                      placeholder="Nom du membre"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        onClick={handleAddMember}
                        size="sm"
                        className="flex-1"
                        disabled={!newMemberName.trim()}
                      >
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
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsAdding(true)}
                    variant="outline"
                    className="w-full border-dashed"
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Ajouter un membre
                  </Button>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t p-4">
                <Button
                  onClick={() => setShowManageModal(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
