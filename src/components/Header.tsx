// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { Button } from '@/components/ui'
import PlanBadge from '@/components/PlanBadge'

interface HeaderProps {
  variant?: 'default' | 'minimal' | 'editor'
  showPlanBadge?: boolean
  showAuth?: boolean
  customCenter?: React.ReactNode
  customActions?: React.ReactNode
}

export default function Header({
  variant = 'default',
  showPlanBadge = true,
  showAuth = true,
  customCenter,
  customActions,
}: HeaderProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { plan } = usePlanLimits()

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  // Logo commun à tous
  const Logo = (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition"
    >
      <div className="w-8 h-8 bg-[#0000EE] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold">P</span>
      </div>
      <span className="font-bold text-xl text-gray-900">Planningo</span>
    </Link>
  )

  // Actions par défaut (connecté)
  const DefaultActionsConnected = (
    <>
      {plan !== 'test' && (
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Mes agendas
          </Button>
        </Link>
      )}
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        Déconnexion
      </Button>
    </>
  )

  // Actions par défaut (non connecté)
  const DefaultActionsGuest = (
    <>
      <Link href="/auth">
        <Button variant="ghost" size="sm">
          Connexion
        </Button>
      </Link>
      <Link href="/auth">
        <Button size="sm">Créer un compte</Button>
      </Link>
    </>
  )

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Custom Center */}
          <div className="flex items-center gap-4">
            {Logo}
            {customCenter}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Plan Badge (si activé et utilisateur connecté) */}
            {showPlanBadge && user && (
              <PlanBadge
                showUpgrade={plan !== 'pro'}
                onUpgradeClick={handleUpgrade}
              />
            )}

            {/* Custom Actions OU Actions par défaut */}
            {customActions
              ? customActions
              : showAuth
              ? user
                ? DefaultActionsConnected
                : DefaultActionsGuest
              : null}
          </div>
        </div>
      </div>
    </header>
  )
}
