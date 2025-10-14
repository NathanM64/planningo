// src/app/editor/page.tsx
'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { useTelemetry } from '@/hooks/useTelemetry'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui'
import { Printer, Save, LogOut, LogIn, Cloud, Loader2 } from 'lucide-react'
import MemberList from './components/MemberList'
import WeekGrid from './components/WeekGrid'
import PrintableWeek from './components/PrintableWeek'
import TestModeBanner from './components/TestModeBanner'
import PlanBadge from '@/components/PlanBadge'

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signOut } = useAuth()
  const {
    agenda,
    createNewAgenda,
    saveToCloud,
    loadFromCloud,
    isSaving,
    isLoading,
  } = useEditorStore()
  const { isTest, can, config } = usePlanLimits()
  const {
    trackAgendaCreate,
    trackAgendaSave,
    trackPdfExport,
    trackUpgradeClick,
  } = useTelemetry()
  const printRef = useRef<HTMLDivElement>(null)
  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false)

  // Charger l'agenda depuis l'URL si paramètre "load" présent
  useEffect(() => {
    const loadAgendaId = searchParams.get('load')

    if (loadAgendaId && !hasLoadedFromUrl && !isLoading) {
      loadFromCloud(loadAgendaId)
      setHasLoadedFromUrl(true)
    } else if (!loadAgendaId && !agenda && !hasLoadedFromUrl && !isLoading) {
      // Créer un nouvel agenda seulement si aucun paramètre load et pas d'agenda
      // Protection contre race condition: vérifier que isLoading est false
      createNewAgenda()
      trackAgendaCreate()
      setHasLoadedFromUrl(true)
    }
  }, [
    searchParams,
    agenda,
    hasLoadedFromUrl,
    isLoading,
    createNewAgenda,
    loadFromCloud,
    trackAgendaCreate,
  ])

  // ⚠️ Alerte de fermeture en mode test
  useEffect(() => {
    if (isTest && agenda && agenda.members.length > 0) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        return '⚠️ Vos modifications seront perdues ! Créez un compte gratuit pour sauvegarder.'
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () =>
        window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isTest, agenda])

  // Configuration de l'impression
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Planning_${agenda?.name || 'Agenda'}_${
      new Date().toISOString().split('T')[0]
    }`,
    onAfterPrint: () => {
      trackPdfExport()
    },
  })

  const handleSaveOrAuth = async () => {
    if (isTest) {
      trackUpgradeClick('test', 'free')
      router.push('/auth')
    } else {
      // Mettre à jour le user_id avant de sauvegarder
      if (user && agenda) {
        useEditorStore.setState({
          agenda: { ...agenda, user_id: user.id },
        })
      }
      await saveToCloud()
      trackAgendaSave()
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleUpgrade = () => {
    trackUpgradeClick(isTest ? 'test' : 'free', isTest ? 'free' : 'pro')
    router.push(isTest ? '/auth' : '/pricing')
  }

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'agenda...</p>
        </div>
      </div>
    )
  }

  if (!agenda) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Initialisation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Bandeau mode test */}
      {isTest && <TestModeBanner />}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + Titre */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <div className="w-8 h-8 bg-[#0000EE] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="hidden sm:inline font-bold text-lg text-gray-900">
                  Planningo
                </span>
              </Link>

              <div className="h-6 w-px bg-gray-300 hidden sm:block" />

              <label htmlFor="agenda-name" className="sr-only">
                Nom de l'agenda
              </label>
              <input
                id="agenda-name"
                type="text"
                value={agenda.name}
                onChange={(e) =>
                  useEditorStore.setState({
                    agenda: { ...agenda, name: e.target.value },
                  })
                }
                className="font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none transition px-2 py-1 w-40 sm:w-auto"
                placeholder="Nom de l'agenda"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Lien Dashboard (si connecté et pas en mode test) */}
              {!isTest && user && (
                <Link href="/dashboard">
                  <Button size="sm" variant="ghost" className="hidden sm:flex">
                    Mes agendas
                  </Button>
                </Link>
              )}

              {/* Badge plan */}
              <PlanBadge showUpgrade={true} onUpgradeClick={handleUpgrade} />

              {/* Bouton Imprimer */}
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
                className="hidden sm:flex"
              >
                Imprimer
              </Button>

              {/* Bouton Enregistrer / Se connecter */}
              <Button
                size="sm"
                onClick={handleSaveOrAuth}
                disabled={isSaving}
                leftIcon={
                  isSaving ? (
                    <Cloud className="w-4 h-4 animate-pulse" />
                  ) : isTest ? (
                    <LogIn className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )
                }
              >
                {isSaving
                  ? 'Sauvegarde...'
                  : isTest
                  ? 'Se connecter'
                  : 'Enregistrer'}
              </Button>

              {/* Déconnexion (si connecté) */}
              {!isTest && user && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSignOut}
                  leftIcon={<LogOut className="w-4 h-4" />}
                  className="hidden sm:flex"
                >
                  Déconnexion
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid lg:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar - Liste des membres */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <MemberList />
          </aside>

          {/* Main - Grille hebdomadaire */}
          <main>
            <WeekGrid />
          </main>
        </div>
      </div>

      {/* Version imprimable (cachée) */}
      <div className="hidden">
        {agenda && (
          <PrintableWeek
            ref={printRef}
            agenda={agenda}
            watermark={config.hasWatermark}
          />
        )}
      </div>
    </div>
  )
}
