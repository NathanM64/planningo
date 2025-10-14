'use client'

import { useState, useCallback } from 'react'
import { ConfirmDialog, ConfirmDialogProps } from '@/components/ui/ConfirmDialog'

interface ConfirmConfig {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
}

export function useConfirm() {
  const [config, setConfig] = useState<ConfirmConfig | null>(null)

  const confirm = useCallback((newConfig: ConfirmConfig) => {
    setConfig(newConfig)
  }, [])

  const handleCancel = useCallback(() => {
    setConfig(null)
  }, [])

  const ConfirmContainer = useCallback(() => {
    if (!config) return null

    return (
      <ConfirmDialog
        isOpen={true}
        title={config.title}
        message={config.message}
        confirmLabel={config.confirmLabel}
        cancelLabel={config.cancelLabel}
        variant={config.variant}
        onConfirm={config.onConfirm}
        onCancel={handleCancel}
      />
    )
  }, [config, handleCancel])

  return {
    confirm,
    ConfirmContainer,
  }
}
