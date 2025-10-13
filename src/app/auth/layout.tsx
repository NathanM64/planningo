import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion / Inscription - Planningo',
  description:
    'Créez votre compte Planningo gratuit pour sauvegarder vos plannings et accéder à toutes les fonctionnalités.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
