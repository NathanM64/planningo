import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PlanninGo</h1>
          </div>

          <nav className="hidden md:flex gap-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Fonctionnalités
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Tarifs
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-700 text-sm font-medium">
              ✨ Simplifiez la gestion de vos plannings
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Créez des agendas
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              imprimables
            </span>{' '}
            en quelques clics
          </h2>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            L'outil simple et intuitif pour créer des plannings personnalisés
            pour votre équipe. Sans complexité, juste l'essentiel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/editor"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Créer mon agenda gratuitement
            </Link>

            <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
              Voir un exemple
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Simple et intuitif
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Créez votre planning en quelques minutes avec notre interface drag
              & drop.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🖨️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Impression optimisée
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Exportez vos agendas en PDF format A4, prêts à imprimer.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Pour les équipes
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Partagez vos plannings avec votre équipe en un clic.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt à simplifier vos plannings ?
          </h3>
          <p className="text-blue-100 text-lg mb-8">
            Commencez gratuitement, aucune carte bancaire requise.
          </p>
          <Link
            href="/editor"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Créer mon premier agenda
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>© 2025 Planningo. Fait avec ❤️ pour simplifier vos plannings.</p>
        </footer>
      </div>
    </main>
  )
}
