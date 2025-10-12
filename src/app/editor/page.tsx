'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui'
import { Printer, Save, LogOut, LogIn, Cloud } from 'lucide-react'
import MemberList from './components/MemberList'
import WeekGrid from './components/WeekGrid'
import PrintableWeek from './components/PrintableWeek'
import TestModeBanner from './components/TestModeBanner'

export default function EditorPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { agenda, createNewAgenda, saveToCloud, isSaving } = useEditorStore()
  const { isTest, limits } = usePlanLimits()
  const printRef = useRef<HTMLDivElement>(null)

  // Créer un agenda si aucun n'existe
  useEffect(() => {
    if (!agenda) {
      createNewAgenda()
    }
  }, [agenda, createNewAgenda])

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
  })

  const handleSaveOrAuth = () => {
    if (isTest) {
      // Mode test : rediriger vers auth
      router.push('/auth')
    } else {
      // Mode connecté : sauvegarder
      saveToCloud()
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bandeau mode test */}
      <TestModeBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
            {/* Email utilisateur (si connecté) */}
            {user && (
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.email}
              </span>
            )}

            {/* Bouton Sauvegarder / Se connecter */}
            <Button
              variant={isTest ? 'primary' : 'ghost'}
              onClick={handleSaveOrAuth}
              disabled={!agenda || (!isTest && isSaving)}
              leftIcon={
                isSaving ? undefined : isTest ? (
                  <Cloud className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
            >
              {isSaving
                ? 'Enregistrement...'
                : isTest
                ? 'Sauvegarder dans le cloud'
                : 'Enregistrer'}
            </Button>

            {/* Bouton Export PDF */}
            <Button
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
              disabled={!agenda || agenda.members.length === 0}
            >
              Exporter PDF
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-[320px_1fr] gap-6">
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
          {agenda && <PrintableWeek ref={printRef} agenda={agenda} />}
        </div>
      </main>
    </div>
  )
}
