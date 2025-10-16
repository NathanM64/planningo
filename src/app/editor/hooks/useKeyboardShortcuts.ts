import { useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  description: string
  action: () => void
}

/**
 * Hook pour gérer les raccourcis clavier dans l'éditeur
 *
 * Raccourcis disponibles :
 * - N : Nouveau créneau
 * - Ctrl+S / Cmd+S : Sauvegarder
 * - Ctrl+← / Cmd+← : Semaine précédente
 * - Ctrl+→ / Cmd+→ : Semaine suivante
 * - T : Aller à aujourd'hui
 * - Esc : Fermer panneau/modal
 * - Suppr : Supprimer créneau sélectionné
 */
export function useKeyboardShortcuts(options: {
  onSave?: () => void
  onPrint?: () => void
  enabled?: boolean
} = {}) {
  const { enabled = true, onSave, onPrint } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      const isContentEditable = target.isContentEditable

      // Ignorer les événements dans les champs de saisie (sauf Esc)
      if ((isInputField || isContentEditable) && e.key !== 'Escape') {
        return
      }

      const key = e.key.toLowerCase()
      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      // N : Nouveau créneau
      if (key === 'n' && !isCtrlOrCmd && !isInputField) {
        e.preventDefault()
        // Ouvrir le modal de création de créneau
        // Note: cette fonctionnalité sera implémentée via le store
        console.log('Raccourci: Nouveau créneau')
      }

      // Ctrl+S / Cmd+S : Sauvegarder
      if (key === 's' && isCtrlOrCmd) {
        e.preventDefault()
        if (onSave) {
          onSave()
        }
      }

      // Ctrl+P / Cmd+P : Imprimer
      if (key === 'p' && isCtrlOrCmd) {
        e.preventDefault()
        if (onPrint) {
          onPrint()
        }
      }

      // Ctrl+← / Cmd+← : Semaine précédente
      if (key === 'arrowleft' && isCtrlOrCmd) {
        e.preventDefault()
        const agenda = useEditorStore.getState().agenda
        if (agenda) {
          const currentWeek = new Date(agenda.currentWeekStart)
          currentWeek.setDate(currentWeek.getDate() - 7)
          useEditorStore.setState({
            agenda: {
              ...agenda,
              currentWeekStart: currentWeek.toISOString().split('T')[0],
            },
          })
        }
      }

      // Ctrl+→ / Cmd+→ : Semaine suivante
      if (key === 'arrowright' && isCtrlOrCmd) {
        e.preventDefault()
        const agenda = useEditorStore.getState().agenda
        if (agenda) {
          const currentWeek = new Date(agenda.currentWeekStart)
          currentWeek.setDate(currentWeek.getDate() + 7)
          useEditorStore.setState({
            agenda: {
              ...agenda,
              currentWeekStart: currentWeek.toISOString().split('T')[0],
            },
          })
        }
      }

      // T : Aller à aujourd'hui
      if (key === 't' && !isCtrlOrCmd && !isInputField) {
        e.preventDefault()
        const agenda = useEditorStore.getState().agenda
        if (agenda) {
          const today = new Date()
          const monday = new Date(today)
          const day = today.getDay()
          const diff = today.getDate() - day + (day === 0 ? -6 : 1)
          monday.setDate(diff)

          useEditorStore.setState({
            agenda: {
              ...agenda,
              currentWeekStart: monday.toISOString().split('T')[0],
            },
          })
        }
      }

      // Esc : Fermer panneau/modal
      if (key === 'escape') {
        // Le PropertiesPanel gère déjà Esc via onClose
        // Pas besoin d'action supplémentaire ici
      }

      // Suppr : Supprimer créneau sélectionné
      if ((key === 'delete' || key === 'backspace') && !isInputField) {
        const selectedBlockId = useEditorStore.getState().selectedBlockId
        if (selectedBlockId) {
          e.preventDefault()
          const agenda = useEditorStore.getState().agenda
          if (agenda) {
            const updatedBlocks = agenda.blocks.filter(
              (block) => block.id !== selectedBlockId
            )
            useEditorStore.setState({
              agenda: { ...agenda, blocks: updatedBlocks },
              selectedBlockId: null,
            })
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onSave, onPrint])
}

/**
 * Liste des raccourcis disponibles (pour affichage dans le modal d'aide)
 */
export const KEYBOARD_SHORTCUTS: Array<{
  keys: string[]
  description: string
  category: 'Navigation' | 'Actions' | 'Edition'
}> = [
  {
    keys: ['N'],
    description: 'Créer un nouveau créneau',
    category: 'Actions',
  },
  {
    keys: ['Ctrl', 'S'],
    description: 'Sauvegarder',
    category: 'Actions',
  },
  {
    keys: ['Ctrl', 'P'],
    description: 'Imprimer',
    category: 'Actions',
  },
  {
    keys: ['Ctrl', '←'],
    description: 'Semaine précédente',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', '→'],
    description: 'Semaine suivante',
    category: 'Navigation',
  },
  {
    keys: ['T'],
    description: "Aller à aujourd'hui",
    category: 'Navigation',
  },
  {
    keys: ['Esc'],
    description: 'Fermer panneau/modal',
    category: 'Edition',
  },
  {
    keys: ['Suppr'],
    description: 'Supprimer le créneau sélectionné',
    category: 'Edition',
  },
]
