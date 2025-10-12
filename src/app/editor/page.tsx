'use client'

import Link from 'next/link'
import { useEditorStore } from '@/stores/editorStore'
import { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui'
import { Printer, Save } from 'lucide-react'
import MemberList from './components/MemberList'
import WeekGrid from './components/WeekGrid'
import PrintableWeek from './components/PrintableWeek'

export default function EditorPage() {
  const { agenda, createNewAgenda, saveToCloud, isSaving } = useEditorStore()
  const printRef = useRef<HTMLDivElement>(null)

  // Crée un nouvel agenda au chargement si aucun n'existe
  useEffect(() => {
    if (!agenda) {
      createNewAgenda()
    }
  }, [agenda, createNewAgenda])

  // Configuration de l'impression
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Planning_${agenda?.name || 'Agenda'}_${
      new Date().toISOString().split('T')[0]
    }`,
  })

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Button
              variant="ghost"
              onClick={saveToCloud}
              disabled={!agenda || isSaving}
              leftIcon={isSaving ? undefined : <Save className="w-4 h-4" />}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
              disabled={!agenda || agenda.members.length === 0}
            >
              Exporter PDF
            </Button>
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
