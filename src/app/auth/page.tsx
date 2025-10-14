'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { LogIn, UserPlus } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } =
        mode === 'signin'
          ? await signIn(email, password)
          : await signUp(email, password, firstName, lastName)

      if (error) {
        setError(error.message)
      } else {
        if (mode === 'signup') {
          setError('Vérifiez votre email pour confirmer votre inscription !')
        } else {
          router.push('/dashboard')
        }
      }
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo - Supprimé car déjà dans le header */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {mode === 'signin'
                ? 'Connectez-vous à votre compte'
                : 'Créez votre compte gratuit'}
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="Prénom"
                    placeholder="Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                  />
                  <Input
                    type="text"
                    label="Nom"
                    placeholder="Dupont"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                  />
                </div>
              )}

              <Input
                type="email"
                label="Email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                helperText={
                  mode === 'signup' ? 'Minimum 6 caractères' : undefined
                }
              />

              {error && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    error.includes('Vérifiez')
                      ? 'bg-green-50 text-green-700 border-2 border-green-200'
                      : 'bg-red-50 text-red-700 border-2 border-red-200'
                  }`}
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                leftIcon={
                  mode === 'signin' ? (
                    <LogIn className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )
                }
              >
                {loading
                  ? 'Chargement...'
                  : mode === 'signin'
                  ? 'Se connecter'
                  : 'Créer mon compte'}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              {mode === 'signin' ? (
                <>
                  <p className="text-gray-600">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup')
                        setError('')
                      }}
                      className="text-[#0000EE] font-semibold hover:underline"
                    >
                      Créer un compte
                    </button>
                  </p>
                  <p className="text-gray-600">
                    <Link
                      href="/auth/reset-password"
                      className="text-[#0000EE] font-semibold hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </p>
                </>
              ) : (
                <p className="text-gray-600">
                  Déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      setError('')
                    }}
                    className="text-[#0000EE] font-semibold hover:underline"
                  >
                    Se connecter
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
