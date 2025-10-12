// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Calendar, Printer, Users, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-[#0000EE] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Planningo</h1>
          </Link>

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

          {/* Mobile menu */}
          <div className="md:hidden">
            <Link href="/editor">
              <Button size="sm">Commencer</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-[#0000EE] text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Simplifiez la gestion de vos plannings
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Créez des agendas
            <br />
            imprimables en quelques clics
          </h2>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            L&apos;outil simple et efficace pour créer des plannings
            personnalisés pour votre équipe. Sans complexité, juste
            l&apos;essentiel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/editor">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Essayer gratuitement
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
                l&apos;impression et l&apos;affichage.
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
        <div className="bg-[#0000EE] rounded-lg p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt à simplifier vos plannings ?
          </h3>
          <p className="text-blue-100 text-lg mb-8">
            Commencez gratuitement, aucune carte bancaire requise.
          </p>
          <Link href="/editor">
            <Button
              size="lg"
              variant="secondary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Créer mon premier agenda
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-600">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-4">
            <Link href="/pricing" className="hover:text-gray-900 transition">
              Tarifs
            </Link>
            <Link href="/editor" className="hover:text-gray-900 transition">
              Éditeur
            </Link>
            <Link href="/auth" className="hover:text-gray-900 transition">
              Connexion
            </Link>
          </div>
          <p>© 2025 Planningo. Fait pour simplifier vos plannings.</p>
        </footer>
      </div>
    </main>
  )
}
