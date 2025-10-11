import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Agenda, AgendaBlock, AgendaLayout, AgendaTheme } from '@/types/agenda'

interface EditorState {
  // État actuel
  agenda: Agenda | null
  blocks: AgendaBlock[]
  selectedBlockId: string | null

  // Actions pour les blocs
  addBlock: (block: Omit<AgendaBlock, 'id'>) => void
  updateBlock: (id: string, updates: Partial<AgendaBlock>) => void
  removeBlock: (id: string) => void
  selectBlock: (id: string | null) => void
  clearBlocks: () => void

  // Actions pour l'agenda
  setAgenda: (agenda: Agenda) => void
  updateAgendaName: (name: string) => void
  updateAgendaLayout: (layout: AgendaLayout) => void
  updateAgendaTheme: (theme: AgendaTheme) => void
  createNewAgenda: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // État initial
  agenda: null,
  blocks: [],
  selectedBlockId: null,

  // Ajouter un bloc
  addBlock: (block) => {
    const newBlock: AgendaBlock = {
      ...block,
      id: uuidv4(),
    }
    set((state) => ({
      blocks: [...state.blocks, newBlock],
    }))
  },

  // Mettre à jour un bloc
  updateBlock: (id, updates) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }))
  },

  // Supprimer un bloc
  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
      selectedBlockId:
        state.selectedBlockId === id ? null : state.selectedBlockId,
    }))
  },

  // Sélectionner un bloc
  selectBlock: (id) => {
    set({ selectedBlockId: id })
  },

  // Vider tous les blocs
  clearBlocks: () => {
    set({ blocks: [], selectedBlockId: null })
  },

  // Définir un agenda complet
  setAgenda: (agenda) => {
    set({
      agenda,
      blocks: agenda.blocks || [],
      selectedBlockId: null,
    })
  },

  // Mettre à jour le nom de l'agenda
  updateAgendaName: (name) => {
    set((state) => ({
      agenda: state.agenda ? { ...state.agenda, name } : null,
    }))
  },

  // Mettre à jour le layout
  updateAgendaLayout: (layout) => {
    set((state) => ({
      agenda: state.agenda ? { ...state.agenda, layout } : null,
    }))
  },

  // Mettre à jour le thème
  updateAgendaTheme: (theme) => {
    set((state) => ({
      agenda: state.agenda ? { ...state.agenda, theme } : null,
    }))
  },

  // Créer un nouvel agenda
  createNewAgenda: () => {
    const newAgenda: Agenda = {
      id: uuidv4(),
      name: 'Nouvel agenda',
      layout: 'weekly',
      theme: 'default',
      blocks: [],
      created_at: new Date().toISOString(),
    }
    set({
      agenda: newAgenda,
      blocks: [],
      selectedBlockId: null,
    })
  },
}))
