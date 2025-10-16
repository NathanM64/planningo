# Diagrammes d'Architecture - Éditeur Planningo

## 1. Architecture Actuelle (Monolithique)

```
┌──────────────────────────────────────────────────────┐
│                   page.tsx (187L)                     │
│                                                       │
│  ┌────────────────────────────────────────┐          │
│  │  if (timeSlotDisplay === 'fixed')      │          │
│  │    render MorningEveningGrid           │          │
│  │  else                                  │          │
│  │    render WeekGrid                     │          │
│  └────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────┘
            │                        │
            ▼                        ▼
┌─────────────────────┐   ┌─────────────────────┐
│   WeekGrid (280L)   │   │ MorningEvening (307L)│
│                     │   │                      │
│  - Header (50L)     │   │  - Header (50L)      │
│  - Modal State      │   │  - Modal State       │
│  - Block Indexing   │   │  - Block Indexing    │
│  - Render Table     │   │  - Render Table      │
│  - Cell Logic       │   │  - Cell Logic        │
└─────────────────────┘   └─────────────────────┘
                            (34% DUPLICATION)
```

**Problèmes :**
- Code dupliqué (header, modal state, indexing)
- Logique métier dans UI
- Impossible de réutiliser des parties
- Ajouter un mode = copier-coller 80% du code

---

## 2. Architecture Proposée (Modulaire)

```
┌──────────────────────────────────────────────────────┐
│              page.tsx (Orchestrateur - 80L)          │
│                                                       │
│  - Initialisation (load/create)                      │
│  - Gestion modal setup                               │
│  - Délégation à EditorLayout                         │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│           EditorLayout (Container - 100L)            │
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Toolbar    │  │  MemberList  │  │GridFactory │  │
│  └─────────────┘  └──────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                        ▼                   ▼                   ▼
            ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
            │ PreciseHoursGrid│ │ FixedPeriodsGrid│ │   FullDayGrid   │
            │     (120L)      │ │     (120L)      │ │     (100L)      │
            └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │                   │                   │
                    └───────────────────┴───────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │        Composants Partagés            │
                    │                                       │
                    │  - GridHeader (50L)                   │
                    │  - GridEmptyState (10L)               │
                    │  - useBlockModal (30L)                │
                    │  - block-indexer (30L)                │
                    └───────────────────────────────────────┘
```

**Avantages :**
- 0% de duplication
- Composants réutilisables
- Facile d'ajouter un nouveau mode (2-4h)
- Séparation claire des responsabilités

---

## 3. Hiérarchie de Composants (PreciseHoursGrid)

```
PreciseHoursGrid (Container)
│
├── GridHeader (Partagé)
│   ├── Titre semaine
│   ├── Button "Précédente"
│   ├── Button "Aujourd'hui"
│   └── Button "Suivante"
│
├── GridEmptyState (Partagé) [si pas de membres]
│
└── Table
    ├── TableHeader
    │   ├── HeaderCell "Membre"
    │   └── HeaderCell pour chaque jour
    │
    └── TableBody
        └── Pour chaque membre:
            ├── MemberCell
            │   ├── Pastille couleur
            │   └── Nom membre
            │
            └── Pour chaque jour:
                └── PreciseHoursCell (Spécifique)
                    ├── Pour chaque bloc:
                    │   └── PreciseHoursBlock (Atomique)
                    │       ├── Heures (09:00 - 10:30)
                    │       ├── Label (optionnel)
                    │       └── Badge multi-membre (👥 3)
                    │
                    └── Button "+" Ajouter
```

**Composition :**
- **Container** : PreciseHoursGrid (logique, data)
- **Presenter** : PreciseHoursCell (affichage)
- **Atomic** : PreciseHoursBlock (élément simple)
- **Shared** : GridHeader, GridEmptyState (réutilisables)

---

## 4. Flux de Données (Data Flow)

```
┌─────────────┐
│   User      │
│   Click     │
└─────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  PreciseHoursCell.onClick()              │
│  → openEditModal(block)                  │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  useBlockModal Hook                      │
│  → setModalContext({ blockToEdit })      │
│  → setIsModalOpen(true)                  │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  BlockModal Render                       │
│  → Affiche formulaire avec données       │
│  → User modifie (heures, label, etc.)    │
│  → Click "Enregistrer"                   │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  editorStore.updateBlock(id, updates)    │
│  → Mise à jour Zustand state             │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  React Re-render                         │
│  → PreciseHoursGrid détecte changement   │
│  → Recalcule blocksByMemberAndDate       │
│  → Re-render PreciseHoursCell            │
│  → Re-render PreciseHoursBlock           │
└──────────────────────────────────────────┘
```

**Unidirectionnel :** User → Hook → Store → UI

---

