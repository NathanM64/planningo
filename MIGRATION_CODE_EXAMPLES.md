# Exemples de Code pour Migration - Éditeur Planningo

Ce document contient des exemples de code **prêts à copier-coller** pour chaque phase de la migration.

---

## Phase 1 : Fondations

### 1.1 Types Partagés

**Fichier :** `src/app/editor/types/grid.types.ts`

```typescript
import { Member, AgendaBlock } from '@/types/agenda'

/**
 * Index optimisé pour accéder rapidement aux blocs
 * Clé : "memberId-date" ou "memberId-date-period"
 */
export interface BlockIndex {
  [key: string]: AgendaBlock[]
}

/**
 * Props communes pour toutes les cellules de grille
 */
export interface BaseGridCellProps {
  member: Member
  date: string
  dateObj: Date
  isToday: boolean
  blocks: AgendaBlock[]
  onBlockClick: (block: AgendaBlock) => void
  onAddClick: (memberId: string, date: string, period?: string) => void
}

/**
 * Configuration d'une grille
 */
export interface GridConfig {
  minCellWidth: string       // Tailwind class
  minCellHeight: string       // Tailwind class
  showTimeInBlocks: boolean   // Afficher heures dans blocs
  showPeriodLabels: boolean   // Afficher labels périodes
}
```

---

### 1.2 Helpers d'Indexation

**Fichier :** `src/app/editor/lib/block-indexer.ts`

```typescript
import { AgendaBlock } from '@/types/agenda'
import { BlockIndex } from '@/app/editor/types/grid.types'

/**
 * Crée un index des blocs par membre et date
 * Utilisé pour PreciseHoursGrid et FullDayGrid
 *
 * @example
 * const index = createBlockIndexByMemberDate(blocks)
 * const blocksForMember1OnMonday = index['member1-2025-10-16']
 */
export function createBlockIndexByMemberDate(
  blocks: AgendaBlock[]
): BlockIndex {
  const index: BlockIndex = {}

  blocks.forEach(block => {
    block.memberIds.forEach(memberId => {
      const key = `${memberId}-${block.date}`
      if (!index[key]) {
        index[key] = []
      }
      index[key].push(block)
    })
  })

  return index
}

/**
 * Crée un index des blocs par membre, date ET période
 * Utilisé pour FixedPeriodsGrid
 *
 * @example
 * const index = createBlockIndexByMemberDatePeriod(blocks)
 * const blocksForMember1OnMondayMorning = index['member1-2025-10-16-Matin']
 */
export function createBlockIndexByMemberDatePeriod(
  blocks: AgendaBlock[]
): BlockIndex {
  const index: BlockIndex = {}

  blocks.forEach(block => {
    const period = block.label || 'Matin' // Fallback sur "Matin"
    block.memberIds.forEach(memberId => {
      const key = `${memberId}-${block.date}-${period}`
      if (!index[key]) {
        index[key] = []
      }
      index[key].push(block)
    })
  })

  return index
}

/**
 * Filtre les blocs d'une semaine donnée
 */
export function filterBlocksForWeek(
  blocks: AgendaBlock[],
  weekStart: string
): AgendaBlock[] {
  const start = new Date(weekStart)
  const end = new Date(weekStart)
  end.setDate(end.getDate() + 7)

  return blocks.filter(block => {
    const blockDate = new Date(block.date)
    return blockDate >= start && blockDate < end
  })
}
```

---

### 1.3 Hook Partagé useBlockModal

**Fichier :** `src/app/editor/hooks/useBlockModal.ts`

```typescript
'use client'

import { useState, useCallback } from 'react'
import { AgendaBlock } from '@/types/agenda'

interface ModalContext {
  memberId?: string
  date?: string
  period?: string
  blockToEdit?: AgendaBlock | null
}

export function useBlockModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContext, setModalContext] = useState<ModalContext>({})

  /**
   * Ouvrir la modal en mode création
   */
  const openCreateModal = useCallback((
    memberId: string,
    date: string,
    period?: string
  ) => {
    setModalContext({ memberId, date, period, blockToEdit: null })
    setIsModalOpen(true)
  }, [])

  /**
   * Ouvrir la modal en mode édition
   */
  const openEditModal = useCallback((block: AgendaBlock) => {
    setModalContext({ blockToEdit: block })
    setIsModalOpen(true)
  }, [])

  /**
   * Fermer la modal et réinitialiser le contexte
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    // Petit délai pour éviter le flash du contenu
    setTimeout(() => setModalContext({}), 150)
  }, [])

  return {
    isModalOpen,
    modalContext,
    openCreateModal,
    openEditModal,
    closeModal,
  }
}
```

