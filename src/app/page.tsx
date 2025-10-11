import Link from 'next/link'
import { Button } from '@/components/ui'
import { Calendar, Printer, Users, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0000EE] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Planningo</h1>
          </div>

          <nav className="hidden md:flex gap-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Fonctionnalités
            </a>
            <a
              href="/demo"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Design System
            </a>
          </nav>
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
            L'outil simple et efficace pour créer des plannings personnalisés
            pour votre équipe. Sans complexité, juste l'essentiel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/editor">
              <Button size="lg" leftIcon={<Calendar className="w-5 h-5" />}>
                Créer mon agenda gratuitement
              </Button>
            </Link>

            <Link href="/demo">
              <Button variant="outline" size="lg">
                Voir un exemple
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Simple et intuitif
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Créez votre planning en quelques minutes avec notre interface
              claire et efficace.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
              <Printer className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Impression optimisée
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Exportez vos agendas en PDF format A4, prêts à imprimer en couleur
              ou noir & blanc.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Pour les équipes
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Organisez et partagez vos plannings avec votre équipe facilement.
            </p>
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
          <p>© 2025 Planningo. Fait pour simplifier vos plannings.</p>
        </footer>
      </div>
    </main>
  )
}
