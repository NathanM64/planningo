// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { Button } from '@/components/ui'
import PlanBadge from '@/components/PlanBadge'
import { Menu, X, Home, LayoutDashboard, Printer, Save, LogOut } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  // Pour l'editor: permettre de passer le nom de l'agenda et les actions
  agendaName?: string
  onAgendaNameChange?: (name: string) => void
  onPrint?: () => void
  onSave?: () => void
  isSaving?: boolean
  // Pour masquer completement les actions par defaut
  hideDefaultActions?: boolean
}

export default function Header({
  agendaName,
  onAgendaNameChange,
  onPrint,
  onSave,
  isSaving,
  hideDefaultActions = false,
}: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { plan, isTest } = usePlanLimits()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleUpgrade = () => {
    router.push(isTest ? '/auth' : '/pricing')
  }

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
    router.push('/')
  }

  // Determiner le contexte de la page
  const isLanding = pathname === '/'
  const isDashboard = pathname === '/dashboard'
  const isEditor = pathname === '/editor'
  const isPricing = pathname === '/pricing'
  const isAuth = pathname === '/auth'

  // Logo avec breadcrumb
  const LogoSection = () => (
    <div className="flex items-center gap-2">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition"
        aria-label="Retour à l'accueil"
      >
        <div className="w-8 h-8 bg-[#0000EE] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">P</span>
        </div>
        <span className="font-bold text-xl text-gray-900">Planningo</span>
      </Link>

      {/* Breadcrumb */}
      {(isDashboard || isEditor) && (
        <>
          <span className="text-gray-400 hidden sm:inline">/</span>
          <span className="text-gray-600 font-semibold hidden sm:inline">
            {isDashboard ? 'Dashboard' : 'Editeur'}
          </span>
        </>
      )}

      {/* Input nom agenda (uniquement editor) */}
      {isEditor && agendaName !== undefined && onAgendaNameChange && (
        <>
          <span className="text-gray-400 hidden sm:inline">/</span>
          <label htmlFor="agenda-name-header" className="sr-only">
            Nom de l'agenda
          </label>
          <input
            id="agenda-name-header"
            type="text"
            value={agendaName}
            onChange={(e) => onAgendaNameChange(e.target.value)}
            className="font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none transition px-2 py-1 w-32 sm:w-48"
            placeholder="Nom de l'agenda"
            aria-label="Nom de l'agenda"
          />
        </>
      )}
    </div>
  )

  // Actions selon le contexte
  const renderActions = () => {
    if (hideDefaultActions) return null

    // AUTH PAGE: Seulement bouton retour
    if (isAuth) {
      return (
        <Link href="/">
          <Button variant="ghost" size="sm" leftIcon={<Home className="w-4 h-4" />}>
            Retour
          </Button>
        </Link>
      )
    }

    // LANDING PAGE
    if (isLanding) {
      return (
        <>
          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Fonctionnalités
            </a>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Tarifs
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {plan !== 'pro' && (
                  <PlanBadge showUpgrade onUpgradeClick={handleUpgrade} />
                )}
                <Link href="/dashboard">
                  <Button size="sm" variant="ghost">
                    Dashboard
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleSignOut}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/editor">
                  <Button size="sm">Commencer</Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" variant="ghost">
                    Connexion
                  </Button>
                </Link>
              </>
            )}
          </div>
        </>
      )
    }

    // PRICING PAGE
    if (isPricing) {
      return (
        <div className="flex items-center gap-3">
          {user && plan !== 'pro' && (
            <PlanBadge showUpgrade={false} />
          )}
          {user ? (
            <>
              <Link href="/dashboard">
                <Button size="sm" variant="ghost">
                  Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/">
                <Button size="sm" variant="ghost">
                  Retour au site
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" variant="ghost">
                  Connexion
                </Button>
              </Link>
            </>
          )}
        </div>
      )
    }

    // DASHBOARD
    if (isDashboard) {
      return (
        <>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {plan !== 'pro' && (
              <PlanBadge showUpgrade onUpgradeClick={handleUpgrade} />
            )}
            <Link href="/editor">
              <Button size="sm" variant="outline">
                Nouvel agenda
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={handleSignOut}>
              Déconnexion
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </>
      )
    }

    // EDITOR
    if (isEditor) {
      return (
        <>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <PlanBadge
              showUpgrade={plan !== 'pro'}
              onUpgradeClick={handleUpgrade}
            />
            {!isTest && user && (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<LayoutDashboard className="w-4 h-4" />}
                >
                  Dashboard
                </Button>
              </Link>
            )}
            {onPrint && (
              <Button
                size="sm"
                variant="outline"
                onClick={onPrint}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Imprimer
              </Button>
            )}
            {onSave && (
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isSaving ? 'Sauvegarde...' : isTest ? 'Se connecter' : 'Enregistrer'}
              </Button>
            )}
            {!isTest && user && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSignOut}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Déconnexion
              </Button>
            )}
          </div>

          {/* Mobile: Actions essentielles + menu */}
          <div className="flex md:hidden items-center gap-2">
            <PlanBadge
              showUpgrade={plan !== 'pro'}
              onUpgradeClick={handleUpgrade}
            />
            {onSave && (
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? '...' : isTest ? 'Connexion' : 'Save'}
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </>
      )
    }

    return null
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <LogoSection />
            {renderActions()}
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (isDashboard || isEditor) && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white border-b border-gray-200 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {isEditor && onPrint && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onPrint()
                    setMobileMenuOpen(false)
                  }}
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Imprimer
                </Button>
              )}
              {!isTest && user && (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    leftIcon={<LayoutDashboard className="w-4 h-4" />}
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              {isDashboard && (
                <Link href="/editor" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    Nouvel agenda
                  </Button>
                </Link>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Déconnexion
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
