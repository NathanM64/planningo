import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tableau de bord - Planningo',
  description: 'Gérez tous vos plannings depuis votre tableau de bord Planningo.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
