// src/app/planning-associations/page.tsx
import { Metadata } from 'next'
import PersonaPage from '@/components/PersonaPage'

export const metadata: Metadata = {
  title: 'Planning Associations - Gérer bénévoles et événements | Planningo',
  description:
    'Outil gratuit pour organiser vos bénévoles, permanences et maraudes. Planning associatif simple, collaboratif et imprimable.',
  keywords: [
    'planning association bénévoles',
    'planning maraude gratuit',
    'agenda permanence association',
    'planning événement associatif',
    'gestion bénévoles planning',
    'planning rotations bénévoles',
    'outil planning association gratuit',
  ],
  openGraph: {
    title: 'Planning Associations - Gérer bénévoles et événements | Planningo',
    description:
      'Outil gratuit pour organiser vos bénévoles, permanences et maraudes.',
    type: 'website',
    url: 'https://planningo.app/planning-associations',
  },
}

export default function PlanningAssociationsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Planning pour associations',
    description:
      'Outil gratuit pour gérer bénévoles, permanences et événements associatifs',
    url: 'https://planningo.app/planning-associations',
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'Planningo',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PersonaPage
        h1="Planning pour associations : organisez vos bénévoles efficacement"
        hero="Coordonner des bénévoles est un casse-tête ? Plus maintenant. Planningo simplifie la gestion des permanences, maraudes et événements associatifs. Créez des plannings clairs en 5 minutes et mobilisez votre équipe sans stress."
        painPoints={[
          {
            title: 'Bénévoles difficiles à coordonner',
            description:
              'Messages WhatsApp perdus, SMS non lus, disponibilités floues... Centralisez toutes les informations dans un planning visuel unique.',
          },
          {
            title: 'Créneaux non couverts',
            description:
              'Repérez instantanément les trous dans votre planning de permanences ou maraudes. Relancez les bénévoles manquants en un coup d\'œil.',
          },
          {
            title: 'Outils complexes et payants',
            description:
              'Les logiciels de gestion d\'équipe sont trop chers et trop compliqués pour une petite asso. Planningo est gratuit et ultra-simple à prendre en main.',
          },
        ]}
        solutions={[
          {
            title: 'Planification collaborative',
            description:
              'Ajoutez jusqu\'à 5 bénévoles gratuitement (illimité en Pro). Assignez plusieurs personnes par créneau pour les événements nécessitant du renfort.',
          },
          {
            title: 'Visualisation instantanée',
            description:
              'Planning hebdomadaire coloré par bénévole. Identifiez en 3 secondes qui est disponible mardi matin ou samedi après-midi.',
          },
          {
            title: 'Partage simplifié',
            description:
              'Exportez le planning en PDF et envoyez-le par email à toute l\'équipe. Imprimez-le pour l\'afficher dans vos locaux ou lors d\'événements.',
          },
        ]}
        useCases={[
          {
            title: 'Planning maraudes sociales',
            description:
              'Organisez les tournées nocturnes de votre association caritative. Planifiez les binômes, les horaires et les secteurs couverts chaque soir.',
          },
          {
            title: 'Permanences locales associatives',
            description:
              'Gérez l\'ouverture de votre local associatif : accueil, permanence administrative, distribution alimentaire. Plus jamais de local fermé faute de bénévole.',
          },
          {
            title: 'Événements et festivals',
            description:
              'Planifiez les rotations de bénévoles sur un stand, une buvette ou un point information lors de festivals, salons ou événements sportifs.',
          },
        ]}
        faq={[
          {
            question: 'Combien de bénévoles puis-je gérer gratuitement ?',
            answer:
              'Jusqu\'à 5 bénévoles avec le plan gratuit, ce qui suffit pour la plupart des petites associations. Passez au plan Pro (5€/mois) pour gérer une équipe illimitée.',
          },
          {
            question:
              'Puis-je gérer plusieurs activités sur un même planning ?',
            answer:
              'Oui ! Créez des blocs de différentes couleurs pour distinguer permanences, maraudes, événements, etc. Chaque bénévole a sa propre couleur pour une lecture rapide.',
          },
          {
            question: 'Le planning est-il accessible sur mobile ?',
            answer:
              'Planningo fonctionne sur tous les navigateurs (ordinateur, tablette, smartphone). Créez et consultez vos plannings n\'importe où, même sur le terrain.',
          },
        ]}
      />
    </>
  )
}
