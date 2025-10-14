// src/stores/editorStore.ts
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import {
  Agenda,
  AgendaBlock,
  Member,
  createEmptyMember,
  createEmptyBlock,
  getMonday,
  formatDateISO,
} from '@/types/agenda'
import { getRandomBlockColor } from '@/lib/colors'
import { saveAgenda, loadAgenda, deleteAgenda } from '@/lib/agendaService'
import { toastService } from '@/lib/toastService'

interface EditorState {
  // État actuel
  agenda: Agenda | null
  selectedBlockId: string | null

  // États Supabase
  isSaving: boolean
  isLoading: boolean
  lastSaved: string | null

  // Actions pour l'agenda
  setAgenda: (agenda: Agenda) => void
  createNewAgenda: () => void
  updateAgendaName: (name: string) => void

  // Actions pour les membres
  addMember: (name: string) => void
  updateMember: (id: string, updates: Partial<Member>) => void
  removeMember: (id: string) => void

  // Actions pour les blocs (avec memberIds au pluriel)
  addBlock: (block: Omit<AgendaBlock, 'id'>) => void
  updateBlock: (id: string, updates: Partial<AgendaBlock>) => void
  removeBlock: (id: string) => void
  selectBlock: (id: string | null) => void

  // Navigation de dates
  goToPreviousWeek: () => void
  goToNextWeek: () => void
  goToToday: () => void

  // Actions Supabase
  saveToCloud: () => Promise<void>
  loadFromCloud: (agendaId: string) => Promise<void>
  deleteFromCloud: (agendaId: string) => Promise<void>
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // État initial
  agenda: null,
  selectedBlockId: null,
  isSaving: false,
  isLoading: false,
  lastSaved: null,

  // Définir un agenda complet
  setAgenda: (agenda) => {
    set({ agenda, selectedBlockId: null })
  },

  // Créer un nouvel agenda
  createNewAgenda: () => {
    const today = new Date()
    const monday = getMonday(today)

    const newAgenda: Agenda = {
      id: uuidv4(),
      name: 'Nouvel agenda',
      members: [],
      blocks: [],
      layout: 'weekly',
      currentWeekStart: formatDateISO(monday),
      created_at: new Date().toISOString(),
    }
    set({ agenda: newAgenda, selectedBlockId: null })
  },

  // Mettre à jour le nom de l'agenda
  updateAgendaName: (name) => {
    set((state) => ({
      agenda: state.agenda ? { ...state.agenda, name } : null,
    }))
  },

  // ========== MEMBRES ==========

  addMember: (name) => {
    const state = get()
    if (!state.agenda) return

    const color = getRandomBlockColor()
    const newMember: Member = {
      id: uuidv4(),
      name,
      color: color.value,
    }

    set({
      agenda: {
        ...state.agenda,
        members: [...state.agenda.members, newMember],
      },
    })
  },

  updateMember: (id, updates) => {
    const state = get()
    if (!state.agenda) return

    set({
      agenda: {
        ...state.agenda,
        members: state.agenda.members.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        ),
      },
    })
  },

  // Supprimer un membre ET retirer son ID de tous les blocs
  removeMember: (id) => {
    const state = get()
    if (!state.agenda) return

    set({
      agenda: {
        ...state.agenda,
        members: state.agenda.members.filter((m) => m.id !== id),
        // Retirer ce membre de tous les blocs
        blocks: state.agenda.blocks
          .map((block) => ({
            ...block,
            memberIds: block.memberIds.filter((mId) => mId !== id),
          }))
          // Supprimer les blocs qui n'ont plus aucun membre
          .filter((block) => block.memberIds.length > 0),
      },
    })
  },

  // ========== BLOCS ==========

  addBlock: (block) => {
    const state = get()
    if (!state.agenda) return

    const newBlock: AgendaBlock = {
      ...block,
      id: uuidv4(),
    }

    set({
      agenda: {
        ...state.agenda,
        blocks: [...state.agenda.blocks, newBlock],
      },
    })
  },

  updateBlock: (id, updates) => {
    const state = get()
    if (!state.agenda) return

    set({
      agenda: {
        ...state.agenda,
        blocks: state.agenda.blocks.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        ),
      },
    })
  },

  removeBlock: (id) => {
    const state = get()
    if (!state.agenda) return

    set({
      agenda: {
        ...state.agenda,
        blocks: state.agenda.blocks.filter((b) => b.id !== id),
      },
      selectedBlockId:
        state.selectedBlockId === id ? null : state.selectedBlockId,
    })
  },

  selectBlock: (id) => {
    set({ selectedBlockId: id })
  },

  // ========== NAVIGATION ==========

  goToPreviousWeek: () => {
    const state = get()
    if (!state.agenda) return

    const currentDate = new Date(state.agenda.currentWeekStart)
    currentDate.setDate(currentDate.getDate() - 7)

    set({
      agenda: {
        ...state.agenda,
        currentWeekStart: formatDateISO(currentDate),
      },
    })
  },

  goToNextWeek: () => {
    const state = get()
    if (!state.agenda) return

    const currentDate = new Date(state.agenda.currentWeekStart)
    currentDate.setDate(currentDate.getDate() + 7)

    set({
      agenda: {
        ...state.agenda,
        currentWeekStart: formatDateISO(currentDate),
      },
    })
  },

  goToToday: () => {
    const state = get()
    if (!state.agenda) return

    const today = new Date()
    const monday = getMonday(today)

    set({
      agenda: {
        ...state.agenda,
        currentWeekStart: formatDateISO(monday),
      },
    })
  },

  // ========== SUPABASE ==========

  saveToCloud: async () => {
    const state = get()
    if (!state.agenda) return

    set({ isSaving: true })

    try {
      const result = await saveAgenda(state.agenda)

      if (result.success) {
        set({
          lastSaved: new Date().toISOString(),
          isSaving: false,
        })
        console.log('✅ Agenda sauvegardé')
        toastService.success('Agenda sauvegardé avec succès')
      } else {
        console.error('❌ Erreur:', result.error)
        set({ isSaving: false })
        toastService.error(`Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Erreur inattendue:', error)
      set({ isSaving: false })
      toastService.error('Erreur de sauvegarde')
    }
  },

  loadFromCloud: async (agendaId: string) => {
    set({ isLoading: true })

    try {
      const result = await loadAgenda(agendaId)

      if (result.success && result.data) {
        set({
          agenda: result.data,
          selectedBlockId: null,
          isLoading: false,
          lastSaved: result.data.updated_at || null,
        })
        console.log('✅ Agenda chargé')
      } else {
        console.error('❌ Erreur:', result.error)
        set({ isLoading: false })
        toastService.error(`Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Erreur inattendue:', error)
      set({ isLoading: false })
      toastService.error('Erreur de chargement')
    }
  },

  deleteFromCloud: async (agendaId: string) => {
    try {
      const result = await deleteAgenda(agendaId)

      if (result.success) {
        console.log('✅ Agenda supprimé')
        const state = get()
        if (state.agenda?.id === agendaId) {
          state.createNewAgenda()
        }
        toastService.success('Agenda supprimé avec succès')
      } else {
        console.error('❌ Erreur:', result.error)
        toastService.error(`Erreur: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Erreur inattendue:', error)
      toastService.error('Erreur de suppression')
    }
  },
}))
