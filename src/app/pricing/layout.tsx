import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs - Planningo | Plans Test, Gratuit et Pro',
  description:
    'Découvrez nos tarifs : Mode Test gratuit sans inscription, Plan Gratuit avec sauvegarde, et Plan Pro à 5€/mois avec 7 jours d\'essai gratuit.',
  openGraph: {
    title: 'Tarifs Planningo - À partir de 0€',
    description:
      'Essai gratuit, plan gratuit avec sauvegarde, ou plan Pro à 5€/mois.',
    type: 'website',
    url: 'https://planningo.app/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
