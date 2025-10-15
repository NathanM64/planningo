// src/components/PersonaPage.tsx
import Link from 'next/link'
import { Button } from '@/components/ui'
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Lightbulb,
} from 'lucide-react'

interface PainPoint {
  title: string
  description: string
}

interface Solution {
  title: string
  description: string
}

interface UseCase {
  title: string
  description: string
}

interface FAQ {
  question: string
  answer: string
}

interface PersonaPageProps {
  h1: string
  hero: string
  painPoints: PainPoint[]
  solutions: Solution[]
  useCases: UseCase[]
  faq: FAQ[]
}

export default function PersonaPage({
  h1,
  hero,
  painPoints,
  solutions,
  useCases,
  faq,
}: PersonaPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {h1}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            {hero}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/editor">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Créer mon planning gratuitement
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Demander un agenda sur-mesure
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Gratuit sans inscription • Mode test disponible
          </p>
        </div>

        {/* Pain Points Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Les défis que vous rencontrez
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {painPoints.map((pain, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-red-200 transition-all"
              >
                <div className="w-12 h-12 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {pain.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pain.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Comment Planningo vous simplifie la vie
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Un outil pensé pour vos besoins spécifiques
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE] hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {solution.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Cas d'usage concrets
          </h2>

          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0000EE]/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0000EE]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Lightbulb className="w-5 h-5 text-[#0000EE]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-6">
            {faq.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <HelpCircle className="w-5 h-5 text-[#0000EE] flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.question}
                  </h3>
                </div>
                <p className="text-gray-600 pl-8">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto bg-[#0000EE] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à simplifier votre organisation ?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Créez votre premier planning en 5 minutes, sans inscription.
          </p>
          <Link href="/editor">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-[#0000EE] hover:bg-gray-100"
            >
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
