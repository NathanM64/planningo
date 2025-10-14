// src/components/header/HeaderNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlanLimits } from '@/hooks/usePlanLimits'

interface HeaderNavProps {
  isAuthenticated: boolean
}

export default function HeaderNav({ isAuthenticated }: HeaderNavProps) {
  const pathname = usePathname()
  const { plan } = usePlanLimits()

  // Ne pas afficher la navigation sur la page auth
  if (pathname === '/auth') {
    return null
  }

  return (
    <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
      {isAuthenticated && (
        <>
          <Link
            href="/dashboard"
            aria-current={pathname === '/dashboard' ? 'page' : undefined}
            className="relative text-gray-600 hover:text-gray-900 transition-colors font-medium
              after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0
              after:bg-[#0000EE] after:transition-all hover:after:w-full"
          >
            Mes agendas
          </Link>
          {plan !== 'pro' && (
            <Link
              href="/pricing"
              aria-current={pathname === '/pricing' ? 'page' : undefined}
              className="relative text-gray-600 hover:text-gray-900 transition-colors font-medium
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0
                after:bg-[#0000EE] after:transition-all hover:after:w-full"
            >
              Tarifs
            </Link>
          )}
        </>
      )}
      {!isAuthenticated && (
        <Link
          href="/pricing"
          aria-current={pathname === '/pricing' ? 'page' : undefined}
          className="relative text-gray-600 hover:text-gray-900 transition-colors font-medium
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0
            after:bg-[#0000EE] after:transition-all hover:after:w-full"
        >
          Tarifs
        </Link>
      )}
    </nav>
  )
}
