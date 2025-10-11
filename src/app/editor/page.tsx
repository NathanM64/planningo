'use client'

import Link from 'next/link'
import { useEditorStore } from '@/stores/editorStore'
import { useEffect } from 'react'
import { Button } from '@/components/ui'
import { Printer, Calendar } from 'lucide-react'
import MemberList from './components/MemberList'

export default function EditorPage() {
  const { agenda, createNewAgenda } = useEditorStore()

  // Crée un nouvel agenda au chargement si aucun n'existe
  useEffect(() => {
    if (!agenda) {
      createNewAgenda()
    }
  }, [agenda, createNewAgenda])

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
            <Button variant="ghost">Enregistrer</Button>
            <Button leftIcon={<Printer className="w-4 h-4" />}>
              Exporter PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-[300px_1fr] gap-6">
          {/* Sidebar gauche */}
          <div>
            <MemberList />
          </div>

          {/* Canvas principal */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Grille en construction
              </h2>
              <p className="text-gray-600 mb-4">
                La grille hebdomadaire arrivera dans la prochaine étape.
              </p>
              <p className="text-sm text-gray-500">
                Pour l'instant, teste la gestion des membres à gauche !
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
