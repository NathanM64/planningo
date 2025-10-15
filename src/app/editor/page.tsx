// src/app/editor/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/contexts/PlanContext'
import { useTelemetry } from '@/hooks/useTelemetry'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Loader2 } from 'lucide-react'
import EditorToolbar from './components/EditorToolbar'
import MemberList from './components/MemberList'
import WeekGrid from './components/WeekGrid'
import PrintableWeek from './components/PrintableWeek'
import TestModeBanner from './components/TestModeBanner'

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

  // Alerte de fermeture en mode test
  useEffect(() => {
    if (isTest && agenda && agenda.members.length > 0) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        return 'Vos modifications seront perdues ! Créez un compte gratuit pour sauvegarder.'
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

      {/* Toolbar (actions de l'éditeur) */}
      <EditorToolbar
        agendaName={agenda.name}
        onAgendaNameChange={(name) =>
          useEditorStore.setState({
            agenda: { ...agenda, name },
          })
        }
        onPrint={handlePrint}
        onSave={handleSaveOrAuth}
        isSaving={isSaving}
      />

      {/* Contenu principal */}
      <div className="flex-1 container mx-auto px-2 sm:px-4 pb-6 max-w-7xl">
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-4 lg:gap-6">
          {/* Sidebar - Liste des membres */}
          <aside className="lg:sticky lg:top-24 lg:self-start w-full">
            <MemberList />
          </aside>

          {/* Main - Grille hebdomadaire */}
          <main className="w-full min-w-0">
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
