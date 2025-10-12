// src/app/editor/page.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { useTelemetry } from '@/hooks/useTelemetry'
import { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui'
import { Printer, Save, LogOut, LogIn, Cloud } from 'lucide-react'
import MemberList from './components/MemberList'
import WeekGrid from './components/WeekGrid'
import PrintableWeek from './components/PrintableWeek'
import TestModeBanner from './components/TestModeBanner'
import PlanBadge from '@/components/PlanBadge'

export default function EditorPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { agenda, createNewAgenda, saveToCloud, isSaving } = useEditorStore()
  const { isTest, can, config } = usePlanLimits()
  const {
    trackAgendaCreate,
    trackAgendaSave,
    trackPdfExport,
    trackUpgradeClick,
  } = useTelemetry()
  const printRef = useRef<HTMLDivElement>(null)

  // Créer un agenda si aucun n'existe
  useEffect(() => {
    if (!agenda) {
      createNewAgenda()
      trackAgendaCreate()
    }
  }, [agenda, createNewAgenda, trackAgendaCreate])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bandeau mode test */}
      <TestModeBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Plan Badge */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <div className="w-8 h-8 bg-[#0000EE] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-xl text-gray-900 hidden sm:inline">
                  Planningo
                </span>
              </Link>

              {/* Nom de l'agenda éditable */}
              {agenda && (
                <input
                  type="text"
                  value={agenda.name}
                  onChange={(e) =>
                    useEditorStore.getState().updateAgendaName(e.target.value)
                  }
                  className="font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-2 py-1 transition max-w-[200px] sm:max-w-xs"
                  placeholder="Nom de l'agenda"
                />
              )}

              <PlanBadge showUpgrade onUpgradeClick={handleUpgrade} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Email utilisateur (si connecté) */}
              {user && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              )}

              {/* Bouton Mes agendas (si connecté et peut sauvegarder) */}
              {user && can('canSave') && (
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                >
                  <span className="hidden sm:inline">Mes agendas</span>
                  <span className="sm:hidden">Agendas</span>
                </Button>
              )}

              {/* Bouton Sauvegarder / Se connecter */}
              <Button
                variant={isTest ? 'primary' : 'ghost'}
                onClick={handleSaveOrAuth}
                disabled={!agenda || (!isTest && isSaving) || !can('canSave')}
                leftIcon={isSaving ? undefined : <Save className="w-4 h-4" />}
              >
                {isSaving
                  ? 'Enregistrement...'
                  : isTest
                  ? 'Sauvegarder dans le cloud'
                  : 'Enregistrer'}
              </Button>

              {/* Bouton Export PDF */}
              <Button
                variant="primary"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
                disabled={
                  !agenda || agenda.members.length === 0 || !can('canExportPdf')
                }
              >
                <span className="hidden sm:inline">Exporter PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>

              {/* Bouton Connexion / Déconnexion */}
              {user ? (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push('/auth')}
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  <span className="hidden sm:inline">Connexion</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar gauche */}
          <div className="space-y-6">
            <MemberList />
          </div>

          {/* Canvas principal */}
          <div>
            <WeekGrid />
          </div>
        </div>

        {/* Composant caché pour l'impression */}
        <div className="hidden">
          {agenda && (
            <PrintableWeek
              ref={printRef}
              agenda={agenda}
              watermark={config.hasWatermark}
            />
          )}
        </div>
      </main>
    </div>
  )
}
