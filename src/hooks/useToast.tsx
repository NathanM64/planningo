'use client'

import { useState, useCallback } from 'react'
import { Toast, ToastProps } from '@/components/ui/Toast'

type ToastType = ToastProps['type']

interface ToastConfig {
  type: ToastType
  message: string
  duration?: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastConfig | null>(null)

  const showToast = useCallback((config: ToastConfig) => {
    setToast(config)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const ToastContainer = useCallback(() => {
    if (!toast) return null

    return (
      <Toast
        type={toast.type}
        message={toast.message}
        duration={toast.duration}
        onClose={hideToast}
      />
    )
  }, [toast, hideToast])

  return {
    showToast,
    hideToast,
    ToastContainer,
  }
}
