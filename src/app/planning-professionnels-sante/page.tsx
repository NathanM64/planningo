// src/app/planning-professionnels-sante/page.tsx
import { Metadata } from 'next'
import PersonaPage from '@/components/PersonaPage'

export const metadata: Metadata = {
  title:
    'Planning Santé - Roulement infirmières et gardes médicales | Planningo',
  description:
    'Outil gratuit pour gérer gardes, astreintes et roulement équipe soignante. Planning médical simple et conforme aux horaires santé.',
  keywords: [
    'planning infirmières roulement',
    'planning garde médecin',
    'planning astreinte paramédical',
    'planning équipe soignante',
    'roulement infirmier gratuit',
    'planning cabinet médical',
    'outil planning santé gratuit',
  ],
  openGraph: {
    title:
      'Planning Santé - Roulement infirmières et gardes médicales | Planningo',
    description:
      'Outil gratuit pour gérer gardes, astreintes et roulement équipe soignante.',
    type: 'website',
    url: 'https://planningo.app/planning-professionnels-sante',
  },
}

export default function PlanningProfessionnelsSantePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Planning pour professionnels de santé',
    description:
      'Outil gratuit pour gérer roulements, gardes et astreintes médicales',
    url: 'https://planningo.app/planning-professionnels-sante',
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
        h1="Planning santé : gérez gardes et roulements en toute sérénité"
        hero="Coordonner les gardes, astreintes et roulements d'une équipe soignante est complexe. Planningo simplifie la vie des infirmières libérales, cabinets médicaux et EHPAD. Créez des plannings conformes aux contraintes horaires du secteur santé en quelques minutes."
        painPoints={[
          {
            title: 'Roulements 3x8 illisibles',
            description:
              'Tableaux Excel surchargés, erreurs de planning, confusion matin/soir/nuit... Planningo génère des plannings clairs et visuels automatiquement.',
          },
          {
            title: 'Respect temps de repos',
            description:
              'Difficile de garantir les 11h de repos obligatoires entre deux gardes ? Visualisez les enchaînements et évitez les infractions au droit du travail.',
          },
          {
            title: 'Absences et remplacements',
            description:
              'Un membre de l\'équipe malade ? Identifiez instantanément les créneaux à combler et trouvez un remplaçant disponible grâce au planning visuel.',
          },
        ]}
        solutions={[
          {
            title: 'Planification équipe soignante',
            description:
              'Ajoutez jusqu\'à 5 soignants gratuitement (infirmières, aides-soignants, médecins). Illimité en version Pro pour les gros services ou EHPAD.',
          },
          {
            title: 'Créneaux horaires adaptés',
            description:
              'Configurez vos horaires de service : journée (7h-19h), nuit (19h-7h), astreintes weekend. Planning hebdomadaire ou mensuel selon vos besoins.',
          },
          {
            title: 'Export et archivage',
            description:
              'Exportez vos plannings en PDF pour les conserver (obligation légale 5 ans). Imprimez-les pour affichage dans la salle de repos ou le vestiaire.',
          },
        ]}
        useCases={[
          {
            title: 'Roulement infirmières EHPAD',
            description:
              'Organisez les rotations matin/après-midi/nuit de votre équipe soignante. Assurez la continuité des soins 7j/7 avec un planning équilibré et équitable.',
          },
          {
            title: 'Gardes cabinet médical',
            description:
              'Planifiez les permanences de votre cabinet libéral : consultations, visites à domicile, gardes de nuit. Gérez les absences et congés facilement.',
          },
          {
            title: 'Astreintes paramédicales',
            description:
              'Créez le planning d\'astreintes weekend et jours fériés. Notez les numéros de téléphone et secteurs géographiques couverts par chaque soignant.',
          },
        ]}
        faq={[
          {
            question:
              'Planningo est-il conforme aux réglementations du secteur santé ?',
            answer:
              'Planningo est un outil de création de planning visuel. Vous restez responsable du respect des temps de repos légaux, durées maximales de travail et conventions collectives applicables.',
          },
          {
            question:
              'Puis-je archiver mes plannings pour contrôle inspection du travail ?',
            answer:
              'Oui ! Exportez vos plannings en PDF et conservez-les 5 ans (obligation légale). Les plannings sauvegardés restent accessibles dans votre dashboard.',
          },
          {
            question: 'Comment gérer les roulements 3x8 complexes ?',
            answer:
              'Créez des créneaux personnalisés (matin 6h-14h, après-midi 14h-22h, nuit 22h-6h). Assignez chaque soignant à son créneau, Planningo colore automatiquement le planning.',
          },
        ]}
      />
    </>
  )
}
