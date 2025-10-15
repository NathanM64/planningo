// src/app/planning-familles/page.tsx
import { Metadata } from 'next'
import PersonaPage from '@/components/PersonaPage'

export const metadata: Metadata = {
  title: 'Planning Familial - Garde enfants et tâches ménagères | Planningo',
  description:
    'Outil gratuit pour organiser garde d\'enfants, tâches ménagères et activités famille. Planning hebdomadaire simple et visuel.',
  keywords: [
    'planning garde enfants',
    'planning famille hebdomadaire',
    'planning tâches ménagères',
    'organisation familiale planning',
    'planning garde partagée',
    'agenda famille semaine',
    'planning activités enfants',
  ],
  openGraph: {
    title:
      'Planning Familial - Garde enfants et tâches ménagères | Planningo',
    description:
      'Outil gratuit pour organiser garde d\'enfants, tâches ménagères et activités famille.',
    type: 'website',
    url: 'https://planningo.app/planning-familles',
  },
}

export default function PlanningFamillesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Planning pour familles',
    description:
      'Outil gratuit pour organiser garde enfants, tâches ménagères et activités familiales',
    url: 'https://planningo.app/planning-familles',
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
        h1="Planning familial : organisez votre semaine en famille sereinement"
        hero="Gérer la garde des enfants, les tâches ménagères et les activités extra-scolaires devient un jeu d'enfant. Planningo est l'outil gratuit pour les familles qui veulent s'organiser sans stress. Créez votre planning hebdomadaire en 5 minutes et libérez votre charge mentale."
        painPoints={[
          {
            title: 'Charge mentale écrasante',
            description:
              'Qui emmène qui au foot mercredi ? Qui fait les courses samedi ? Stop aux Post-it sur le frigo, centralisez tout dans un planning familial visuel.',
          },
          {
            title: 'Garde alternée complexe',
            description:
              'Semaine chez papa, weekend chez maman, activités chez papi... Visualisez facilement la répartition de la garde et évitez les oublis.',
          },
          {
            title: 'Tâches ménagères inégales',
            description:
              'Répartissez équitablement les corvées entre adultes et enfants. Planning clair = moins de disputes sur \'qui fait quoi\' à la maison.',
          },
        ]}
        solutions={[
          {
            title: 'Planning pour toute la famille',
            description:
              'Ajoutez jusqu\'à 5 membres gratuitement (parents, enfants, grands-parents...). Chaque membre a sa couleur pour une lecture ultra-rapide.',
          },
          {
            title: 'Organisation hebdomadaire simple',
            description:
              'Planifiez la semaine en un coup d\'œil : garde enfants, activités extra-scolaires, tâches ménagères, rendez-vous médicaux, courses...',
          },
          {
            title: 'Impression et partage',
            description:
              'Imprimez le planning et affichez-le sur le frigo ou dans l\'entrée. Exportez-le en PDF pour l\'envoyer aux grands-parents ou à la nounou.',
          },
        ]}
        useCases={[
          {
            title: 'Garde alternée et coparentalité',
            description:
              'Organisez la garde des enfants entre deux foyers : semaines, weekends, vacances scolaires. Évitez les oublis et les tensions grâce à un planning partagé.',
          },
          {
            title: 'Répartition tâches ménagères',
            description:
              'Créez un planning des corvées : courses, ménage, cuisine, poubelles. Impliquez les enfants et répartissez équitablement les responsabilités.',
          },
          {
            title: 'Activités enfants et sorties',
            description:
              'Planifiez les activités extra-scolaires (foot, danse, soutien scolaire) et sorties familiales. Notez qui emmène et récupère les enfants chaque jour.',
          },
        ]}
        faq={[
          {
            question: 'Planningo convient-il aux familles recomposées ?',
            answer:
              'Absolument ! Ajoutez jusqu\'à 5 membres (beaux-parents, demi-frères/sœurs...). Créez des plannings différents pour chaque configuration familiale si besoin (1 gratuit, illimité en Pro).',
          },
          {
            question:
              'Puis-je impliquer mes enfants dans la gestion du planning ?',
            answer:
              'Oui ! Le planning visuel et coloré est parfait pour responsabiliser les enfants. Imprimez-le, laissez-les cocher leurs tâches accomplies avec un feutre.',
          },
          {
            question:
              'Comment gérer les imprévus et changements de dernière minute ?',
            answer:
              'Modifiez votre planning en temps réel depuis votre smartphone, tablette ou ordinateur. Réimprimez la nouvelle version et remplacez celle du frigo en 2 minutes.',
          },
        ]}
      />
    </>
  )
}
