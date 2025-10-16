'use client'

import { KEYBOARD_SHORTCUTS } from '../hooks/useKeyboardShortcuts'
import { X } from 'lucide-react'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null

  // Grouper les raccourcis par catégorie
  const categories = ['Navigation', 'Actions', 'Edition'] as const
  const shortcutsByCategory = categories.map((category) => ({
    category,
    shortcuts: KEYBOARD_SHORTCUTS.filter((s) => s.category === category),
  }))

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2
              id="shortcuts-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              Raccourcis clavier
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {shortcutsByCategory.map(({ category, shortcuts }) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center">
                            <kbd
                              className="px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                            >
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-gray-400">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Astuce :</span> Sur Mac, utilisez{' '}
              <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 rounded">
                Cmd
              </kbd>{' '}
              à la place de{' '}
              <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 rounded">
                Ctrl
              </kbd>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
