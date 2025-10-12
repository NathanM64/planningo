// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { loadAllAgendas, deleteAgenda } from '@/lib/agendaService'
import { useEditorStore } from '@/stores/editorStore'
import { Button } from '@/components/ui'
import CheckoutButton from '@/components/CheckoutButton'
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  Crown,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface AgendaItem {
  id: string
  name: string
  created_at: string
  updated_at: string
  members?: Array<{ id: string; name: string; color: string }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut, loading: authLoading } = useAuth()
  const { plan, planName, limits, canAddAgenda, config } = usePlanLimits()
  const createNewAgenda = useEditorStore((state) => state.createNewAgenda)

  const [agendas, setAgendas] = useState<AgendaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Rediriger si mode test ET pas connecté (mais attendre que auth soit chargé)
  useEffect(() => {
    if (!authLoading && plan === 'test' && !user) {
      router.push('/editor')
    }
  }, [plan, user, router, authLoading])

  // Charger les agendas
  useEffect(() => {
    const fetchAgendas = async () => {
      if (!user) return

      setIsLoading(true)

      // Charger les agendas
      const result = await loadAllAgendas(user.id)

      if (result.success && result.data) {
        // Pour chaque agenda, charger aussi les membres
        const agendasWithMembers = await Promise.all(
          result.data.map(async (agenda) => {
            // Requête pour récupérer les membres
            const { data: members } = await (
              await import('@/lib/supabaseClient')
            ).supabase
              .from('members')
              .select('id, name, color')
              .eq('agenda_id', agenda.id)
              .limit(5) // Limiter à 5 membres max pour l'affichage

            return {
              ...agenda,
              members: members || [],
            }
          })
        )

        setAgendas(agendasWithMembers)
      } else {
        console.error('Erreur chargement agendas:', result.error)
      }
      setIsLoading(false)
    }

    fetchAgendas()
  }, [user])

  const handleCreateNew = () => {
    const canCreate = canAddAgenda(agendas.length)

    if (!canCreate) {
      setShowUpgradeModal(true)
      return
    }

    createNewAgenda()
    router.push('/editor')
  }

  const handleOpenAgenda = (agendaId: string) => {
    router.push(`/editor?load=${agendaId}`)
  }

  const handleDeleteAgenda = async (agendaId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet agenda ?')) return

    setDeletingId(agendaId)
    const result = await deleteAgenda(agendaId)

    if (result.success) {
      setAgendas((prev) => prev.filter((a) => a.id !== agendaId))
    } else {
      alert(`Erreur: ${result.error}`)
    }
    setDeletingId(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return formatDate(dateStr)
  }

  if (!authLoading && plan === 'test' && !user) {
    return null // Redirigé vers /editor
  }

  // Loading state pendant chargement auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <div className="w-8 h-8 bg-[#0000EE] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Planningo</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-semibold text-blue-900">
                  {planName}
                </span>
              </div>
              <Button variant="ghost" onClick={signOut} size="sm">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes agendas</h1>
          <p className="text-gray-600">
            Gérez vos plannings hebdomadaires sauvegardés
          </p>
        </div>

        {/* Limite et CTA */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {limits.maxAgendas === null ? (
                <span className="font-semibold text-green-600">
                  Agendas illimités
                </span>
              ) : (
                <span>
                  <span className="font-semibold text-gray-900">
                    {agendas.length}/{limits.maxAgendas}
                  </span>{' '}
                  agenda{limits.maxAgendas > 1 ? 's' : ''} utilisé
                  {agendas.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {plan === 'free' && (
              <Link href="/pricing">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Passer Pro
                </button>
              </Link>
            )}
          </div>

          <Button
            onClick={handleCreateNew}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Créer un agenda
          </Button>
        </div>

        {/* Liste des agendas */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : agendas.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun agenda pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre premier agenda pour commencer
            </p>
            <Button
              onClick={handleCreateNew}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Créer mon premier agenda
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendas.map((agenda) => (
              <div
                key={agenda.id}
                className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">
                          {agenda.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatTime(agenda.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Membres */}
                  {agenda.members && agenda.members.length > 0 && (
                    <div className="mb-4 flex items-center gap-2 flex-wrap">
                      {agenda.members.slice(0, 4).map((member) => (
                        <div
                          key={member.id}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${member.color}15`,
                            color: member.color,
                            border: `1px solid ${member.color}40`,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: member.color }}
                          />
                          {member.name}
                        </div>
                      ))}
                      {agenda.members.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{agenda.members.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenAgenda(agenda.id)}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    >
                      Ouvrir
                    </Button>
                    <Button
                      onClick={() => handleDeleteAgenda(agenda.id)}
                      variant="ghost"
                      size="sm"
                      disabled={deletingId === agenda.id}
                      className="text-red-600 hover:bg-red-50"
                    >
                      {deletingId === agenda.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Créé le {formatDate(agenda.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Avertissement limite atteinte */}
        {plan === 'free' && agendas.length >= 1 && (
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-yellow-900 mb-1">
                  Limite atteinte
                </h4>
                <p className="text-sm text-yellow-800 mb-4">
                  Vous avez atteint votre limite de {limits.maxAgendas} agenda.
                  Pour créer un nouveau planning, vous devez soit supprimer
                  l'existant, soit passer en plan Pro.
                </p>
                <Link href="/pricing">
                  <Button size="sm" leftIcon={<Crown className="w-4 h-4" />}>
                    Découvrir le plan Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Upgrade */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Passez en Pro
                </h3>
                <p className="text-sm text-gray-600">
                  Débloquez les agendas illimités
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Avec le plan Pro :
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Agendas illimités
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Membres illimités
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  PDF sans marque Planningo
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  Support prioritaire
                </li>
              </ul>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                5€
                <span className="text-lg text-gray-600 font-normal">/mois</span>
              </div>
              <p className="text-sm text-gray-600">Sans engagement</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowUpgradeModal(false)}
                variant="outline"
                className="flex-1"
              >
                Plus tard
              </Button>
              <Button
                onClick={() => router.push('/pricing')}
                variant="primary"
                className="flex-1"
                leftIcon={<Crown className="w-4 h-4" />}
              >
                Passer Pro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
