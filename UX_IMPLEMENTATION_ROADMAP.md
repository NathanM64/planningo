# Planningo Phase 18 - Roadmap d'Implémentation

## Vue d'Ensemble

Roadmap technique des sprints restants pour la refonte UX Phase 18.

**Durée estimée :** 3 semaines (Sprints 7-11)

---

## État d'Avancement

✅ **Sprints 1-6 COMPLÉTÉS :**
1. Wizard intelligent 3 étapes
2. Templates pré-configurés (4 personas)
3. Vue Mois (calendrier 6 semaines)
4. Vue Jour (timeline horaire)
5. ViewSwitcher + GridFactory
6. PropertiesPanel (drawer)

🚧 **Sprints 7-11 À FAIRE :**

---

## Phase 18.3 - UX Polish (Semaine 5)

### Sprint 7 : Responsive Mobile

**Objectif :** Optimiser l'expérience mobile

#### Ticket 7.1 : Vue Semaine mobile (8h)

**Approche :**
- Tabs horizontaux pour sélectionner une ligne
- Scroll horizontal pour les jours
- Créneaux en cards verticales

**Breakpoints :**
```typescript
// < 640px : Mobile
// 640-1024px : Tablet
// > 1024px : Desktop

// WeekView.tsx
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024)
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])

return isMobile ? <WeekViewMobile /> : <WeekViewDesktop />
```

**Tests :**
- Swipe gestures fonctionnels
- Bottom sheet pour édition (drawer mobile)
- Tests sur vrais devices (iOS/Android)

---

### Sprint 8 : Raccourcis Clavier

**Objectif :** Productivité pour power users

#### Ticket 8.1 : Hook useKeyboardShortcuts (5h)

**Raccourcis à implémenter :**
| Raccourci | Action |
|-----------|--------|
| `N` | Nouveau créneau |
| `Ctrl+S` | Sauvegarder |
| `Ctrl+P` | Imprimer |
| `Ctrl+←` | Semaine précédente |
| `Ctrl+→` | Semaine suivante |
| `T` | Aller à aujourd'hui |
| `Esc` | Fermer panneau/modal |
| `Suppr` | Supprimer créneau sélectionné |

**Implémentation :**
```typescript
// src/hooks/useKeyboardShortcuts.ts
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignorer si dans input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          useEditorStore.getState().openCreateModal()
          break
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            useEditorStore.getState().saveToCloud()
          }
          break
        // ... autres raccourcis
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])
}
```

#### Ticket 8.2 : Modal aide raccourcis (3h)

**UI :** Badge "?" en bas à droite → Ouvre liste raccourcis avec kbd tags

---

## Phase 18.4 - Finitions (Semaine 6)

### Sprint 9 : Détection Conflits

**Objectif :** Éviter assignations conflictuelles

#### Ticket 9.1 : Fonction detectConflict (4h)

```typescript
// src/app/editor/lib/conflict-detection.ts
export interface Conflict {
  type: 'overlap'
  conflictingBlock: AgendaBlock
  message: string
}

export function detectConflict(
  newBlock: AgendaBlock,
  agenda: Agenda
): Conflict | null {
  // Chercher overlaps même jour + même membre + horaires chevauchants
  const overlapping = agenda.blocks.filter(existingBlock => {
    if (existingBlock.date !== newBlock.date) return false

    const sharedMembers = existingBlock.memberIds.filter(id =>
      newBlock.memberIds.includes(id)
    )
    if (sharedMembers.length === 0) return false

    return timeRangesOverlap(
      existingBlock.start, existingBlock.end,
      newBlock.start, newBlock.end
    )
  })

  if (overlapping.length > 0) {
    return {
      type: 'overlap',
      conflictingBlock: overlapping[0],
      message: `Conflit détecté : membre déjà assigné à ${overlapping[0].start}-${overlapping[0].end}`
    }
  }

  return null
}
```

#### Ticket 9.2 : Modal alerte conflit (3h)

**UX :**
- Afficher message clair avec créneaux en conflit
- Options : "Annuler" ou "Forcer quand même"
- Visual indicator (bordure rouge sur créneau)

---

### Sprint 10 : Tests & Accessibilité

**Objectif :** Garantir WCAG 2.1 AA

#### Ticket 10.1 : Audit accessibilité automatique (4h)

**Outils :**
```bash
yarn add -D @axe-core/react eslint-plugin-jsx-a11y

# Configurer axe-core en dev
# src/app/layout.tsx
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000)
  })
}
```

**Actions :**
- Lancer Lighthouse audit (objectif >90)
- Fixer warnings axe-core
- Vérifier aria-labels partout
- Contraste couleurs minimum 4.5:1

#### Ticket 10.2 : Tests navigation clavier (4h)

**Checklist :**
- [ ] Tab traverse tous éléments dans ordre logique
- [ ] Enter active boutons/liens
- [ ] Esc ferme modals/drawers
- [ ] Focus visible sur tous éléments
- [ ] Pas de piège de focus

#### Ticket 10.3 : Tests screen reader (3h)

**Outils :** NVDA (Windows) ou VoiceOver (Mac)

**Scénarios :**
- Créer agenda depuis wizard
- Créer/éditer créneau
- Naviguer entre vues
- Annonces claires à chaque action

