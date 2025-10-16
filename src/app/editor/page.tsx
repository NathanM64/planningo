// src/app/editor/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/contexts/PlanContext'
import { useTelemetry } from '@/hooks/useTelemetry'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import EditorToolbar from './components/EditorToolbar'
import MemberList from './components/MemberList'
import GridFactory from './components/grids/GridFactory'
import PrintableWeek from './components/PrintableWeek'
import TestModeBanner from './components/TestModeBanner'
import EditorSkeleton from './components/EditorSkeleton'
import AgendaSetupWizard from './components/wizard/AgendaSetupWizard'
import KeyboardShortcutsButton from './components/KeyboardShortcutsButton'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import type { WizardConfig } from './components/wizard/types'
import type { Agenda } from '@/types/agenda'

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const {
    agenda,
    setAgenda,
    createNewAgenda,
    saveToCloud,
    loadFromCloud,
    isSaving,
    isLoading,
  } = useEditorStore()
  const { isTest, config } = usePlanLimits()
  const {
    trackAgendaCreate,
    trackAgendaSave,
    trackPdfExport,
    trackUpgradeClick,
  } = useTelemetry()
  const printRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)
  const [showSetupModal, setShowSetupModal] = useState(false)

  // Charger l'agenda depuis l'URL si paramètre "load" présent
  // Ce useEffect ne doit s'exécuter qu'UNE SEULE FOIS au montage
  useEffect(() => {
    // Utiliser un ref pour empêcher la double exécution en Strict Mode
    if (hasInitialized.current) return

    const loadAgendaId = searchParams.get('load')

    if (loadAgendaId && !isLoading) {
      // Charger un agenda existant depuis l'URL
      loadFromCloud(loadAgendaId)
      hasInitialized.current = true
    } else if (!loadAgendaId && !isLoading) {
      // Pas de paramètre load = nouvel agenda
      // Réinitialiser le store et afficher le modal
      useEditorStore.setState({ agenda: null, selectedBlockId: null })
      setShowSetupModal(true)
      hasInitialized.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleWizardComplete = (config: WizardConfig, templateAgenda?: Agenda) => {
    // Si un template agenda est fourni, l'utiliser directement
    if (templateAgenda) {
      setAgenda(templateAgenda)
    } else {
      // Sinon, créer un agenda vierge avec la configuration
      createNewAgenda(config.mode, config.timeSlotDisplay, config.fixedPeriods)
    }
    trackAgendaCreate()
  }

  // Activer les raccourcis clavier
  useKeyboardShortcuts({
    onSave: handleSaveOrAuth,
    onPrint: handlePrint,
    enabled: !showSetupModal && !!agenda,
  })

  // Effet pour fermer le modal automatiquement une fois l'agenda créé
  useEffect(() => {
    if (showSetupModal && agenda) {
      setShowSetupModal(false)
    }
  }, [showSetupModal, agenda])


  // Afficher le wizard de setup si pas d'agenda
  if (showSetupModal) {
    return (
      <AgendaSetupWizard
        isOpen={showSetupModal}
        onClose={() => {
          // Si on annule, retourner au dashboard
          router.push('/dashboard')
        }}
        onComplete={handleWizardComplete}
      />
    )
  }

  // Afficher un skeleton pendant le chargement
  if (isLoading || !agenda) {
    return <EditorSkeleton />
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

          {/* Main - Grille hebdomadaire (via GridFactory) */}
          <main className="w-full min-w-0">
            <GridFactory />
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

      {/* Bouton d'aide raccourcis clavier */}
      <KeyboardShortcutsButton />
    </div>
  )
}
