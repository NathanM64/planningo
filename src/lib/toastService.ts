// Service global pour afficher des toasts depuis n'importe où (même hors composants React)

type ToastType = 'success' | 'error' | 'info'

interface ToastConfig {
  type: ToastType
  message: string
  duration?: number
}

type ToastListener = (config: ToastConfig) => void

class ToastService {
  private listeners: Set<ToastListener> = new Set()

  subscribe(listener: ToastListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  show(config: ToastConfig) {
    this.listeners.forEach((listener) => listener(config))
  }

  success(message: string, duration?: number) {
    this.show({ type: 'success', message, duration })
  }

  error(message: string, duration?: number) {
    this.show({ type: 'error', message, duration })
  }

  info(message: string, duration?: number) {
    this.show({ type: 'info', message, duration })
  }
}

export const toastService = new ToastService()
