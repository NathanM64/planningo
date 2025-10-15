// src/app/page.tsx - Landing page
import Link from 'next/link'
import { Button } from '@/components/ui'
import {
  Calendar,
  Printer,
  Users,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Heart,
  Trophy,
  Home as HomeIcon,
  Palette,
  Star,
  CheckCircle2,
  Gift,
  Zap,
} from 'lucide-react'
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
  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Planningo',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '5',
      priceCurrency: 'EUR',
    },
    description:
      'Outil simple pour créer et imprimer des plannings hebdomadaires pour votre équipe',
    operatingSystem: 'Web',
    url: 'https://planningo.app',
    author: {
      '@type': 'Person',
      name: 'Nathan Marimbordes',
    },
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            L'outil simple et efficace pour créer des plannings personnalisés.
            Enseignants, associations, clubs sportifs, familles ou petites
            équipes : organisez vos emplois du temps en toute simplicité.
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

        {/* Use Cases Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Pour qui est fait Planningo ?
          </h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Que vous organisiez des cours, des bénévoles ou des activités,
            Planningo s'adapte à vos besoins.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/planning-enseignants"
              aria-label="En savoir plus sur les plannings pour enseignants"
            >
              <div className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="w-14 h-14 bg-[#0000EE]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0000EE] transition-colors">
                  <GraduationCap className="w-7 h-7 text-[#0000EE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Enseignants
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Emplois du temps, surveillance, permanences, réunions parents
                </p>
                <span className="text-[#0000EE] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              href="/planning-associations"
              aria-label="En savoir plus sur les plannings pour associations"
            >
              <div className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="w-14 h-14 bg-[#0000EE]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0000EE] transition-colors">
                  <Heart className="w-7 h-7 text-[#0000EE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Associations
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Planning bénévoles, événements, permanences, maraudes
                </p>
                <span className="text-[#0000EE] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              href="/planning-clubs-sportifs"
              aria-label="En savoir plus sur les plannings pour clubs sportifs"
            >
              <div className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="w-14 h-14 bg-[#0000EE]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0000EE] transition-colors">
                  <Trophy className="w-7 h-7 text-[#0000EE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Clubs sportifs
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Entraînements, matchs, disponibilités, tournois
                </p>
                <span className="text-[#0000EE] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              href="/planning-familles"
              aria-label="En savoir plus sur les plannings pour familles"
            >
              <div className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="w-14 h-14 bg-[#0000EE]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0000EE] transition-colors">
                  <HomeIcon className="w-7 h-7 text-[#0000EE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Familles
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Garde d'enfants, tâches ménagères, organisation hebdomadaire
                </p>
                <span className="text-[#0000EE] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              href="/planning-professionnels-sante"
              aria-label="En savoir plus sur les plannings pour professionnels de santé"
            >
              <div className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="w-14 h-14 bg-[#0000EE]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0000EE] transition-colors">
                  <Heart className="w-7 h-7 text-[#0000EE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Professionnels santé
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Roulement infirmières, gardes, astreintes, planning équipe
                </p>
                <span className="text-[#0000EE] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              href="/planning-centres-loisirs"
              aria-label="En savoir plus sur les plannings pour centres de loisirs"
            >
              <div className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="w-14 h-14 bg-[#0000EE]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0000EE] transition-colors">
                  <Palette className="w-7 h-7 text-[#0000EE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Centres de loisirs
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Activités, animateurs, sorties, planning journalier
                </p>
                <span className="text-[#0000EE] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tout ce dont vous avez besoin
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#0000EE] rounded-xl flex items-center justify-center mb-5 shadow-md shadow-[#0000EE]/20">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Création rapide
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Créez vos plannings hebdomadaires en quelques minutes. Interface
                intuitive et facile à prendre en main.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#10B981] rounded-xl flex items-center justify-center mb-5 shadow-md shadow-[#10B981]/20">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Multi-membres
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Gérez facilement les plannings de toute votre équipe. Assignez
                plusieurs membres sur un même créneau.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#F59E0B] rounded-xl flex items-center justify-center mb-5 shadow-md shadow-[#F59E0B]/20">
                <Printer className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Export PDF
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Imprimez vos plannings en un clic. Format optimisé pour
                l'impression et l'affichage.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Agendas Section */}
        <div className="max-w-4xl mx-auto mb-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 border border-blue-200">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full border border-blue-200">
              <Gift className="w-4 h-4 text-[#0000EE]" />
              <span className="text-[#0000EE] text-sm font-bold">
                Service gratuit
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Besoin d'un format spécifique ?
            </h3>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
              Votre agenda nécessite un format particulier ? Nous créons des
              modèles personnalisés gratuitement pour vous !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                <Button size="lg">Demander un agenda sur-mesure</Button>
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Planning scolaire, médical, événementiel... on s'occupe de tout !
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ils utilisent Planningo
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#0000EE]/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0000EE] to-[#0000EE]/70 rounded-full flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Marie L.</p>
                  <p className="text-sm text-gray-600">Enseignante</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "Enfin un outil simple pour organiser mes surveillances et
                  permanences. Je l'imprime et l'affiche en salle des profs !"
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#0000EE]/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0000EE] to-[#0000EE]/70 rounded-full flex items-center justify-center shadow-md">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Thomas B.</p>
                  <p className="text-sm text-gray-600">Président asso</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "Parfait pour gérer les bénévoles de notre association. Pas de
                  complexité, juste l'essentiel."
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-[#0000EE]/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0000EE] to-[#0000EE]/70 rounded-full flex items-center justify-center shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sophie D.</p>
                  <p className="text-sm text-gray-600">Coach sportif</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "J'organise les entraînements et matchs de 3 équipes. Très
                  pratique et rapide à mettre en place."
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#0000EE]">500+</span>{' '}
              plannings créés
            </p>
          </div>
        </div>

        {/* Pricing Comparison Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Des tarifs simples et transparents
          </h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Commencez gratuitement sans compte, puis passez Pro pour débloquer
            toutes les fonctionnalités.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Free</h4>
                <div className="text-4xl font-bold text-gray-900 mb-1">0€</div>
                <p className="text-gray-600 text-sm">Gratuit pour toujours</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Jusqu'à <strong>5 membres</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <strong>1 agenda</strong> sauvegardé
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Export PDF imprimable</span>
                </li>
                <li className="flex items-start gap-3 text-gray-500">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm">Petite marque sur le PDF</span>
                </li>
              </ul>

              <Link href="/editor" className="block">
                <Button variant="outline" className="w-full">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#0000EE] rounded-lg p-8 border-2 border-[#0000EE] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                POPULAIRE
              </div>

              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-white mb-2">Pro</h4>
                <div className="text-4xl font-bold text-white mb-1">5€</div>
                <p className="text-blue-200 text-sm">par mois</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <strong>Membres illimités</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <strong>Agendas illimités</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <strong>PDF sans marque</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Essai gratuit <strong>7 jours</strong>
                  </span>
                </li>
              </ul>

              <Link href="/pricing" className="block">
                <Button
                  variant="outline"
                  className="w-full bg-white text-[#0000EE] hover:bg-gray-100 border-white"
                >
                  Passer Pro
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Pas de frais cachés • Résiliez à tout moment • Paiement sécurisé
            par Stripe
          </p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Questions fréquentes
          </h3>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Dois-je créer un compte pour utiliser Planningo ?
              </h4>
              <p className="text-gray-600">
                Non ! Vous pouvez tester l'éditeur immédiatement sans compte ni
                inscription. Pour sauvegarder vos agendas, créez un compte
                gratuit en quelques secondes.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Puis-je partager mon planning avec mon équipe ?
              </h4>
              <p className="text-gray-600">
                Actuellement, vous pouvez exporter votre planning en PDF et le
                partager par email ou l'imprimer. Une fonction de partage en
                ligne arrive bientôt !
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Quelle est la différence entre Free et Pro ?
              </h4>
              <p className="text-gray-600">
                Le plan Free limite à 5 membres et 1 agenda, avec une petite
                marque sur le PDF. Le plan Pro (5€/mois) offre membres et
                agendas illimités, sans marque sur vos exports.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Proposez-vous des agendas personnalisés ?
              </h4>
              <p className="text-gray-600">
                Oui ! Si vous avez besoin d'un format spécifique non disponible,
                contactez-nous. Nous créons des agendas sur-mesure gratuitement
                pour nos utilisateurs.
              </p>
            </div>
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
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Planningo</h4>
              <p className="text-gray-600 text-sm">
                L'outil simple pour créer et imprimer vos plannings
                hebdomadaires.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Produit</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/editor"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Créer un planning
                  </Link>
                </li>
              </ul>
            </div>

            {/* Use Cases 1 */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Pour qui ?</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/planning-enseignants"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Enseignants
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planning-associations"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Associations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planning-clubs-sportifs"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Clubs sportifs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Use Cases 2 */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">
                &nbsp;
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/planning-professionnels-sante"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Professionnels santé
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planning-familles"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Familles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planning-centres-loisirs"
                    className="text-gray-600 hover:text-gray-900 text-sm transition"
                  >
                    Centres de loisirs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-sm text-center">
              © 2025 Planningo. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
