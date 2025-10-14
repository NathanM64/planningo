// src/components/header/HeaderActions.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui'
import UserAvatar from './UserAvatar'

interface HeaderActionsProps {
  isAuthenticated: boolean
}

export default function HeaderActions({ isAuthenticated }: HeaderActionsProps) {
  const pathname = usePathname()

  // Page auth: bouton retour uniquement
  if (pathname === '/auth') {
    return (
      <div className="hidden md:flex items-center">
        <Link href="/">
          <Button variant="ghost" size="sm">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    )
  }

  // Non authentifié
  if (!isAuthenticated) {
    return (
      <div className="hidden md:flex items-center gap-4">
        <Link href="/auth">
          <Button size="sm" variant="ghost">
            Se connecter
          </Button>
        </Link>
        <Link href="/editor">
          <Button size="sm">Créer un agenda</Button>
        </Link>
      </div>
    )
  }

  // Authentifié - Avatar avec dropdown
  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="h-8 w-px bg-[#0000EE]" aria-hidden="true" />
      <UserAvatar />
    </div>
  )
}
