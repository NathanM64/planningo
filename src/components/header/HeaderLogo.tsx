// src/components/header/HeaderLogo.tsx
import { memo } from 'react'
import Link from 'next/link'

const HeaderLogo = memo(function HeaderLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition"
      aria-label="Planningo - Retour à l'accueil"
    >
      <div className="w-8 h-8 bg-[#0000EE] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">P</span>
      </div>
      <span className="font-bold text-xl text-gray-900">Planningo</span>
    </Link>
  )
})

export default HeaderLogo
