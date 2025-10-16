'use client'

import { AlertTriangle } from 'lucide-react'
import type { Conflict } from '../lib/conflict-detection'

interface ConflictAlertModalProps {
  isOpen: boolean
  conflict: Conflict | null
  onCancel: () => void
  onForce: () => void
}

/**
 * Modal d'alerte pour afficher les conflits détectés
 * Propose 2 options :
 * - Annuler la création/modification
 * - Forcer quand même (override)
 */
export default function ConflictAlertModal({
  isOpen,
  conflict,
  onCancel,
  onForce,
}: ConflictAlertModalProps) {
  if (!isOpen || !conflict) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conflict-modal-title"
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header avec icône d'alerte */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h2
                  id="conflict-modal-title"
                  className="text-lg font-bold text-gray-900"
                >
                  Conflit détecté
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Un membre est déjà assigné à un autre créneau pendant cette période
                </p>
              </div>
            </div>
          </div>

          {/* Content - Détails du conflit */}
          <div className="p-6 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                {conflict.message}
              </p>

              {conflict.conflictingBlock && (
                <div className="mt-3 pt-3 border-t border-yellow-200">
                  <p className="text-xs text-gray-600 mb-1">Créneau en conflit :</p>
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">
                      {conflict.conflictingBlock.label || 'Sans titre'}
                    </span>
                    <br />
                    <span className="text-gray-600">
                      {conflict.conflictingBlock.start} - {conflict.conflictingBlock.end}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">Que souhaitez-vous faire ?</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Annuler pour modifier les horaires</li>
                <li>Forcer pour créer quand même (non recommandé)</li>
              </ul>
            </div>
          </div>

          {/* Footer - Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              onClick={onForce}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Forcer quand même
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
