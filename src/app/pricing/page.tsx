// src/app/pricing/page.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { PLANS } from '@/config/plans'
import { Button } from '@/components/ui'
import { Check, X, ArrowRight, Crown, Zap, TestTube } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { plan: currentPlan } = usePlanLimits()

  const handleSelectPlan = (planKey: 'test' | 'free' | 'pro') => {
    if (planKey === 'test') {
      router.push('/editor')
    } else if (planKey === 'free') {
      router.push(user ? '/editor' : '/auth')
    } else if (planKey === 'pro') {
      // TODO: Implémenter Stripe checkout
      alert('Paiement Stripe à venir ! 🚀')
    }
  }

  const plans = [
    {
      key: 'test' as const,
      icon: TestTube,
      highlight: false,
    },
    {
      key: 'free' as const,
      icon: Zap,
      highlight: false,
    },
    {
      key: 'pro' as const,
      icon: Crown,
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 bg-[#0000EE] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Planningo</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="outline" onClick={() => router.push('/editor')}>
                Mon éditeur
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push('/auth')}>
                  Connexion
                </Button>
                <Button onClick={() => router.push('/auth')}>
                  Créer un compte
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choisissez le plan qui vous convient
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Commencez gratuitement, évoluez quand vous le souhaitez. Aucune
            carte bancaire requise pour essayer.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map(({ key, icon: Icon, highlight }) => {
            const plan = PLANS[key]
            const isCurrent = currentPlan === key
            const isUpgrade =
              key === 'pro' &&
              (currentPlan === 'test' || currentPlan === 'free')

            return (
              <div
                key={key}
                className={`bg-white rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                  highlight
                    ? 'border-yellow-400 shadow-xl scale-105'
                    : isCurrent
                    ? 'border-blue-500'
                    : 'border-gray-200'
                }`}
              >
                {/* Badge */}
                {highlight && (
                  <div className="bg-yellow-400 text-center py-2 px-4">
                    <span className="text-sm font-bold text-gray-900">
                      ⭐ RECOMMANDÉ
                    </span>
                  </div>
                )}
                {isCurrent && !highlight && (
                  <div className="bg-blue-500 text-center py-2 px-4">
                    <span className="text-sm font-bold text-white">
                      ✓ PLAN ACTUEL
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        key === 'pro'
                          ? 'bg-yellow-100'
                          : key === 'free'
                          ? 'bg-blue-100'
                          : 'bg-orange-100'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          key === 'pro'
                            ? 'text-yellow-600'
                            : key === 'free'
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <div className="text-4xl font-bold text-gray-900">
                        Gratuit
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price}€
                        </span>
                        <span className="text-gray-600">/mois</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPlan(key)}
                    variant={
                      highlight
                        ? 'primary'
                        : isCurrent
                        ? 'outline'
                        : 'secondary'
                    }
                    className="w-full mb-6"
                    rightIcon={
                      !isCurrent ? (
                        <ArrowRight className="w-4 h-4" />
                      ) : undefined
                    }
                    disabled={isCurrent && !isUpgrade}
                  >
                    {isCurrent
                      ? 'Plan actuel'
                      : key === 'test'
                      ? 'Essayer maintenant'
                      : key === 'free'
                      ? 'Créer un compte'
                      : 'Passer en Pro'}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Limitations :
                      </p>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-500">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Puis-je essayer avant de créer un compte ?
              </h3>
              <p className="text-gray-600">
                Oui ! Le mode test vous permet de tester toutes les
                fonctionnalités immédiatement sans créer de compte. Vos données
                ne seront simplement pas sauvegardées.
              </p>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Puis-je changer de plan plus tard ?
              </h3>
              <p className="text-gray-600">
                Absolument ! Vous pouvez upgrader vers Pro à tout moment. Le
                passage de Test à Free est automatique lors de la création
                d&apos;un compte.
              </p>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Que se passe-t-il si j&apos;annule mon abonnement Pro ?
              </h3>
              <p className="text-gray-600">
                Vous conservez l&apos;accès Pro jusqu&apos;à la fin de la
                période payée, puis vous repassez automatiquement en plan Free.
                Vos données restent sauvegardées.
              </p>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">
                Y a-t-il des frais cachés ?
              </h3>
              <p className="text-gray-600">
                Non, aucun. Le prix affiché est le prix final. Pas de surprises,
                pas de frais additionnels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-[#0000EE] text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à simplifier vos plannings ?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d&apos;équipes qui utilisent déjà Planningo
            pour organiser leurs plannings.
          </p>
          <Button
            onClick={() => router.push('/editor')}
            size="lg"
            variant="secondary"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Commencer gratuitement
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 Planningo. Fait pour simplifier vos plannings.</p>
        </div>
      </footer>
    </div>
  )
}