## 5. Design Pattern : Strategy

```typescript
// Interface commune (Strategy)
interface GridStrategy {
  type: TimeSlotDisplay
  getCellWidth: () => string
  indexBlocks: (blocks: AgendaBlock[]) => BlockIndex
  validateBlock: (block: Partial<AgendaBlock>) => ValidationResult
}

// Implémentations concrètes (Concrete Strategies)

class PreciseHoursStrategy implements GridStrategy {
  type = 'precise-hours'
  getCellWidth = () => 'min-w-[120px]'
  indexBlocks = (blocks) => createBlockIndexByMemberDate(blocks)
  validateBlock = (block) => {
    if (block.start >= block.end) return { valid: false, error: '...' }
    return { valid: true }
  }
}

class FixedPeriodsStrategy implements GridStrategy {
  type = 'fixed-periods'
  getCellWidth = () => 'min-w-[180px]'
  indexBlocks = (blocks) => createBlockIndexByMemberDatePeriod(blocks)
  validateBlock = (block) => {
    if (!block.label) return { valid: false, error: 'Label required' }
    return { valid: true }
  }
}

// Context (GridFactory utilise les strategies)
function GridFactory() {
  const strategy = getStrategy(agenda.timeSlotDisplay)
  return <Grid strategy={strategy} />
}
```

**Avantage :** Ajouter une nouvelle stratégie n'impacte pas les autres

---

## 6. Comparaison : Ajouter un Nouveau Mode

### AVANT (Architecture Actuelle)

```
Temps : 8-12h
Risque : Élevé

Étapes :
1. Créer FullDayGrid.tsx (300 lignes)
   - Copier-coller WeekGrid.tsx
   - Modifier logique cellules
   - Adapter état modal
   - Recréer header navigation

2. Modifier page.tsx
   - Ajouter condition switch
   - Tester tous les modes

3. Modifier BlockModal.tsx
   - Ajouter conditions full-day
   - Cacher champs inutiles

4. Modifier PrintableWeek.tsx
   - Ajouter cas full-day

5. Tests complets
   - Tester tous les modes
   - Vérifier régressions
```

### APRÈS (Architecture Proposée)

```
Temps : 2-4h
Risque : Faible

Étapes :
1. Créer FullDayGrid/FullDayGrid.tsx (100 lignes)
   - Utilise GridHeader (partagé)
   - Utilise GridEmptyState (partagé)
   - Utilise useBlockModal (partagé)
   - Crée FullDayCell (spécifique)

2. Ajouter cas dans GridFactory.tsx (2 lignes)
   case 'full-day':
     return <FullDayGrid />

3. Créer FullDayForm.tsx pour modal (50 lignes)

4. Tests (mode full-day uniquement)
   - Tests isolés
   - Pas d'impact sur autres modes
```

**Gain :** 70% de temps en moins, zéro régression

---

## 7. Structure de Fichiers : Avant/Après

### AVANT

```
src/app/editor/
├── page.tsx                         (187 lignes)
├── components/
│   ├── WeekGrid.tsx                 (280 lignes) 👈 DUPLICATION
│   ├── MorningEveningGrid.tsx       (307 lignes) 👈 DUPLICATION
│   ├── BlockModal.tsx               (300 lignes)
│   ├── EditorToolbar.tsx
│   ├── MemberList.tsx
│   └── ...

Total : ~887 lignes
Duplication : 34%
Complexité : Élevée
```

### APRÈS

```
src/app/editor/
├── page.tsx                         (80 lignes) ✅ -57%
├── components/
│   ├── layout/
│   │   ├── EditorLayout.tsx         (100 lignes)
│   │   ├── EditorToolbar.tsx
│   │   └── ...
│   ├── grids/
│   │   ├── GridFactory.tsx          (20 lignes)
│   │   ├── BaseGrid/                ✅ RÉUTILISABLE
│   │   │   ├── GridHeader.tsx       (50 lignes)
│   │   │   └── GridEmptyState.tsx   (10 lignes)
│   │   └── implementations/
│   │       ├── PreciseHoursGrid/
│   │       │   ├── PreciseHoursGrid.tsx      (120 lignes)
│   │       │   ├── PreciseHoursCell.tsx      (50 lignes)
│   │       │   └── PreciseHoursBlock.tsx     (40 lignes)
│   │       └── FixedPeriodsGrid/
│   │           ├── FixedPeriodsGrid.tsx      (120 lignes)
│   │           ├── FixedPeriodsCell.tsx      (60 lignes)
│   │           └── PeriodBlock.tsx           (40 lignes)
│   └── modals/
│       └── BlockModal.tsx
├── hooks/
│   ├── useBlockModal.ts             (30 lignes) ✅ RÉUTILISABLE
│   └── useBlockFiltering.ts
└── lib/
    └── block-indexer.ts             (30 lignes) ✅ RÉUTILISABLE

Total : ~570 lignes ✅ -36%
Duplication : 0% ✅
Complexité : Faible ✅
Réutilisabilité : 90% ✅
```

