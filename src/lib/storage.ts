/**
 * Adapter de stockage selon le plan utilisateur
 * En mode test : aucune persistence (tout en mémoire)
 * En mode free/pro : localStorage ou Supabase
 */

import type { PlanKey } from '@/config/plans'

interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

/**
 * Storage qui ne persiste rien (mode test)
 */
const noOpStorage: StorageAdapter = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}

/**
 * Storage avec localStorage (mode free/pro en local)
 */
const localStorageAdapter: StorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
  clear: () => {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}

/**
 * Obtenir l'adapter de storage selon le plan
 */
export function getStorage(plan: PlanKey): StorageAdapter {
  if (plan === 'test') {
    return noOpStorage
  }
  return localStorageAdapter
}

/**
 * Hook pour utiliser le storage adapté au plan
 */
export function useStorage(plan: PlanKey) {
  const storage = getStorage(plan)

  return {
    get: (key: string): unknown => {
      const value = storage.getItem(key)
      if (!value) return null
      try {
        return JSON.parse(value) as unknown
      } catch {
        return value
      }
    },
    set: (key: string, value: unknown) => {
      storage.setItem(key, JSON.stringify(value))
    },
    remove: (key: string) => {
      storage.removeItem(key)
    },
    clear: () => {
      storage.clear()
    },
  }
}
