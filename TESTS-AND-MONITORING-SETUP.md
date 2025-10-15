# Tests E2E & Monitoring - Configuration complète

## ✅ Ce qui a été configuré

### 1. Tests E2E avec Playwright

**Fichiers créés :**
- `playwright.config.ts` - Configuration Playwright
- `tests/e2e/auth.spec.ts` - Tests authentification (6 tests)
- `tests/e2e/mode-test.spec.ts` - Tests mode Test sans compte (6 tests)
- `tests/e2e/dashboard.spec.ts` - Tests dashboard (3 tests + 3 skipped)
- `tests/e2e/navigation.spec.ts` - Tests navigation générale (7 tests)

**Total : 22 tests E2E** couvrant :
- Authentification (connexion, inscription, routes protégées)
- Mode Test (création agenda, ajout membres/créneaux, limites)
- Dashboard (accès, pricing, upgrade)
- Navigation (pages principales, responsive)

**Commandes disponibles :**
```bash
yarn test:e2e              # Lancer tous les tests
yarn test:e2e:ui           # Interface UI Playwright
yarn test:e2e:debug        # Mode debug
yarn test:e2e:report       # Voir le rapport HTML
```

---

### 2. Monitoring erreurs avec Sentry

**Configuration :**
- Sentry configuré pour Next.js (client, server, edge)
- DSN : `https://ca91a6595c8075bf51a672218fdc0481@o4510194894635008.ingest.de.sentry.io/4510194895814736`
- Auth token configuré sur Vercel pour upload source maps
- Tunnel route `/monitoring` pour contourner ad-blockers

**Features activées :**
- Capture d'erreurs client et serveur
- Session Replay (10% des sessions + 100% des erreurs)
- Source maps automatiques
- Instrumentation Vercel Cron Monitors

**Fichiers configurés :**
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `next.config.ts` (Sentry webpack plugin)

**Variables d'environnement ajoutées sur Vercel :**
- `SENTRY_AUTH_TOKEN` (pour upload source maps)

---

### 3. Analytics avec Vercel

**Intégration :**
- `@vercel/analytics` - Suivi des pages et événements
- `@vercel/speed-insights` - Monitoring performance

**Fichiers modifiés :**
- `src/app/layout.tsx` - Ajout `<Analytics />` et `<SpeedInsights />`

**Système de tracking créé :**
- `src/lib/analytics.ts` - Helper pour tracker les événements
- `ANALYTICS-INTEGRATION.md` - Guide d'intégration complet

**Événements disponibles :**
- Authentification (signUp, signIn, signOut)
- Création/édition (createAgenda, addMember, addBlock)
- Conversions (upgradeModalShown, checkoutStarted, checkoutCompleted)
- Engagement (dashboardVisited, editorVisited, pdfExported)
- Pricing (pricingViewed, pricingPlanClicked)

---

## 📊 Dashboards à configurer

### Sentry (https://sentry.io/organizations/planningo/)
1. Va sur le projet `javascript-nextjs`
2. Configure les alertes :
   - Email sur nouvelles erreurs
   - Slack notifications (optionnel)
3. Active les intégrations :
   - Vercel (déjà configuré via tunnel)
   - GitHub (optionnel, pour lier les commits)

### Vercel Analytics (Vercel Dashboard > planningo > Analytics)
1. Active Analytics dans les settings
2. Crée des funnels de conversion :
   - Test → Free : `pricing_viewed` → `checkout_started` → `checkout_completed`
   - Free → Pro : même chose
3. Configure des alertes sur les métriques clés

---

## 🚀 Prochaines étapes

### Tests E2E
1. Lancer les tests localement : `yarn test:e2e:ui`
2. Vérifier que tous les tests passent
3. (Optionnel) Ajouter des tests authentifiés avec fixtures Supabase

### Sentry
1. Tester la capture d'erreurs :
   - Ouvre la console navigateur
   - Tape : `throw new Error("Test Sentry")`
   - Vérifie que l'erreur apparaît dans Sentry
2. Configure les alertes email/Slack

### Analytics
1. Intégrer les événements `analytics.*()` dans le code (voir `ANALYTICS-INTEGRATION.md`)
2. Tester en local (les événements s'affichent dans la console)
3. Déployer et vérifier dans Vercel Analytics

---

## 📦 Packages ajoutés

```json
{
  "dependencies": {
    "@sentry/nextjs": "10",
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.2.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.0"
  }
}
```

---

## 🔧 Configuration Vercel

**Variables d'environnement requises :**
- `SENTRY_AUTH_TOKEN` ✅ (déjà configuré)
- `NEXT_PUBLIC_SENTRY_DSN` (auto-injecté par Sentry)

**Analytics :**
- Activé automatiquement pour les projets Vercel
- Aucune configuration supplémentaire requise
- Limite gratuite : 2 500 événements/mois

---

## 📈 KPIs à suivre

### Conversions
- Taux Test → Free (créer un compte)
- Taux Free → Pro (upgrade payant)
- Checkout abandonné (modal ouverte mais pas de paiement)

### Engagement
- Nombre d'agendas créés par utilisateur
- Nombre de PDF exportés
- Fréquence d'utilisation (dashboardVisited)

### Performance
- Core Web Vitals (Speed Insights)
- Temps de chargement par page
- Erreurs JavaScript (Sentry)

### Erreurs
- Taux d'erreurs par page
- Erreurs API Supabase/Stripe
- Erreurs de paiement

---

## 🎯 Objectifs

**Court terme (1 mois) :**
- Capturer 100% des erreurs production avec Sentry
- Suivre 100% des conversions avec Analytics
- Avoir 0 tests E2E qui échouent en CI

**Moyen terme (3 mois) :**
- Analyser le funnel de conversion Test → Pro
- Identifier les points de friction (où les users abandonnent)
- Optimiser les pages avec le plus de temps de chargement

**Long terme (6 mois) :**
- Tests E2E automatisés en CI/CD
- Alertes proactives sur les métriques critiques
- Dashboard Sentry propre (toutes les erreurs corrigées)

---

## 📚 Documentation

- **Playwright** : https://playwright.dev/docs/intro
- **Sentry** : https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Vercel Analytics** : https://vercel.com/docs/analytics

---

**Dernière mise à jour :** 15 Octobre 2025 - 00h30
**Statut :** ✅ Configuration terminée, prêt pour tests et intégration
