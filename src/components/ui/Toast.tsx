'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export interface ToastProps {
  type: 'success' | 'error' | 'info'
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const styles = {
    success: {
      container: 'bg-green-50 border-green-500 text-green-900',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    error: {
      container: 'bg-red-50 border-red-500 text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-500 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
  }

  const style = styles[type]

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`fixed bottom-4 right-4 z-50 flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg max-w-md animate-in slide-in-from-bottom-5 ${style.container}`}
    >
      {style.icon}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        aria-label="Fermer la notification"
        className="text-current hover:opacity-70 transition flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
