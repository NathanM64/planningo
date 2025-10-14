// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { GlobalToast } from '@/components/ui/GlobalToast'
import Header from '@/components/Header'

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
      <body className="antialiased bg-white text-gray-900">
        <AuthProvider>
          <Header />
          {children}
          <GlobalToast />
        </AuthProvider>
      </body>
    </html>
  )
}
