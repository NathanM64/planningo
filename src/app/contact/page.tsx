// src/app/contact/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import Image from 'next/image'
import { ArrowLeft, Send, Upload, X } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'custom-agenda',
    message: '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement actual email sending (using Resend API or similar)
    // For now, simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg p-8 border-2 border-green-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Message envoyé !
          </h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre demande. Nous vous répondrons sous 48h avec votre
            agenda personnalisé.
          </p>
          <Link href="/">
            <Button className="w-full">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600">
              Une question ? Besoin d'un agenda personnalisé ? Nous sommes là
              pour vous aider.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg p-8 border-2 border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0000EE] focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0000EE] focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Sujet <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0000EE] focus:border-transparent bg-white"
                >
                  <option value="custom-agenda">
                    Demande d'agenda sur-mesure
                  </option>
                  <option value="question">Question générale</option>
                  <option value="bug">Signaler un bug</option>
                  <option value="feature">Suggestion de fonctionnalité</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0000EE] focus:border-transparent resize-none"
                  placeholder="Décrivez votre besoin en détail (format souhaité, nombre de jours, créneaux horaires, etc.)"
                />
              </div>

              {/* Image Upload (optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Exemple d'agenda (facultatif)
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Vous avez un exemple d'agenda existant ? Partagez-le pour
                  nous aider à mieux comprendre votre besoin.
                </p>

                {!imagePreview ? (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0000EE] transition bg-gray-50"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Cliquez pour télécharger une image
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG jusqu'à 5MB
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-48">
                    <Image
                      src={imagePreview}
                      alt="Aperçu de l'agenda"
                      fill
                      className="object-contain border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition z-10"
                      aria-label="Supprimer l'image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                rightIcon={<Send className="w-5 h-5" />}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Nous vous répondrons sous 48h ouvrées.
              </p>
            </form>
          </div>

          {/* Additional info */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              💡 Agendas sur-mesure gratuits
            </h3>
            <p className="text-gray-700 mb-3">
              Nous créons des formats personnalisés pour tous nos utilisateurs,
              gratuitement. Exemples :
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#0000EE] mt-1">•</span>
                <span>
                  <strong>Planning scolaire :</strong> emploi du temps par
                  matières, surveillance, permanences
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0000EE] mt-1">•</span>
                <span>
                  <strong>Roulement infirmières :</strong> planning 24/7,
                  gardes de nuit, astreintes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0000EE] mt-1">•</span>
                <span>
                  <strong>Planning événementiel :</strong> multi-jours,
                  multi-lieux, bénévoles
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
