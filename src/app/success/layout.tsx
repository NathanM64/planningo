import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paiement réussi - Planningo',
  description: 'Votre abonnement Pro a été activé avec succès.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
