// src/components/header/UserAvatar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanLimits } from '@/contexts/PlanContext'
import PlanBadge from '@/components/PlanBadge'

export default function UserAvatar() {
  const { user, signOut } = useAuth()
  const { plan } = usePlanLimits()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer dropdown si click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  if (!user) return null

  // Générer initiale (fallback email)
  const initial = (user.email?.[0] || '?').toUpperCase()

  // Couleur selon plan
  const avatarColors = {
    test: 'bg-orange-500',
    free: 'bg-blue-600',
    pro: 'bg-yellow-500',
  }

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut()
    // Pas besoin de router.push car signOut() redirige déjà
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          text-white font-semibold text-sm uppercase
          hover:ring-2 hover:ring-blue-400 transition-all
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
          ${avatarColors[plan]}
        `}
        aria-label="Menu utilisateur"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {initial}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Section 1 : Email + Badge Plan */}
          <div className="px-4 py-2">
            {/* Email */}
            <div className="text-sm font-medium text-gray-900 truncate mb-2">
              {user.email}
            </div>
            {/* Badge Plan */}
            <div>
              <PlanBadge />
            </div>
          </div>

          <div className="border-t border-gray-200 my-1" />

          {/* Section 2 : Liens importants */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/dashboard')
              }}
              className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              role="menuitem"
            >
              Mes agendas
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/pricing')
              }}
              className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              role="menuitem"
            >
              Tarifs
            </button>
          </div>

          <div className="border-t border-gray-200 my-1" />

          {/* Section 3 : Déconnexion */}
          <div className="py-1">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition flex items-center gap-2"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
