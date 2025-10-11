'use client'

import Link from 'next/link'
import { useEditorStore } from '@/stores/editorStore'
import { useEffect } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { Printer, Plus, Palette, Calendar } from 'lucide-react'

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
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {agenda?.name || 'Nouvel agenda'}
            </h1>
            <p className="text-gray-600 mb-8">
              Layout :{' '}
              <span className="font-semibold">
                {agenda?.layout || 'weekly'}
              </span>{' '}
              | Thème :{' '}
              <span className="font-semibold">
                {agenda?.theme || 'default'}
              </span>
            </p>

            {/* Zone de l'éditeur - à développer */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Éditeur en construction
                </h2>
                <p className="text-gray-600 mb-6">
                  L'interface de création d'agenda sera disponible ici. Pour
                  l'instant, le design system est prêt !
                </p>
                <div className="flex gap-3 justify-center">
                  <Button leftIcon={<Plus className="w-4 h-4" />}>
                    Ajouter un créneau
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={<Palette className="w-4 h-4" />}
                  >
                    Changer le thème
                  </Button>
                </div>
              </div>
            </div>

            {/* Debug info */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 font-mono">
                <span className="font-semibold">Agenda ID :</span>{' '}
                {agenda?.id || 'Non créé'}
              </p>
              <p className="text-sm text-gray-700 font-mono">
                <span className="font-semibold">Blocs :</span>{' '}
                {agenda?.blocks.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
