'use client'

import Link from 'next/link'
import { useEditorStore } from '@/stores/editorStore'
import { useEffect } from 'react'

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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Planningo</span>
          </Link>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition">
              Enregistrer
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
              Exporter PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {agenda?.name || 'Nouvel agenda'}
          </h1>
          <p className="text-gray-600 mb-8">
            Layout : {agenda?.layout || 'weekly'} | Thème :{' '}
            {agenda?.theme || 'default'}
          </p>

          {/* Zone de l'éditeur - à développer */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Éditeur en construction
              </h2>
              <p className="text-gray-600 mb-6">
                L'interface de création d'agenda sera disponible ici. Pour
                l'instant, voici un aperçu de la structure.
              </p>
              <div className="flex gap-3 justify-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Ajouter un créneau
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Changer le thème
                </button>
              </div>
            </div>
          </div>

          {/* Debug info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-mono">
              Agenda ID : {agenda?.id || 'Non créé'}
            </p>
            <p className="text-sm text-gray-600 font-mono">
              Blocs : {agenda?.blocks.length || 0}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