---

### 1.4 Hook useGridData (Optionnel mais recommandé)

**Fichier :** `src/app/editor/hooks/useGridData.ts`

```typescript
'use client'

import { useMemo } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { getWeekDays, formatDateISO } from '@/types/agenda'

/**
 * Hook centralisé pour les données communes des grilles
 */
export function useGridData() {
  const { agenda, goToPreviousWeek, goToNextWeek, goToToday } = useEditorStore()

  const weekDays = useMemo(
    () => (agenda ? getWeekDays(agenda.currentWeekStart) : []),
    [agenda]
  )

  const today = useMemo(() => formatDateISO(new Date()), [])

  const hasMembers = agenda ? agenda.members.length > 0 : false

  return {
    agenda,
    weekDays,
    today,
    hasMembers,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  }
}
```

---

## Phase 2 : Composants BaseGrid

### 2.1 GridHeader

**Fichier :** `src/app/editor/components/grids/BaseGrid/GridHeader.tsx`

```typescript
'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { getWeekDays } from '@/types/agenda'

interface GridHeaderProps {
  weekStart: string
  onPreviousWeek: () => void
  onNextWeek: () => void
  onToday: () => void
}

export default function GridHeader({
  weekStart,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: GridHeaderProps) {
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])

  return (
    <div className="bg-gray-50 border-b-2 border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          {format(weekDays[0], 'd MMM', { locale: fr })} -{' '}
          {format(weekDays[6], 'd MMM yyyy', { locale: fr })}
        </h2>

        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={onPreviousWeek}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            aria-label="Semaine précédente"
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Précédente</span>
            <span className="sm:hidden">Préc.</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onToday}
            leftIcon={<Calendar className="w-4 h-4" />}
            aria-label="Revenir à aujourd'hui"
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Aujourd&apos;hui</span>
            <span className="sm:hidden">Auj.</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onNextWeek}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            aria-label="Semaine suivante"
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Suivante</span>
            <span className="sm:hidden">Suiv.</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

### 2.2 GridEmptyState

**Fichier :** `src/app/editor/components/grids/BaseGrid/GridEmptyState.tsx`

```typescript
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
```

---

### 2.3 GridTableHeader

**Fichier :** `src/app/editor/components/grids/BaseGrid/GridTableHeader.tsx`

```typescript
'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatDateISO } from '@/types/agenda'

interface GridTableHeaderProps {
  weekDays: Date[]
  today: string
  memberColumnLabel?: string
}

