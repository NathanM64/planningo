'use client'

import { useState, useCallback } from 'react'
import { AgendaBlock } from '@/types/agenda'

interface ModalContext {
  memberId?: string
  date?: string
  period?: string
  blockToEdit?: AgendaBlock | null
}

export function useBlockModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContext, setModalContext] = useState<ModalContext>({})

  /**
   * Ouvrir la modal en mode création
   */
  const openCreateModal = useCallback((
    memberId: string,
    date: string,
    period?: string
  ) => {
    setModalContext({ memberId, date, period, blockToEdit: null })
    setIsModalOpen(true)
  }, [])

  /**
   * Ouvrir la modal en mode édition
   */
  const openEditModal = useCallback((block: AgendaBlock) => {
    setModalContext({ blockToEdit: block })
    setIsModalOpen(true)
  }, [])

  /**
   * Fermer la modal et réinitialiser le contexte
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    // Petit délai pour éviter le flash du contenu
    setTimeout(() => setModalContext({}), 150)
  }, [])

  return {
    isModalOpen,
    modalContext,
    openCreateModal,
    openEditModal,
    closeModal,
  }
}
