// src/app/planning-centres-loisirs/page.tsx
import { Metadata } from 'next'
import PersonaPage from '@/components/PersonaPage'

export const metadata: Metadata = {
  title: 'Planning Centre de Loisirs - Activités et animateurs | Planningo',
  description:
    'Outil gratuit pour gérer activités, animateurs et sorties. Planning périscolaire simple pour centres de loisirs et accueils jeunesse.',
  keywords: [
    'planning centre de loisirs',
    'planning animateur périscolaire',
    'planning activités enfants',
    'planning centre aéré',
    'planning sorties scolaires',
    'planning MJC gratuit',
    'outil planning animateur',
  ],
  openGraph: {
    title:
      'Planning Centre de Loisirs - Activités et animateurs | Planningo',
    description:
      'Outil gratuit pour gérer activités, animateurs et sorties.',
    type: 'website',
    url: 'https://planningo.app/planning-centres-loisirs',
  },
}

export default function PlanningCentresLoisirsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Planning pour centres de loisirs',
    description:
      'Outil gratuit pour gérer activités, animateurs et sorties périscolaires',
    url: 'https://planningo.app/planning-centres-loisirs',
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
        h1="Planning centre de loisirs : organisez activités et animateurs facilement"
        hero="Gérer les activités, animateurs et sorties d'un centre de loisirs est un casse-tête quotidien. Planningo simplifie la vie des directeurs, coordinateurs et animateurs. Créez vos plannings hebdomadaires en quelques clics et concentrez-vous sur l'essentiel : le bien-être des enfants."
        painPoints={[
          {
            title: 'Rotation animateurs complexe',
            description:
              'Qui encadre les 3-6 ans mercredi matin ? Qui gère la sortie piscine ? Visualisez instantanément les affectations et évitez les trous dans l\'encadrement.',
          },
          {
            title: 'Activités multi-âges à coordonner',
            description:
              'Atelier peinture, sortie parc, jeux sportifs... Planifiez toutes les activités par tranche d\'âge et assurez le bon ratio encadrants/enfants.',
          },
          {
            title: 'Respect des normes d\'encadrement',
            description:
              'Normes DDCS strictes (1 animateur pour 8 enfants -6ans, 1/12 pour les +6ans). Vérifiez en un coup d\'œil que les ratios sont respectés sur chaque créneau.',
          },
        ]}
        solutions={[
          {
            title: 'Planning par activité ou animateur',
            description:
              'Organisez votre semaine par activités (ateliers, sorties) ou par animateur (Léa, Thomas...). Jusqu\'à 5 animateurs gratuits, illimité en Pro.',
          },
          {
            title: 'Visualisation multi-groupes',
            description:
              'Créez des plannings séparés pour chaque groupe d\'âge (petits, moyens, grands). Évitez les conflits de salles et optimisez les effectifs animateurs.',
          },
          {
            title: 'Export et affichage',
            description:
              'Imprimez le planning et affichez-le dans la salle d\'activités. Format A4 clair, parfait pour les parents, animateurs et inspections DDCS.',
          },
        ]}
        useCases={[
          {
            title: 'Planning activités hebdomadaires',
            description:
              'Organisez les ateliers créatifs, sportifs, culturels par jour et tranche horaire. Alternez activités calmes et dynamiques pour respecter les rythmes des enfants.',
          },
          {
            title: 'Affectation animateurs par groupe',
            description:
              'Planifiez les rotations d\'animateurs sur les différents groupes d\'âge. Assurez la continuité pédagogique et respectez les normes d\'encadrement DDCS.',
          },
          {
            title: 'Sorties et événements spéciaux',
            description:
              'Organisez les sorties piscine, musée, parc, cinéma. Notez les horaires de départ/retour, le nombre d\'accompagnateurs et le matériel nécessaire.',
          },
        ]}
        faq={[
          {
            question:
              'Planningo respecte-t-il les normes DDCS d\'encadrement ?',
            answer:
              'Planningo est un outil de création de planning. Vous restez responsable du respect des taux d\'encadrement (1/8 pour -6ans, 1/12 pour +6ans) et des diplômes requis pour vos animateurs.',
          },
          {
            question:
              'Puis-je gérer plusieurs groupes d\'âge sur un même planning ?',
            answer:
              'Oui ! Créez un planning par groupe (3-6 ans, 6-10 ans, 11-14 ans) ou regroupez tout sur un planning unique avec code couleur par animateur. 1 agenda gratuit, illimité en Pro.',
          },
          {
            question:
              'Comment planifier les sorties nécessitant plusieurs animateurs ?',
            answer:
              'Assignez plusieurs animateurs sur un même créneau (ex: \'Sortie piscine : Léa + Thomas + Marie\'). Le planning colore automatiquement le bloc avec les couleurs des 3 animateurs.',
          },
        ]}
      />
    </>
  )
}