---

### Sprint 11 : Documentation & Onboarding

**Objectif :** Faciliter adoption utilisateurs

#### Ticket 11.1 : Tooltips contextuels (4h)

```typescript
// src/components/ui/Tooltip.tsx
export function Tooltip({ children, content }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute bottom-full left-1/2
                      -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white
                      text-sm rounded-lg whitespace-nowrap z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                        border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  )
}
```

**Appliquer sur :**
- Boutons d'action (save, print, etc.)
- Icons sans label
- Raccourcis clavier hints

#### Ticket 11.2 : Guide interactif première utilisation (6h)

**Steps du tour :**
1. Gérer vos lignes (sidebar)
2. Créer un créneau (clic cellule)
3. Changer de vue (ViewSwitcher)
4. Sauvegarder (Ctrl+S ou bouton)

**Library :** react-joyride ou custom

#### Ticket 11.3 : Page d'aide avec recherche (5h)

**Contenu :**
- FAQ par catégorie (Démarrage, Vues, Créneaux, Export)
- Barre de recherche filtrée
- Videos tutoriels courts (optionnel)
- Contact support

---

## Métriques de Succès

### Événements Analytics à Tracker

```typescript
// src/lib/analytics.ts
export const analytics = {
  // Vues
  viewChanged: (view: 'week' | 'month' | 'day') => {},

  // Raccourcis
  shortcutUsed: (shortcut: string) => {},

  // Conflits
  conflictDetected: (type: string) => {},
  conflictForced: () => {},

  // Mobile
  mobileUsage: () => {},

  // Accessibilité
  screenReaderDetected: () => {},
}
```

### Objectifs Quantifiables

| Métrique | Avant | Objectif | Mesure |
|----------|-------|----------|--------|
| Usage mobile | ? | >30% | Analytics |
| Raccourcis utilisés | 0% | >20% power users | Analytics |
| Score Lighthouse a11y | ~70 | >90 | Lighthouse |
| Taux complétion onboarding | ? | >80% | Analytics |

---

## Risques & Mitigation

### Risque 1 : Performance mobile avec grilles complexes

**Mitigation :**
- Virtualisation (react-window)
- Lazy loading cellules hors viewport
- Simplification UI mobile (moins de détails)

### Risque 2 : Régression accessibilité

**Mitigation :**
- Tests axe-core dans CI/CD
- Checklist a11y par feature
- Review externe si possible

### Risque 3 : Conflits merge branches

**Mitigation :**
- Rebases réguliers sur main
- Feature flags pour isoler features
- Reviews fréquentes (tous les 2 jours)

---

## Déploiement Progressif

### Feature Flags

```typescript
// src/config/features.ts
export const FEATURES = {
  RESPONSIVE_MOBILE: process.env.NEXT_PUBLIC_ENABLE_MOBILE === 'true',
  KEYBOARD_SHORTCUTS: process.env.NEXT_PUBLIC_ENABLE_SHORTCUTS === 'true',
  CONFLICT_DETECTION: process.env.NEXT_PUBLIC_ENABLE_CONFLICTS === 'true',
}
```

### Rollout Strategy

**Semaine 5 (Mobile + Shortcuts) :**
- Deploy avec flags OFF
- Enable pour beta testers
- Tests sur vrais devices
- Si OK → 100% users

**Semaine 6 (Finitions) :**
- Deploy incrémental
- Tests staging avant prod
- Monitoring erreurs Sentry

---

## Checklist Finale Avant Release

### Fonctionnel
- [ ] Responsive mobile testé iOS/Android
- [ ] Raccourcis clavier tous fonctionnels
- [ ] Détection conflits active
- [ ] Tooltips sur éléments critiques
- [ ] Tour onboarding fluide

### Accessibilité
- [ ] Score Lighthouse a11y >90
- [ ] Navigation clavier complète
- [ ] Focus trap dans modals/drawers
- [ ] Aria labels partout
- [ ] Tests screen reader OK
- [ ] Contraste couleurs WCAG AA

### Performance
- [ ] Bundle size <500kb (gzip)
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] Pas de memory leaks
- [ ] Rendering 60fps

### Documentation
- [ ] FAQ complète
- [ ] Tooltips contextuels
- [ ] Tour onboarding première utilisation
- [ ] Video demo 2 min (optionnel)

### Tests
- [ ] Tests E2E parcours principaux
- [ ] Tests cross-browser
- [ ] Tests accessibilité auto + manuels
- [ ] Tests manuels 5 personas

---

## Conclusion

**Sprints restants :** 7-11 (3 semaines)

**Priorisation :**
1. **Sprint 7-8 (Semaine 5) :** Mobile + Shortcuts (UX polish)
2. **Sprint 9-11 (Semaine 6) :** Finitions qualité (conflits, a11y, docs)

**Success Metrics :**
- Usage mobile : >30%
- Shortcuts adoption : >20% power users
- A11y score : >90
- NPS : >50

---

**Document créé :** 2025-10-16
**Version :** 2.0 (réduit pour sprints restants 7-11)
**Status :** Ready for Implementation

Prêt à implémenter les sprints restants ! 🚀
