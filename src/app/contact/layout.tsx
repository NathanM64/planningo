// src/app/contact/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Planningo | Agendas personnalisés gratuits',
  description:
    "Besoin d'un agenda sur-mesure ? Contactez-nous pour créer votre planning personnalisé gratuitement. Planning scolaire, médical, événementiel et plus.",
  keywords: [
    'contact planningo',
    'agenda personnalisé',
    'planning sur-mesure',
    'demande agenda',
    'planning scolaire',
    'planning médical',
    'roulement infirmières',
  ],
  openGraph: {
    title: 'Contact - Demandez votre agenda personnalisé',
    description:
      'Nous créons des agendas sur-mesure gratuits pour tous nos utilisateurs.',
    type: 'website',
    url: 'https://planningo.app/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
