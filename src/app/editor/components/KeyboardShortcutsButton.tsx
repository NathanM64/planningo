'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import KeyboardShortcutsModal from './KeyboardShortcutsModal'

/**
 * Bouton flottant en bas à droite pour ouvrir le modal des raccourcis clavier
 */
export default function KeyboardShortcutsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Afficher les raccourcis clavier"
        title="Raccourcis clavier (?)"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Modal */}
      <KeyboardShortcutsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
