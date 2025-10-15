// src/app/planning-clubs-sportifs/page.tsx
import { Metadata } from 'next'
import PersonaPage from '@/components/PersonaPage'

export const metadata: Metadata = {
  title: 'Planning Club Sportif - Entraînements et matchs | Planningo',
  description:
    'Outil gratuit pour gérer entraînements, matchs et disponibilités. Planning sportif simple pour clubs, coachs et éducateurs.',
  keywords: [
    'planning club sportif',
    'planning entraînement football',
    'agenda coach sportif',
    'planning matchs équipe',
    'planning disponibilités joueurs',
    'planning tournoi sportif',
    'outil planning club gratuit',
  ],
  openGraph: {
    title: 'Planning Club Sportif - Entraînements et matchs | Planningo',
    description:
      'Outil gratuit pour gérer entraînements, matchs et disponibilités.',
    type: 'website',
    url: 'https://planningo.app/planning-clubs-sportifs',
  },
}

export default function PlanningClubsSportifsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Planning pour clubs sportifs',
    description:
      'Outil gratuit pour gérer entraînements, matchs et disponibilités sportives',
    url: 'https://planningo.app/planning-clubs-sportifs',
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
        h1="Planning pour clubs sportifs : entraînements et matchs organisés"
        hero="Gérer les entraînements, matchs et disponibilités de vos équipes devient simple. Planningo est l'outil gratuit des coachs et dirigeants de clubs sportifs. Créez vos plannings hebdomadaires en quelques clics et concentrez-vous sur la performance."
        painPoints={[
          {
            title: 'Disponibilités joueurs éparpillées',
            description:
              'Groupes WhatsApp saturés, messages perdus, confirmations manquantes... Centralisez toutes les infos dans un planning clair et visuel.',
          },
          {
            title: 'Conflits d\'horaires terrain',
            description:
              'Deux équipes réservent le même terrain ? Visualisez instantanément les créneaux occupés et évitez les doublons grâce à un planning partagé.',
          },
          {
            title: 'Communication chaotique',
            description:
              'Finies les confusions entre entraînements, matchs amicaux et compétitions officielles. Un planning unique pour toute la saison sportive.',
          },
        ]}
        solutions={[
          {
            title: 'Multi-équipes facile',
            description:
              'Gérez plusieurs catégories (U9, U13, Seniors...) sur des plannings séparés. 1 agenda gratuit, illimité en Pro pour les gros clubs.',
          },
          {
            title: 'Visualisation par joueur',
            description:
              'Chaque joueur ou éducateur a sa couleur. Identifiez en un coup d\'œil qui est présent à l\'entraînement du mercredi ou au match de samedi.',
          },
          {
            title: 'Export et impression',
            description:
              'Imprimez le planning et affichez-le dans les vestiaires ou le club-house. Format A4 optimisé, sans filigrane gênant (version gratuite).',
          },
        ]}
        useCases={[
          {
            title: 'Planning entraînements hebdomadaires',
            description:
              'Organisez les séances de vos différentes équipes : entraînements techniques, physiques, matchs amicaux. Évitez les conflits de créneaux sur le terrain.',
          },
          {
            title: 'Calendrier matchs et tournois',
            description:
              'Planifiez les matchs de championnat, tournois et déplacements. Ajoutez les horaires, adversaires et disponibilités des joueurs pour composer vos équipes.',
          },
          {
            title: 'Disponibilités joueurs et coachs',
            description:
              'Créez un planning de présence pour savoir qui sera là chaque semaine. Anticipez les absences et ajustez vos compositions d\'équipe en conséquence.',
          },
        ]}
        faq={[
          {
            question:
              'Puis-je gérer plusieurs catégories d\'âge sur un seul compte ?',
            answer:
              'Oui ! Créez un agenda par catégorie (U9, U13, U17, Seniors...). 1 agenda gratuit, illimité en version Pro (5€/mois) pour les clubs multi-sports ou multi-catégories.',
          },
          {
            question: 'Comment gérer les terrains partagés entre équipes ?',
            answer:
              'Créez un planning par terrain pour visualiser les créneaux réservés. Assignez les équipes à leurs créneaux pour éviter les conflits d\'occupation.',
          },
          {
            question:
              'Le planning peut-il inclure les matchs à l\'extérieur ?',
            answer:
              'Absolument. Créez des blocs pour les matchs à domicile et à l\'extérieur. Ajoutez l\'adversaire et l\'heure de rendez-vous dans le titre du créneau.',
          },
        ]}
      />
    </>
  )
}