export default function GridTableHeader({
  weekDays,
  today,
  memberColumnLabel = 'Membre',
}: GridTableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-50">
        <th className="p-2 sm:p-3 border-r-2 border-gray-200 sticky left-0 z-30 bg-gray-50 min-w-[100px] sm:min-w-[150px]">
          <span className="text-xs sm:text-sm font-bold text-gray-700">
            {memberColumnLabel}
          </span>
        </th>

        {weekDays.map((day, index) => {
          const dateISO = formatDateISO(day)
          const isToday = dateISO === today

          return (
            <th
              key={index}
              className={`p-2 sm:p-3 border-r border-gray-200 text-center min-w-[100px] sm:min-w-[120px] ${
                isToday ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
              }`}
            >
              <div className="text-xs sm:text-sm">
                {format(day, 'EEE', { locale: fr })}
              </div>
              <div className="text-base sm:text-lg font-bold">
                {format(day, 'd')}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
```

---

### 2.4 MemberCell (Colonne membre)

**Fichier :** `src/app/editor/components/grids/BaseGrid/MemberCell.tsx`

```typescript
'use client'

import { Member } from '@/types/agenda'

interface MemberCellProps {
  member: Member
}

export default function MemberCell({ member }: MemberCellProps) {
  return (
    <td className="p-2 sm:p-3 border-r-2 border-gray-200 sticky left-0 z-20 bg-white">
      {/* Background coloré avec opacité */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: member.color }}
      />

      {/* Contenu */}
      <div className="relative flex items-center gap-1.5 sm:gap-2">
        <div
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: member.color }}
          aria-hidden="true"
        />
        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
          {member.name}
        </span>
      </div>
    </td>
  )
}
```

---

## Phase 3 : PreciseHoursGrid

### 3.1 PreciseHoursBlock

**Fichier :** `src/app/editor/components/grids/implementations/PreciseHoursGrid/PreciseHoursBlock.tsx`

```typescript
'use client'

import { Member, AgendaBlock } from '@/types/agenda'
import { Users } from 'lucide-react'

interface PreciseHoursBlockProps {
  block: AgendaBlock
  member: Member
  onClick: () => void
}

export default function PreciseHoursBlock({
  block,
  member,
  onClick,
}: PreciseHoursBlockProps) {
  const memberCount = block.memberIds.length
  const isMultiMember = memberCount > 1

  return (
    <div
      className="rounded p-1.5 sm:p-2 text-xs cursor-pointer hover:opacity-80 transition-opacity duration-150"
      style={{
        backgroundColor: member.color + '40', // Hex + opacity
        borderLeft: `2px solid ${member.color}`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      role="button"
      tabIndex={0}
      aria-label={`Modifier le créneau de ${block.start} à ${block.end}${
        block.label ? `, ${block.label}` : ''
      }${isMultiMember ? `, partagé avec ${memberCount} membres` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }
      }}
    >
      {/* Horaires */}
      <div className="font-semibold text-[10px] sm:text-xs text-gray-900">
        {block.start} - {block.end}
      </div>

      {/* Label optionnel */}
      {block.label && (
        <div className="text-gray-700 mt-0.5 text-[10px] sm:text-xs">
          {block.label}
        </div>
      )}

      {/* Badge multi-membre */}
      {isMultiMember && (
        <div className="text-[9px] sm:text-xs text-gray-600 mt-0.5 flex items-center gap-0.5">
          <Users className="w-3 h-3" />
          <span>{memberCount}</span>
        </div>
      )}
    </div>
  )
}
```

---

### 3.2 PreciseHoursCell

**Fichier :** `src/app/editor/components/grids/implementations/PreciseHoursGrid/PreciseHoursCell.tsx`

```typescript
'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { BaseGridCellProps } from '@/app/editor/types/grid.types'
import PreciseHoursBlock from './PreciseHoursBlock'

export default function PreciseHoursCell({
  member,
  date,
  dateObj,
  isToday,
  blocks,
  onBlockClick,
  onAddClick,
}: BaseGridCellProps) {
  return (
    <td
      className={`relative border-r border-gray-200 align-top p-1.5 sm:p-2 ${
        isToday ? 'bg-blue-50/30' : ''
      }`}
      style={{ minHeight: '80px' }}
    >
      {/* Liste des blocs */}
      <div className="space-y-1 min-h-[60px]">
        {blocks.map((block) => (
          <PreciseHoursBlock
            key={block.id}
            block={block}
            member={member}
            onClick={() => onBlockClick(block)}
          />
        ))}
      </div>

      {/* Bouton + pour ajouter un créneau */}
      <button
        onClick={() => onAddClick(member.id, date)}
        className="mt-1 w-full py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center gap-1"
        aria-label={`Ajouter un créneau pour ${member.name} le ${format(
          dateObj,
          'EEEE d MMMM',
          { locale: fr }
        )}`}
      >
        <Plus className="w-3 h-3" />
        <span className="hidden sm:inline">Ajouter</span>
      </button>
    </td>
  )
}
```

---

### 3.3 PreciseHoursGrid (Container)

**Fichier :** `src/app/editor/components/grids/implementations/PreciseHoursGrid/PreciseHoursGrid.tsx`

```typescript
'use client'

import { useMemo, memo } from 'react'
import { formatDateISO } from '@/types/agenda'
import { useGridData } from '@/app/editor/hooks/useGridData'
import { useBlockModal } from '@/app/editor/hooks/useBlockModal'
import { createBlockIndexByMemberDate } from '@/app/editor/lib/block-indexer'
import GridHeader from '../../BaseGrid/GridHeader'
import GridEmptyState from '../../BaseGrid/GridEmptyState'
import GridTableHeader from '../../BaseGrid/GridTableHeader'
import MemberCell from '../../BaseGrid/MemberCell'
import PreciseHoursCell from './PreciseHoursCell'
import BlockModal from '../../../modals/BlockModal'

function PreciseHoursGrid() {
  const {
    agenda,
    weekDays,
    today,
    hasMembers,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  } = useGridData()

  const {
    isModalOpen,
    modalContext,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useBlockModal()

  // Indexer les blocs pour un accès O(1)
  const blocksByMemberAndDate = useMemo(() => {
    if (!agenda) return {}
    return createBlockIndexByMemberDate(agenda.blocks)
  }, [agenda])

  if (!agenda) return null

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Header avec navigation */}
        <GridHeader
          weekStart={agenda.currentWeekStart}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />

        {/* État vide si pas de membres */}
        {!hasMembers ? (
          <GridEmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <GridTableHeader weekDays={weekDays} today={today} />

              <tbody>
                {agenda.members.map((member) => (
                  <tr key={member.id} className="border-b-2 border-gray-200">
                    <MemberCell member={member} />

                    {weekDays.map((day, dayIndex) => {
                      const dateISO = formatDateISO(day)
                      const isToday = dateISO === today
                      const key = `${member.id}-${dateISO}`
                      const blocksForDay = blocksByMemberAndDate[key] || []

                      return (
                        <PreciseHoursCell
                          key={dayIndex}
                          member={member}
                          date={dateISO}
                          dateObj={day}
                          isToday={isToday}
                          blocks={blocksForDay}
                          onBlockClick={openEditModal}
                          onAddClick={openCreateModal}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal d'édition/création */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalContext}
      />
    </>
  )
}

export default memo(PreciseHoursGrid)
```

---

## Phase 4 : FixedPeriodsGrid

### 4.1 PeriodBlock

**Fichier :** `src/app/editor/components/grids/implementations/FixedPeriodsGrid/PeriodBlock.tsx`

```typescript
'use client'

import { Member, AgendaBlock } from '@/types/agenda'
import { Users } from 'lucide-react'

interface PeriodBlockProps {
  block: AgendaBlock
  member: Member
  onClick: () => void
}

export default function PeriodBlock({
  block,
  member,
  onClick,
}: PeriodBlockProps) {
  const memberCount = block.memberIds.length
  const isMultiMember = memberCount > 1

  return (
    <div
      className="rounded p-1.5 text-xs cursor-pointer hover:opacity-80 transition-opacity duration-150"
      style={{
        backgroundColor: member.color + '40',
        borderLeft: `2px solid ${member.color}`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      role="button"
      tabIndex={0}
      aria-label={`Modifier le créneau ${block.label || 'sans période'}${
        isMultiMember ? `, partagé avec ${memberCount} membres` : ''
      }`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }
      }}
    >
      {/* Badge multi-membre ou simple marqueur */}
      {isMultiMember ? (
        <div className="text-[9px] sm:text-xs text-gray-600 flex items-center justify-center gap-0.5">
          <Users className="w-3 h-3" />
          <span>{memberCount}</span>
        </div>
      ) : (
        <div className="text-center text-gray-600 font-bold">•</div>
      )}
    </div>
  )
}
```

---

### 4.2 FixedPeriodsCell

**Fichier :** `src/app/editor/components/grids/implementations/FixedPeriodsGrid/FixedPeriodsCell.tsx`

```typescript
'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { Member, AgendaBlock, FixedPeriod } from '@/types/agenda'
import PeriodBlock from './PeriodBlock'

interface FixedPeriodsCellProps {
  member: Member
  date: string
  dateObj: Date
  isToday: boolean
  periods: FixedPeriod[]
  blocksByPeriod: Record<string, AgendaBlock[]>
  onBlockClick: (block: AgendaBlock) => void
  onAddClick: (memberId: string, date: string, period: string) => void
}

export default function FixedPeriodsCell({
  member,
  date,
  dateObj,
  isToday,
  periods,
  blocksByPeriod,
  onBlockClick,
  onAddClick,
}: FixedPeriodsCellProps) {
  return (
    <td
      className={`relative border-r border-gray-200 align-top p-0 ${
        isToday ? 'bg-blue-50/30' : ''
      }`}
    >
      {/* Diviser en sous-colonnes (une par période) */}
      <div className="grid divide-x divide-gray-200" style={{ gridTemplateColumns: `repeat(${periods.length}, 1fr)` }}>
        {periods.map((period) => {
          const key = `${member.id}-${date}-${period.label}`
          const blocksForPeriod = blocksByPeriod[key] || []

          return (
            <div
              key={period.id}
              className="p-1.5 sm:p-2 min-h-[80px] flex flex-col"
            >
              {/* Titre de la période */}
              <div className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1 text-center">
                {period.label}
              </div>

              {/* Liste des blocs */}
              <div className="space-y-1 flex-1">
                {blocksForPeriod.map((block) => (
                  <PeriodBlock
                    key={block.id}
                    block={block}
                    member={member}
                    onClick={() => onBlockClick(block)}
                  />
                ))}
              </div>

              {/* Bouton + pour ajouter */}
              <button
                onClick={() => onAddClick(member.id, date, period.label)}
                className="mt-1 w-full py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center gap-0.5"
                aria-label={`Ajouter un créneau ${period.label} pour ${
                  member.name
                } le ${format(dateObj, 'EEEE d MMMM', { locale: fr })}`}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </td>
  )
}
```

---

### 4.3 FixedPeriodsGrid (Container)

**Fichier :** `src/app/editor/components/grids/implementations/FixedPeriodsGrid/FixedPeriodsGrid.tsx`

```typescript
'use client'

import { useMemo, memo } from 'react'
import { formatDateISO } from '@/types/agenda'
import { useGridData } from '@/app/editor/hooks/useGridData'
import { useBlockModal } from '@/app/editor/hooks/useBlockModal'
import { createBlockIndexByMemberDatePeriod } from '@/app/editor/lib/block-indexer'
import GridHeader from '../../BaseGrid/GridHeader'
import GridEmptyState from '../../BaseGrid/GridEmptyState'
import GridTableHeader from '../../BaseGrid/GridTableHeader'
import MemberCell from '../../BaseGrid/MemberCell'
import FixedPeriodsCell from './FixedPeriodsCell'
import BlockModal from '../../../modals/BlockModal'

function FixedPeriodsGrid() {
  const {
    agenda,
    weekDays,
    today,
    hasMembers,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  } = useGridData()

  const {
    isModalOpen,
    modalContext,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useBlockModal()

  // Récupérer les périodes fixes (par défaut Matin/Soir)
  const periods = useMemo(() => {
    if (!agenda) {
      return [
        { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
        { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' },
      ]
    }
    return agenda.fixedPeriods || [
      { id: 'morning', label: 'Matin', defaultStart: '08:00', defaultEnd: '12:00' },
      { id: 'evening', label: 'Soir', defaultStart: '14:00', defaultEnd: '18:00' },
    ]
  }, [agenda])

  // Indexer les blocs par membre, date ET période
  const blocksByMemberDatePeriod = useMemo(() => {
    if (!agenda) return {}
    return createBlockIndexByMemberDatePeriod(agenda.blocks)
  }, [agenda])

  if (!agenda) return null

  return (
    <>
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <GridHeader
          weekStart={agenda.currentWeekStart}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onToday={goToToday}
        />

        {!hasMembers ? (
          <GridEmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <GridTableHeader weekDays={weekDays} today={today} />

              <tbody>
                {agenda.members.map((member) => (
                  <tr key={member.id} className="border-b-2 border-gray-200">
                    <MemberCell member={member} />

                    {weekDays.map((day, dayIndex) => {
                      const dateISO = formatDateISO(day)
                      const isToday = dateISO === today

                      return (
                        <FixedPeriodsCell
                          key={dayIndex}
                          member={member}
                          date={dateISO}
                          dateObj={day}
                          isToday={isToday}
                          periods={periods}
                          blocksByPeriod={blocksByMemberDatePeriod}
                          onBlockClick={openEditModal}
                          onAddClick={openCreateModal}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BlockModal
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalContext}
      />
    </>
  )
}

export default memo(FixedPeriodsGrid)
```

---

## Phase 5 : GridFactory

**Fichier :** `src/app/editor/components/grids/GridFactory.tsx`

```typescript
'use client'

import { useEditorStore } from '@/stores/editorStore'
import PreciseHoursGrid from './implementations/PreciseHoursGrid/PreciseHoursGrid'
import FixedPeriodsGrid from './implementations/FixedPeriodsGrid/FixedPeriodsGrid'
// import FullDayGrid from './implementations/FullDayGrid/FullDayGrid' // Futur

/**
 * Factory Pattern : Sélectionne la grille selon le mode d'affichage
 *
 * Ajouter un nouveau mode :
 * 1. Créer le dossier implementations/NouveauModeGrid/
 * 2. Implémenter les composants (Cell, Block, Grid)
 * 3. Ajouter un case ici
 */
export default function GridFactory() {
  const agenda = useEditorStore((state) => state.agenda)

  if (!agenda) return null

  switch (agenda.timeSlotDisplay) {
    case 'precise-hours':
      return <PreciseHoursGrid />

    case 'fixed-periods':
      return <FixedPeriodsGrid />

    // case 'full-day':
    //   return <FullDayGrid />

    default:
      // Fallback sur heures précises
      return <PreciseHoursGrid />
  }
}
```

---

## Phase 6 : EditorLayout

**Fichier :** `src/app/editor/components/layout/EditorLayout.tsx`

```typescript
'use client'

import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/contexts/PlanContext'
import { useTelemetry } from '@/hooks/useTelemetry'
import EditorToolbar from './EditorToolbar'
import TestModeBanner from './TestModeBanner'
import MemberList from '../members/MemberList'
import GridFactory from '../grids/GridFactory'
import PrintableWeek from '../printing/PrintableWeek'

interface EditorLayoutProps {
  onSave: () => Promise<void>
}

export default function EditorLayout({ onSave }: EditorLayoutProps) {
  const { agenda, isSaving } = useEditorStore()
  const { isTest, config } = usePlanLimits()
  const { trackPdfExport } = useTelemetry()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Planning_${agenda?.name || 'Agenda'}_${
      new Date().toISOString().split('T')[0]
    }`,
    onAfterPrint: () => {
      trackPdfExport()
    },
  })

  if (!agenda) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Bandeau mode test */}
      {isTest && <TestModeBanner />}

      {/* Toolbar */}
      <EditorToolbar
        agendaName={agenda.name}
        onAgendaNameChange={(name) =>
          useEditorStore.setState({ agenda: { ...agenda, name } })
        }
        onPrint={handlePrint}
        onSave={onSave}
        isSaving={isSaving}
      />

      {/* Contenu principal */}
      <div className="flex-1 container mx-auto px-2 sm:px-4 pb-6 max-w-7xl">
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-4 lg:gap-6">
          {/* Sidebar - Liste des membres */}
          <aside className="lg:sticky lg:top-24 lg:self-start w-full">
            <MemberList />
          </aside>

          {/* Main - Grille (via Factory) */}
          <main className="w-full min-w-0">
            <GridFactory />
          </main>
        </div>
      </div>

      {/* Version imprimable (cachée) */}
      <div className="hidden">
        {agenda && (
          <PrintableWeek
            ref={printRef}
            agenda={agenda}
            watermark={config.hasWatermark}
          />
        )}
      </div>
    </div>
  )
}
```

---

## Phase 7 : page.tsx Simplifié

**Fichier :** `src/app/editor/page.tsx`

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEditorStore } from '@/stores/editorStore'
import { usePlanLimits } from '@/contexts/PlanContext'
import { useTelemetry } from '@/hooks/useTelemetry'
import { useEffect, useRef, useState } from 'react'
import EditorLayout from './components/layout/EditorLayout'
import EditorSkeleton from './components/layout/EditorSkeleton'
import AgendaSetupModal from './components/modals/AgendaSetupModal'
import type { AgendaMode, TimeSlotDisplay } from '@/types/agenda'

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const {
    agenda,
    createNewAgenda,
    saveToCloud,
    loadFromCloud,
    isLoading,
  } = useEditorStore()
  const { isTest } = usePlanLimits()
  const { trackAgendaCreate, trackAgendaSave, trackUpgradeClick } = useTelemetry()
  const hasInitialized = useRef(false)
  const [showSetupModal, setShowSetupModal] = useState(false)

  // Initialisation : charger ou créer un agenda
  useEffect(() => {
    if (hasInitialized.current) return

    const loadAgendaId = searchParams.get('load')

    if (loadAgendaId && !isLoading) {
      loadFromCloud(loadAgendaId)
      hasInitialized.current = true
    } else if (!loadAgendaId && !isLoading) {
      useEditorStore.setState({ agenda: null, selectedBlockId: null })
      setShowSetupModal(true)
      hasInitialized.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fermer automatiquement le modal une fois l'agenda créé
  useEffect(() => {
    if (showSetupModal && agenda) {
      setShowSetupModal(false)
    }
  }, [showSetupModal, agenda])

  const handleSaveOrAuth = async () => {
    if (isTest) {
      trackUpgradeClick('test', 'free')
      router.push('/auth')
    } else {
      if (user && agenda) {
        useEditorStore.setState({
          agenda: { ...agenda, user_id: user.id },
        })
      }
      await saveToCloud()
      trackAgendaSave()
    }
  }

  const handleSetupConfirm = (mode: AgendaMode, timeSlotDisplay: TimeSlotDisplay) => {
    createNewAgenda(mode, timeSlotDisplay)
    trackAgendaCreate()
  }

  // États de chargement
  if (showSetupModal) {
    return (
      <AgendaSetupModal
        isOpen={showSetupModal}
        onClose={() => router.push('/dashboard')}
        onConfirm={handleSetupConfirm}
      />
    )
  }

  if (isLoading || !agenda) {
    return <EditorSkeleton />
  }

  return <EditorLayout onSave={handleSaveOrAuth} />
}
```

---

## Bonus : Tests Unitaires

### Test : block-indexer.ts

**Fichier :** `src/app/editor/lib/__tests__/block-indexer.test.ts`

```typescript
import { createBlockIndexByMemberDate, createBlockIndexByMemberDatePeriod } from '../block-indexer'
import { AgendaBlock } from '@/types/agenda'

describe('block-indexer', () => {
  const mockBlocks: AgendaBlock[] = [
    {
      id: '1',
      memberIds: ['m1', 'm2'],
      date: '2025-10-16',
      start: '09:00',
      end: '10:00',
      label: 'Réunion',
    },
    {
      id: '2',
      memberIds: ['m1'],
      date: '2025-10-17',
      start: '14:00',
      end: '15:00',
      label: 'Formation',
    },
  ]

  describe('createBlockIndexByMemberDate', () => {
    it('should index blocks by member and date', () => {
      const index = createBlockIndexByMemberDate(mockBlocks)

      expect(index['m1-2025-10-16']).toEqual([mockBlocks[0]])
      expect(index['m2-2025-10-16']).toEqual([mockBlocks[0]])
      expect(index['m1-2025-10-17']).toEqual([mockBlocks[1]])
    })

    it('should handle empty array', () => {
      const index = createBlockIndexByMemberDate([])
      expect(Object.keys(index).length).toBe(0)
    })
  })

  describe('createBlockIndexByMemberDatePeriod', () => {
    it('should index blocks by member, date and period', () => {
      const index = createBlockIndexByMemberDatePeriod(mockBlocks)

      expect(index['m1-2025-10-16-Réunion']).toEqual([mockBlocks[0]])
      expect(index['m1-2025-10-17-Formation']).toEqual([mockBlocks[1]])
    })
  })
})
```

---

## Conclusion

Tous ces exemples de code sont **prêts à l'emploi** et respectent :
- Standards Planningo (Tailwind, TypeScript strict, accessibilité)
- Architecture modulaire proposée
- Principes SOLID
- Convention de nommage
- Optimisations React (memo, useMemo, useCallback)

**Prochaine étape :** Copier-coller ces fichiers et commencer la migration phase par phase !