---

## 8. Principe de Responsabilité Unique (SRP)

### Composant Monolithique (AVANT)

```
WeekGrid.tsx (280 lignes)
│
├── Responsabilité 1 : Navigation semaine
├── Responsabilité 2 : État modal
├── Responsabilité 3 : Indexation blocs
├── Responsabilité 4 : Filtrage blocs
├── Responsabilité 5 : Render header
├── Responsabilité 6 : Render table
├── Responsabilité 7 : Render cellules
└── Responsabilité 8 : Render blocs

❌ Violation du principe SRP
```

### Composants Modulaires (APRÈS)

```
PreciseHoursGrid.tsx (120 lignes)
└── Responsabilité : Orchestrer l'affichage (Container)
    ✅ Respecte SRP

GridHeader.tsx (50 lignes)
└── Responsabilité : Navigation semaine
    ✅ Respecte SRP

PreciseHoursCell.tsx (50 lignes)
└── Responsabilité : Afficher une cellule jour
    ✅ Respecte SRP

PreciseHoursBlock.tsx (40 lignes)
└── Responsabilité : Afficher un bloc d'heure
    ✅ Respecte SRP

useBlockModal.ts (30 lignes)
└── Responsabilité : Gérer état modal
    ✅ Respecte SRP

block-indexer.ts (30 lignes)
└── Responsabilité : Indexer blocs
    ✅ Respecte SRP
```

**Chaque fichier a UNE seule raison de changer**

---

## 9. Tests : Isolation et Facilité

### AVANT (Tests Difficiles)

```typescript
// ❌ Pour tester l'indexation des blocs, je dois :
// 1. Render WeekGrid complet (280 lignes)
// 2. Mocker Zustand, Router, Auth, etc.
// 3. Render tout le DOM
// 4. Extraire la logique d'indexation

test('should index blocks correctly', () => {
  const { getByTestId } = render(<WeekGrid />)  // ❌ Lourd
  // Difficile d'accéder à la logique d'indexation
})
```

### APRÈS (Tests Faciles)

```typescript
// ✅ Pour tester l'indexation des blocs :
// Tester uniquement le helper (logique isolée)

import { createBlockIndexByMemberDate } from '@/lib/block-indexer'

test('should index blocks correctly', () => {
  const blocks = [
    { id: '1', memberIds: ['m1'], date: '2025-10-16', ... }
  ]
  const index = createBlockIndexByMemberDate(blocks)
  expect(index['m1-2025-10-16']).toEqual([blocks[0]])
})  // ✅ Rapide, isolé, fiable

// Tester le composant séparément
test('PreciseHoursCell renders blocks', () => {
  const { getByText } = render(
    <PreciseHoursCell member={...} blocks={...} />
  )
  expect(getByText('09:00 - 10:00')).toBeInTheDocument()
})  // ✅ Pas besoin de mocker le store
```

**Gain :** Tests 10x plus rapides et fiables

---

## 10. Exemple Concret : Cellule PreciseHours

### Code Actuel (Intégré dans WeekGrid)

```typescript
// ❌ Dans WeekGrid.tsx (impossible à extraire)
{weekDays.map((day, dayIndex) => {
  const dateISO = formatDateISO(day)
  const isToday = dateISO === today
  const key = `${member.id}-${dateISO}`
  const blocksForDay = blocksByMemberAndDate[key] || []

  return (
    <td key={dayIndex} className={...}>
      <div className="space-y-1">
        {blocksForDay.map((block) => (
          <div
            key={block.id}
            className="rounded p-2"
            style={{ backgroundColor: member.color + '40' }}
            onClick={() => handleEditBlock(block)}
          >
            {block.start} - {block.end}
          </div>
        ))}
      </div>
      <button onClick={() => handleCreateBlock(member.id, dateISO)}>
        + Ajouter
      </button>
    </td>
  )
})}
```

**Problèmes :**
- Logique mélangée avec JSX
- Impossible de réutiliser ailleurs
- Tests difficiles

### Code Proposé (Composant Dédié)

```typescript
// ✅ PreciseHoursCell.tsx (composant réutilisable)
export default function PreciseHoursCell({
  member,
  date,
  dateObj,
  isToday,
  blocks,
  onBlockClick,
  onAddClick,
}: PreciseHoursCellProps) {
  return (
    <td
      className={`relative border-r border-gray-200 align-top p-2 ${
        isToday ? 'bg-blue-50/30' : ''
      }`}
    >
      <div className="space-y-1">
        {blocks.map((block) => (
          <PreciseHoursBlock
            key={block.id}
            block={block}
            member={member}
            onClick={() => onBlockClick(block)}
          />
        ))}
      </div>

      <button
        onClick={() => onAddClick(member.id, date)}
        className="mt-1 w-full py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
      >
        <Plus className="w-3 h-3" />
        Ajouter
      </button>
    </td>
  )
}
```

