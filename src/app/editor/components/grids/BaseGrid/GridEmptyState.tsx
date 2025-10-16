'use client'

import { UserPlus } from 'lucide-react'

export default function GridEmptyState() {
  return (
    <div className="p-8 sm:p-12 text-center text-gray-500">
      <div className="flex justify-center mb-4">
        <UserPlus className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-lg font-semibold mb-2 text-gray-700">
        Aucun membre dans l&apos;équipe
      </p>
      <p className="text-sm text-gray-600">
        Ajoutez des membres dans la sidebar pour commencer à planifier
      </p>
    </div>
  )
}
