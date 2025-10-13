// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { loadAllAgendas, deleteAgenda } from '@/lib/agendaService'
import { useEditorStore } from '@/stores/editorStore'
import { Button } from '@/components/ui'
import CheckoutButton from '@/components/CheckoutButton'
import PlanBadge from '@/components/PlanBadge'
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

  useEffect(() => {
    if (!authLoading && plan === 'test' && !user) {
      router.push('/editor')
    }
  }, [plan, user, router, authLoading])

  useEffect(() => {
    const fetchAgendas = async () => {
      if (!user) return

      setIsLoading(true)

      const result = await loadAllAgendas(user.id)

      if (result.success && result.data) {
        // Les membres sont deja charges depuis loadAllAgendas (optimisation N+1)
        setAgendas(result.data)
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
    return null
  }

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
      {/* Header unifié */}
      <Header
        customActions={
          <>
            <Link href="/editor">
              <Button variant="ghost" size="sm">
                Éditeur
              </Button>
            </Link>
            <Button size="sm" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
          </>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes agendas</h1>
          <p className="text-gray-600">
            Gérez vos plannings hebdomadaires sauvegardés
          </p>
        </div>

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

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : agendas.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun agenda pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre premier agenda pour commencer à planifier
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
                className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                        {agenda.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime(agenda.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  {agenda.members && agenda.members.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        {agenda.members.length} membre
                        {agenda.members.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {agenda.members.slice(0, 3).map((member) => (
                          <div
                            key={member.id}
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: member.color + '20',
                              color: member.color,
                              borderLeft: `2px solid ${member.color}`,
                            }}
                          >
                            {member.name}
                          </div>
                        ))}
                        {agenda.members.length > 3 && (
                          <div className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{agenda.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleOpenAgenda(agenda.id)}
                      className="flex-1"
                    >
                      Ouvrir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAgenda(agenda.id)}
                      disabled={deletingId === agenda.id}
                      leftIcon={
                        deletingId === agenda.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )
                      }
                    >
                      {deletingId === agenda.id
                        ? 'Suppression...'
                        : 'Supprimer'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && agendas.length >= (limits.maxAgendas || Infinity) && (
          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  Limite d'agendas atteinte
                </h3>
                <p className="text-sm text-gray-700 mb-4">
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
                  Thèmes personnalisés
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <CheckoutButton className="w-full">
                Passer en Pro - 5€/mois
              </CheckoutButton>
              <Button
                variant="ghost"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full"
              >
                Plus tard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
