# Guide d'intégration Analytics

## Événements à ajouter dans le code existant

### 1. Authentification (src/contexts/AuthContext.tsx)

```typescript
import { analytics } from '@/lib/analytics'

// Dans signUp()
const { error } = await supabase.auth.signUp({ email, password })
if (!error) {
  analytics.signUp(email)
}

// Dans signIn()
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (!error) {
  analytics.signIn(email)
}

// Dans signOut()
await supabase.auth.signOut()
analytics.signOut()
```

### 2. Création d'agenda (src/app/dashboard/page.tsx)

```typescript
import { analytics } from '@/lib/analytics'

// Dans handleCreateAgenda()
const result = await saveAgenda(newAgenda)
if (result.success) {
  analytics.createAgenda(user?.is_pro ? 'pro' : 'free')
}
```

### 3. Ajout de membre (src/app/editor/components/MemberList.tsx)

```typescript
import { analytics } from '@/lib/analytics'
import { usePlanLimits } from '@/hooks/usePlanLimits'

const { planKey } = usePlanLimits()

// Dans handleAddMember()
if (newMember) {
  analytics.addMember(planKey, members.length + 1)
}
```

### 4. Ajout de créneau (src/app/editor/components/BlockModal.tsx)

```typescript
import { analytics } from '@/lib/analytics'
import { usePlanLimits } from '@/hooks/usePlanLimits'

const { planKey } = usePlanLimits()

// Dans handleSave()
if (block) {
  const blockCount = agenda.blocks.length + 1
  analytics.addBlock(planKey, blockCount)
}
```

### 5. Modal d'upgrade (src/app/dashboard/page.tsx et src/app/editor/components/MemberList.tsx)

```typescript
import { analytics } from '@/lib/analytics'

// Quand la modal s'ouvre
const openUpgradeModal = (trigger: 'member_limit' | 'agenda_limit') => {
  setShowUpgradeModal(true)
  analytics.upgradeModalShown(planKey, trigger)
}

// Quand la modal se ferme
const closeUpgradeModal = () => {
  setShowUpgradeModal(false)
  analytics.upgradeModalClosed(planKey, 'cancel')
}
```

### 6. Checkout Stripe (src/components/CheckoutButton.tsx)

```typescript
import { analytics } from '@/lib/analytics'

// Dans handleCheckout()
const handleCheckout = async () => {
  analytics.checkoutStarted('pro', source) // source = 'dashboard' | 'editor' | 'pricing'
  // ... reste du code
}
```

### 7. Checkout complété (src/app/success/page.tsx)

```typescript
import { analytics } from '@/lib/analytics'

// Dans useEffect() après redirection Stripe
useEffect(() => {
  if (session_id && user) {
    analytics.checkoutCompleted('pro', 500) // 5€ = 500 cents
  }
}, [session_id, user])
```

### 8. Export PDF (src/app/editor/components/EditorToolbar.tsx)

```typescript
import { analytics } from '@/lib/analytics'
import { usePlanLimits } from '@/hooks/usePlanLimits'

const { planKey } = usePlanLimits()

// Avant handlePrint()
const handleExportPDF = () => {
  analytics.pdfExported(planKey, members.length, blocks.length)
  handlePrint()
}
```

### 9. Page pricing (src/app/pricing/page.tsx)

```typescript
import { analytics } from '@/lib/analytics'

// Dans useEffect()
useEffect(() => {
  analytics.pricingViewed()
}, [])

// Sur les boutons des plans
<button onClick={() => {
  analytics.pricingPlanClicked('pro')
  // ... reste du code
}}>
```

### 10. Dashboard (src/app/dashboard/page.tsx)

```typescript
import { analytics } from '@/lib/analytics'

// Dans useEffect() au chargement
useEffect(() => {
  if (agendas) {
    analytics.dashboardVisited(agendas.length)
  }
}, [agendas])
```

### 11. Éditeur (src/app/editor/page.tsx)

```typescript
import { analytics } from '@/lib/analytics'
import { usePlanLimits } from '@/hooks/usePlanLimits'

const { planKey } = usePlanLimits()

// Dans useEffect() au chargement
useEffect(() => {
  analytics.editorVisited(planKey)
}, [planKey])
```

## Visualisation des données

### Vercel Analytics Dashboard

1. Va sur **Vercel Dashboard > ton-projet > Analytics**
2. Tu verras :
   - Pages vues
   - Événements personnalisés (tous les `track()` ci-dessus)
   - Performance (Speed Insights)

### Rapports utiles à créer

**Funnel de conversion :**
1. `pricing_page_viewed` → combien de visiteurs
2. `checkout_started` → combien cliquent
3. `checkout_completed` → combien payent

**Taux de conversion par plan :**
- `upgrade_modal_shown` (from: 'test') → combien en mode Test voient l'upgrade
- `checkout_started` (from: 'test') → combien cliquent
- `checkout_completed` → combien convertissent

**Engagement utilisateur :**
- `dashboard_visited` → utilisateurs actifs
- `editor_visited` → utilisateurs qui créent
- `pdf_exported` → utilisateurs qui utilisent vraiment l'app

## Notes importantes

- **RGPD** : Les événements n'envoient PAS d'informations personnelles (sauf email hashé pour signUp/signIn)
- **Performance** : `track()` est asynchrone et n'impacte pas l'UX
- **Coût** : Vercel Analytics est inclus dans le plan gratuit jusqu'à 2 500 événements/mois

## Prochaines étapes

1. Ajouter les appels `analytics.*()` dans les fichiers listés ci-dessus
2. Tester en local (les événements apparaîtront dans la console)
3. Déployer sur Vercel
4. Vérifier que les événements arrivent dans le dashboard Vercel Analytics
