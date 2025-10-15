// src/app/planning-enseignants/page.tsx
import { Metadata } from 'next'
import PersonaPage from '@/components/PersonaPage'

export const metadata: Metadata = {
  title: 'Planning Enseignants - Emploi du temps scolaire gratuit | Planningo',
  description:
    "Créez facilement vos emplois du temps, surveillances et permanences. Outil gratuit pour enseignants, simple et imprimable en PDF.",
  keywords: [
    'planning enseignant',
    'emploi du temps professeur',
    'planning surveillance scolaire',
    'agenda enseignant gratuit',
    'planning permanences école',
    'emploi du temps imprimable enseignant',
    'planning réunions parents profs',
  ],
  openGraph: {
    title:
      'Planning Enseignants - Emploi du temps scolaire gratuit | Planningo',
    description:
      'Créez facilement vos emplois du temps, surveillances et permanences.',
    type: 'website',
    url: 'https://planningo.app/planning-enseignants',
  },
}

export default function PlanningEnseignantsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Planning pour enseignants',
    description:
      'Outil gratuit pour créer des emplois du temps, surveillances et permanences scolaires',
    url: 'https://planningo.app/planning-enseignants',
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
        h1="Planning pour enseignants : créez vos emplois du temps en 5 minutes"
        hero="Gérer vos surveillances, permanences et emplois du temps devient un jeu d'enfant. Planningo est l'outil gratuit conçu pour simplifier l'organisation des enseignants, du primaire au lycée. Créez, imprimez et affichez vos plannings hebdomadaires en quelques clics."
        painPoints={[
          {
            title: 'Planning de surveillance illisible',
            description:
              'Fini les tableaux Excel complexes ou les plannings manuscrits difficiles à déchiffrer. Planningo génère des plannings clairs et professionnels automatiquement.',
          },
          {
            title: 'Changements de dernière minute',
            description:
              "Un collègue absent ? Modifiez votre planning en temps réel et réimprimez-le instantanément pour l'afficher en salle des profs.",
          },
          {
            title: 'Coordination équipe pédagogique',
            description:
              'Visualisez facilement qui est disponible pour chaque créneau : surveillances, remplacements, réunions parents-profs ou conseils de classe.',
          },
        ]}
        solutions={[
          {
            title: 'Interface spéciale éducation',
            description:
              'Créneaux adaptés aux rythmes scolaires (matinée, pause déjeuner, après-midi). Ajoutez jusqu\'à 5 enseignants gratuitement, illimité en version Pro.',
          },
          {
            title: 'Impression optimisée',
            description:
              'Format A4 parfait pour affichage en salle des profs. Export PDF immédiat, sans filigrane envahissant en version gratuite.',
          },
          {
            title: 'Gain de temps garanti',
            description:
              "5 minutes pour créer un planning hebdomadaire complet. Plus besoin de refaire le tableau chaque semaine, dupliquez et modifiez l'existant.",
          },
        ]}
        useCases={[
          {
            title: 'Planning de surveillance',
            description:
              "Organisez les tours de garde dans la cour, à l'entrée ou au self. Visualisez d'un coup d'œil qui surveille quand, et repérez les créneaux non couverts.",
          },
          {
            title: 'Emploi du temps enseignants',
            description:
              'Planifiez vos heures de cours, permanences et réunions. Idéal pour les profs remplaçants ou vacataires avec emploi du temps variable.',
          },
          {
            title: 'Réunions parents-professeurs',
            description:
              "Créez un planning de disponibilités pour les rendez-vous parents. Imprimez-le et affichez-le à l'entrée de votre classe lors des portes ouvertes.",
          },
        ]}
        faq={[
          {
            question:
              'Puis-je gérer plusieurs établissements avec un seul compte ?',
            answer:
              "Oui ! Créez un agenda par établissement (1 gratuit, illimité en Pro). Parfait pour les enseignants intervenant dans plusieurs écoles ou collèges.",
          },
          {
            question: "Le planning s'adapte-t-il au rythme scolaire ?",
            answer:
              'Absolument. Les créneaux horaires sont entièrement personnalisables. Configurez vos heures de cours, récréations et pauses déjeuner selon votre emploi du temps.',
          },
          {
            question:
              'Puis-je partager le planning avec mes collègues ?',
            answer:
              "Vous pouvez exporter le planning en PDF et l'envoyer par email ou l'imprimer pour l'afficher en salle des profs. Une fonction de partage en ligne arrive prochainement.",
          },
        ]}
      />
    </>
  )
}
