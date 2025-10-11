import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Planningo - Créez des agendas imprimables',
  description:
    'Outil simple et intuitif pour créer des plannings personnalisés pour votre équipe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  )
}