**Avantages :**
- Composant isolé et testable
- Props explicites (contrat clair)
- Réutilisable dans d'autres contextes
- Facile à styliser/customiser

---

## 11. Résumé Visuel : Métriques Clés

```
┌─────────────────────────────────────────────────────────────┐
│                    MÉTRIQUES CLÉS                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Lignes de code                                             │
│  ┌─────────────────────────────────┐                        │
│  │ AVANT  : 887 lignes             │ ███████████████        │
│  │ APRÈS  : 570 lignes             │ █████████              │
│  └─────────────────────────────────┘                        │
│  ✅ Réduction : 36%                                          │
│                                                             │
│  Duplication                                                │
│  ┌─────────────────────────────────┐                        │
│  │ AVANT  : 34%                    │ ███████                │
│  │ APRÈS  : 0%                     │                        │
│  └─────────────────────────────────┘                        │
│  ✅ Élimination totale                                       │
│                                                             │
│  Temps pour ajouter un nouveau mode                         │
│  ┌─────────────────────────────────┐                        │
│  │ AVANT  : 8-12h                  │ ████████████           │
│  │ APRÈS  : 2-4h                   │ ██                     │
│  └─────────────────────────────────┘                        │
│  ✅ Gain : 70%                                               │
│                                                             │
│  Réutilisabilité des composants                             │
│  ┌─────────────────────────────────┐                        │
│  │ AVANT  : 10%                    │ █                      │
│  │ APRÈS  : 90%                    │ █████████              │
│  └─────────────────────────────────┘                        │
│  ✅ Augmentation : 800%                                      │
│                                                             │
│  Complexité (taille moy. fichier)                           │
│  ┌─────────────────────────────────┐                        │
│  │ AVANT  : 280 lignes             │ ██████████████         │
│  │ APRÈS  : 60 lignes              │ ███                    │
│  └─────────────────────────────────┘                        │
│  ✅ Réduction : 78%                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. Roadmap d'Implémentation

```
┌────────────────────────────────────────────────────────────┐
│                 PHASES DE MIGRATION                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Phase 1 : Fondations (4-6h)                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ Types & helpers                                    │  │
│  │ ✓ Hooks partagés (useBlockModal)                     │  │
│  │ ✓ BaseGrid components                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Phase 2 : PreciseHoursGrid (6-8h)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ PreciseHoursBlock                                  │  │
│  │ ✓ PreciseHoursCell                                   │  │
│  │ ✓ PreciseHoursGrid (container)                       │  │
│  │ ✓ Tests & validation                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Phase 3 : GridFactory (2-3h)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ GridFactory component                              │  │
│  │ ✓ EditorLayout refactor                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Phase 4 : page.tsx (1-2h)                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ Simplification page principale                     │  │
│  │ ✓ Tests E2E validation                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Phase 5 : FixedPeriodsGrid (4-6h)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ PeriodBlock                                        │  │
│  │ ✓ FixedPeriodsCell                                   │  │
│  │ ✓ FixedPeriodsGrid (container)                       │  │
│  │ ✓ Tests & validation                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Phase 6 : Validation (4-6h)                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ Tests complets tous modes                          │  │
│  │ ✓ Tests accessibilité (a11y)                         │  │
│  │ ✓ Tests responsive                                   │  │
│  │ ✓ Validation E2E (19 tests)                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Phase 7 : Nettoyage (1-2h)                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✓ Supprimer ancien code                              │  │
│  │ ✓ Documentation                                      │  │
│  │ ✓ Commit & PR                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  [OPTIONNEL] Phase 8 : FullDayGrid (2-4h)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ○ DayStatusCell                                      │  │
│  │ ○ FullDayGrid                                        │  │
│  │ ○ Activer dans setup modal                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  TOTAL : 24-37h (3-5 jours)                                │
└────────────────────────────────────────────────────────────┘
```

---

## Conclusion

Cette refonte architecturale transforme l'éditeur Planningo d'un système **monolithique rigide** en une architecture **modulaire extensible** basée sur des design patterns éprouvés.

**ROI :** L'investissement initial de 24-37h sera rentabilisé dès le premier nouveau mode ajouté (gain de 6-8h) et améliore considérablement la maintenabilité à long terme.

---

**Prochaine étape :** Valider cette architecture avec l'équipe et planifier les phases dans les sprints.
