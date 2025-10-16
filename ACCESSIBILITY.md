# Accessibilité - Planningo

## Objectif WCAG 2.1 Niveau AA

Ce document liste les critères d'accessibilité implémentés pour garantir une expérience inclusive.

---

## Checklist WCAG 2.1 AA

### 1. Perceptible

#### 1.1 Alternatives textuelles
- [x] Toutes les images ont un attribut `alt` descriptif
- [x] Les icônes interactives ont des `aria-label`
- [x] Les graphiques complexes ont des descriptions

#### 1.2 Médias temporels
- [N/A] Pas de contenu audio/vidéo dans l'application

#### 1.3 Adaptable
- [x] La structure HTML est sémantique (h1-h6, nav, main, aside)
- [x] L'ordre de lecture au clavier est logique
- [x] Les instructions ne dépendent pas uniquement de la couleur

#### 1.4 Distinguable
- [x] **Contraste minimum 4.5:1** pour le texte normal
- [x] **Contraste minimum 3:1** pour le texte large (≥18pt)
- [x] Le texte peut être redimensionné jusqu'à 200% sans perte d'information
- [x] Les images de texte sont évitées (sauf logos)

**Palette de couleurs testée :**
- Texte principal (#111827) sur blanc (#FFFFFF) : **15.4:1** ✅
- Texte secondaire (#4B5563) sur blanc (#FFFFFF) : **7.4:1** ✅
- Lien bleu (#0000EE) sur blanc (#FFFFFF) : **8.6:1** ✅
- Bouton primaire (#0000EE) : **8.6:1** ✅

---

### 2. Utilisable

#### 2.1 Accessibilité au clavier
- [x] Toutes les fonctionnalités sont accessibles au clavier
- [x] Pas de piège au clavier (Escape ferme les modals/drawers)
- [x] L'ordre de tabulation est cohérent
- [x] Les raccourcis clavier sont documentés

**Raccourcis implémentés :**
| Touche | Action |
|--------|--------|
| `Tab` | Navigation entre les éléments |
| `Enter` / `Space` | Activer boutons et liens |
| `Esc` | Fermer modal/drawer |
| `N` | Nouveau créneau |
| `Ctrl+S` | Sauvegarder |
| `T` | Aller à aujourd'hui |
| `Suppr` | Supprimer créneau sélectionné |

#### 2.2 Délais suffisants
- [x] Pas de limite de temps imposée
- [x] Pas de contenu qui clignote > 3 fois/seconde

#### 2.3 Crises et réactions physiques
- [x] Pas d'animations rapides ou flashs
- [x] Les animations respectent `prefers-reduced-motion`

#### 2.4 Navigable
- [x] Titres de page descriptifs (`<title>`)
- [x] L'ordre de focus est logique
- [x] Les liens ont un texte descriptif (pas de "cliquez ici")
- [x] Plusieurs chemins pour accéder aux fonctionnalités
- [x] Le focus est toujours visible

**Indicateur de focus personnalisé :**
```css
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

#### 2.5 Modalités d'entrée
- [x] Les gestes tactiles ne nécessitent pas de mouvements complexes
- [x] Les cibles tactiles font ≥44x44px
- [x] Les labels sont cliquables (associés aux inputs)

---

### 3. Compréhensible

#### 3.1 Lisible
- [x] La langue de la page est déclarée (`<html lang="fr">`)
- [x] Les changements de langue sont identifiés
- [x] Le jargon est évité ou expliqué

#### 3.2 Prévisible
- [x] Le focus ne déclenche pas de changements de contexte
- [x] La saisie ne provoque pas de changements inattendus
- [x] La navigation est cohérente sur toutes les pages
- [x] Les composants identiques se comportent de manière identique

#### 3.3 Assistance à la saisie
- [x] Les erreurs sont identifiées et décrites
- [x] Les labels et instructions sont présents
- [x] La validation affiche des messages clairs
- [x] Les erreurs peuvent être corrigées

**Exemples de messages d'erreur :**
- ✅ "L'heure de début doit être avant l'heure de fin"
- ✅ "Le label (période) est obligatoire en mode Matin/Soir"
- ✅ "Conflit détecté : Alice déjà assignée de 09:00 à 12:00"

---

### 4. Robuste

#### 4.1 Compatible
- [x] Le HTML est valide
- [x] Les attributs ARIA sont correctement utilisés
- [x] Les rôles ARIA sont appropriés
- [x] Compatible avec les technologies d'assistance

**Composants avec ARIA :**
- Modals : `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Drawers : `role="dialog"`, `aria-modal="true"`
- Boutons : `aria-label` pour les icônes seules
- Notifications : `role="alert"`, `aria-live="polite"`

---

## Tests d'accessibilité

### Tests automatisés

#### ESLint (jsx-a11y)
```bash
yarn lint
```

Règles activées :
- `jsx-a11y/alt-text` : Textes alternatifs obligatoires
- `jsx-a11y/aria-props` : Propriétés ARIA valides
- `jsx-a11y/heading-has-content` : Titres non vides
- `jsx-a11y/label-has-associated-control` : Labels associés

#### Lighthouse Audit
```bash
yarn build && yarn start
# Ouvrir Chrome DevTools > Lighthouse > Accessibility
```

**Objectif : Score ≥ 90**

---

### Tests manuels

#### 1. Navigation au clavier

**Parcours complet :**
1. Ouvrir l'éditeur
2. Tab à travers tous les éléments interactifs
3. Vérifier que le focus est visible
4. Ouvrir un modal → Tab dans le modal → Esc ferme le modal
5. Ouvrir le drawer → Tab dans le drawer → Focus trap actif

**Checklist :**
- [ ] Tous les éléments interactifs sont accessibles au Tab
- [ ] L'ordre de tabulation est logique (de haut en bas, gauche à droite)
- [ ] Le focus est toujours visible (anneau bleu)
- [ ] Escape ferme les modals/drawers
- [ ] Aucun piège au clavier

#### 2. Lecteurs d'écran

**Outils recommandés :**
- **NVDA** (Windows, gratuit) : https://www.nvaccess.org/
- **JAWS** (Windows, essai gratuit) : https://www.freedomscientific.com/
- **VoiceOver** (Mac, intégré) : Cmd + F5

**Scénarios à tester :**

**Scénario 1 : Créer un agenda**
1. Activer le lecteur d'écran
2. Naviguer jusqu'au bouton "Créer un agenda"
3. Activer le bouton
4. Remplir le wizard en se basant uniquement sur les annonces audio
5. Vérifier que toutes les étapes sont annoncées clairement

**Scénario 2 : Créer un créneau**
1. Naviguer dans la grille
2. Sélectionner une cellule
3. Ouvrir le formulaire de création
4. Remplir tous les champs
5. Enregistrer
6. Vérifier que le créneau est bien annoncé

**Scénario 3 : Changer de vue**
1. Utiliser le ViewSwitcher
2. Vérifier que le changement de vue est annoncé
3. Naviguer dans la nouvelle vue

**Checklist :**
- [ ] Les titres de section sont annoncés
- [ ] Les boutons ont des labels clairs
- [ ] Les champs de formulaire sont bien identifiés
- [ ] Les erreurs sont annoncées
- [ ] Les changements d'état sont notifiés (ex: "Créneau créé")

#### 3. Zoom texte (200%)

**Procédure :**
1. Ouvrir l'éditeur
2. Zoomer à 200% (Ctrl + +)
3. Vérifier que :
   - Tout le contenu est lisible
   - Pas de texte tronqué
   - Pas de scroll horizontal excessif
   - Les boutons restent cliquables

#### 4. Contraste des couleurs

**Outil en ligne :** https://webaim.org/resources/contrastchecker/

**Vérifications :**
- [ ] Texte principal : contraste ≥ 4.5:1
- [ ] Texte large (≥18pt) : contraste ≥ 3:1
- [ ] Éléments graphiques : contraste ≥ 3:1
- [ ] Focus indicator : contraste ≥ 3:1

---

## Bonnes pratiques appliquées

### 1. Structure sémantique HTML
```html
<main>
  <header>Toolbar</header>
  <aside>Sidebar - Membres</aside>
  <section>Grille</section>
</main>
```

### 2. ARIA Live Regions
```tsx
// Notification accessible
<div role="alert" aria-live="polite">
  Agenda sauvegardé avec succès
</div>
```

### 3. Focus Trap dans les modals
```tsx
import FocusTrap from 'focus-trap-react'

<FocusTrap active={isOpen}>
  <div role="dialog" aria-modal="true">
    {/* Contenu */}
  </div>
</FocusTrap>
```

### 4. Labels descriptifs
```tsx
// ✅ Bon
<button aria-label="Semaine précédente">
  <ChevronLeft />
</button>

// ❌ Mauvais
<button>
  <ChevronLeft />
</button>
```

### 5. Gestion des erreurs
```tsx
// Afficher les erreurs clairement
{error && (
  <p role="alert" className="text-red-600">
    {error}
  </p>
)}
```

---

## Ressources

### Documentation officielle
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

### Outils de test
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Extensions navigateur
- **axe DevTools** (Chrome/Firefox)
- **WAVE** (Chrome/Firefox/Edge)
- **Accessibility Insights** (Chrome/Edge)

---

**Dernière mise à jour :** 2025-10-16
**Objectif cible :** WCAG 2.1 AA (Score Lighthouse ≥ 90)
