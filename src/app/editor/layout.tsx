import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Éditeur - Planningo',
  description: 'Créez et modifiez vos plannings hebdomadaires.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
