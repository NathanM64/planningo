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

interface EditorState {
  // État actuel
  agenda: Agenda | null
  selectedBlockId: string | null

  // Actions pour l'agenda
  setAgenda: (agenda: Agenda) => void
  createNewAgenda: () => void
  updateAgendaName: (name: string) => void

  // Actions pour les membres
  addMember: (name: string) => void
  updateMember: (id: string, updates: Partial<Member>) => void
  removeMember: (id: string) => void

  // Actions pour les blocs
  addBlock: (block: Omit<AgendaBlock, 'id'>) => void
  updateBlock: (id: string, updates: Partial<AgendaBlock>) => void
  removeBlock: (id: string) => void
  selectBlock: (id: string | null) => void

  // Navigation de dates
  goToPreviousWeek: () => void
  goToNextWeek: () => void
  goToToday: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // État initial
  agenda: null,
  selectedBlockId: null,

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

  // Ajouter un membre
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

  // Mettre à jour un membre
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

  // Supprimer un membre (et ses blocs)
  removeMember: (id) => {
    const state = get()
    if (!state.agenda) return

    set({
      agenda: {
        ...state.agenda,
        members: state.agenda.members.filter((m) => m.id !== id),
        blocks: state.agenda.blocks.filter((b) => b.memberId !== id),
      },
    })
  },

  // ========== BLOCS ==========

  // Ajouter un bloc
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

  // Mettre à jour un bloc
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

  // Supprimer un bloc
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

  // Sélectionner un bloc
  selectBlock: (id) => {
    set({ selectedBlockId: id })
  },

  // ========== NAVIGATION ==========

  // Aller à la semaine précédente
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

  // Aller à la semaine suivante
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

  // Aller à la semaine courante (aujourd'hui)
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
}))
