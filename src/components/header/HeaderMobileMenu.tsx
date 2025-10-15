// src/components/header/HeaderMobileMenu.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { usePlanLimits } from '@/contexts/PlanContext'
import UserAvatar from './UserAvatar'

interface HeaderMobileMenuProps {
  isAuthenticated: boolean
}

export default function HeaderMobileMenu({ isAuthenticated }: HeaderMobileMenuProps) {
  const pathname = usePathname()
  const { plan } = usePlanLimits()
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  // Fermer le menu avec Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeMenu])

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 hover:bg-gray-100 rounded-lg transition"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-black/30 z-40 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        >
          <div
            className="bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
            id="mobile-menu"
            role="navigation"
            aria-label="Menu de navigation"
          >
            <nav className="container mx-auto px-4 py-6 space-y-1">
              {/* Page Auth */}
              {pathname === '/auth' && (
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                >
                  Retour à l'accueil
                </Link>
              )}

              {/* Non authentifié */}
              {!isAuthenticated && pathname !== '/auth' && (
                <>
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                  >
                    Tarifs
                  </Link>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <Link
                      href="/auth"
                      onClick={closeMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                    >
                      Se connecter
                    </Link>
                    <Link href="/editor" onClick={closeMenu} className="block px-4 py-3">
                      <Button className="w-full justify-center" size="sm">
                        Créer un agenda
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              {/* Authentifié */}
              {isAuthenticated && pathname !== '/auth' && (
                <>
                  {/* Avatar avec menu dropdown */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <UserAvatar />
                    <span className="text-sm text-gray-600">Mon compte</span>
                  </div>

                  <div className="border-t border-gray-200 my-2" />

                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                  >
                    Mes agendas
                  </Link>
                  {plan !== 'pro' && (
                    <Link
                      href="/pricing"
                      onClick={closeMenu}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                    >
                      Tarifs
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
