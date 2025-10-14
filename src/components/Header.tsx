// src/components/Header.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import HeaderLogo from './header/HeaderLogo'
import HeaderNav from './header/HeaderNav'
import HeaderActions from './header/HeaderActions'
import HeaderMobileMenu from './header/HeaderMobileMenu'

export default function Header() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Ne pas afficher le header sur la page success
  if (pathname === '/success') {
    return null
  }

  const isAuthenticated = !!user

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <HeaderLogo />

          <div className="flex items-center gap-6">
            <HeaderNav isAuthenticated={isAuthenticated} />
            <HeaderActions isAuthenticated={isAuthenticated} />
            <HeaderMobileMenu isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  )
}
