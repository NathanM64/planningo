'use client'

import { useEffect, useState } from 'react'
import { Toast, ToastProps } from './Toast'
import { toastService } from '@/lib/toastService'

export function GlobalToast() {
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null)

  useEffect(() => {
    const unsubscribe = toastService.subscribe((config) => {
      setToast(config)
    })

    return unsubscribe
  }, [])

  if (!toast) return null

  return <Toast {...toast} onClose={() => setToast(null)} />
}
