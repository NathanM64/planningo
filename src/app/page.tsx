// src/app/page.tsx
import Link from 'next/link'
import Header from '@/components/Header'
import { Button } from '@/components/ui'
import { Calendar, Printer, Users, ArrowRight, Sparkles } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planningo - Créez des agendas imprimables en quelques clics',
  description:
    'Outil simple pour créer et imprimer des plannings hebdomadaires. Gérez facilement les emplois du temps de votre équipe. Gratuit sans inscription.',
  keywords: [
    'planning',
    'agenda',
    'emploi du temps',
    'planning équipe',
    'planning hebdomadaire',
    'planning imprimable',
    'PDF planning',
  ],
  openGraph: {
    title: 'Planningo - Créez des agendas imprimables en quelques clics',
    description:
      'Outil simple pour créer et imprimer des plannings hebdomadaires pour votre équipe.',
    type: 'website',
    url: 'https://planningo.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planningo - Créez des agendas imprimables',
    description:
      'Outil simple pour créer et imprimer des plannings hebdomadaires.',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header unifié */}
      <Header
        showPlanBadge={false}
        customActions={
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
            <Link href="/editor">
              <Button size="sm">Commencer</Button>
            </Link>
          </nav>
        }
      />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-[#0000EE] text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Simplifiez la gestion de vos plannings
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Créez des agendas
            <br />
            imprimables en quelques clics
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            L'outil simple et efficace pour créer des plannings personnalisés
            pour votre équipe. Sans complexité, juste l'essentiel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/editor">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Créer mon premier agenda
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Voir les tarifs
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Pas de carte bancaire requise • Mode test disponible
          </p>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tout ce dont vous avez besoin
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[#0000EE]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Création rapide
              </h4>
              <p className="text-gray-600">
                Créez vos plannings hebdomadaires en quelques minutes. Interface
                intuitive et facile à prendre en main.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border-2 border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#10B981]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Multi-membres
              </h4>
              <p className="text-gray-600">
                Gérez facilement les plannings de toute votre équipe. Assignez
                plusieurs membres sur un même créneau.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border-2 border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Printer className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Export PDF
              </h4>
              <p className="text-gray-600">
                Imprimez vos plannings en un clic. Format optimisé pour
                l'impression et l'affichage.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Preview Section */}
        <div className="max-w-4xl mx-auto mb-20 bg-white rounded-lg p-12 border-2 border-gray-200 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Des tarifs simples et transparents
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Testez gratuitement sans limite de temps, puis choisissez le plan
            adapté à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Voir tous les plans
              </Button>
            </Link>
            <Link href="/editor">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-[#0000EE] rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Prêt à simplifier vos plannings ?
          </h3>
          <p className="text-lg mb-8 text-blue-100">
            Commencez gratuitement, aucune inscription requise.
          </p>
          <Link href="/editor">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-[#0000EE] hover:bg-gray-100"
            >
              Créer mon premier agenda
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 Planningo. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 text-sm transition"
              >
                Tarifs
              </Link>
              <a
                href="mailto:marimbordes.nathan@gmail.com"
                className="text-gray-600 hover:text-gray-900 text-sm transition"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
