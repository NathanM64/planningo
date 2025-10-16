// src/app/editor/components/layout/ViewSwitcher.tsx
'use client'

import { Calendar, CalendarDays, CalendarRange } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'

export default function ViewSwitcher() {
  const currentView = useEditorStore((state) => state.currentView)
  const setCurrentView = useEditorStore((state) => state.setCurrentView)

  const views = [
    { id: 'week' as const, icon: Calendar, label: 'Semaine' },
    { id: 'month' as const, icon: CalendarDays, label: 'Mois' },
    { id: 'day' as const, icon: CalendarRange, label: 'Jour' },
  ]

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = currentView === view.id

        return (
          <button
            key={view.id}
            onClick={() => setCurrentView(view.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              isActive
                ? 'bg-white shadow text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label={`Vue ${view.label}`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        )
      })}
    </div>
  )
}
