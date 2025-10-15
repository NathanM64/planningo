# Configuration Sentry - Planningo

## ✅ Configuration terminée

Sentry est **déjà configuré** via le wizard `@sentry/wizard` :
- DSN : `https://ca91a6595c8075bf51a672218fdc0481@o4510194894635008.ingest.de.sentry.io/4510194895814736`
- Auth Token : Configuré sur Vercel (variable `SENTRY_AUTH_TOKEN`)
- Fichiers créés : `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`

---

## 🧪 Tester en local

```bash
yarn dev
```

Déclenche une erreur volontaire pour tester :
- Ouvre la console du navigateur
- Tape : `throw new Error("Test Sentry")`
- Va sur ton dashboard Sentry pour voir l'erreur

---

## 📁 Fichiers Sentry

- `sentry.client.config.ts` - Configuration client (navigateur)
- `sentry.server.config.ts` - Configuration serveur (API routes)
- `sentry.edge.config.ts` - Configuration edge (middleware)
- `next.config.ts` - Webpack plugin pour source maps
- `.env.sentry-build-plugin` - Token auth (gitignored)

---

## ⚙️ Features activées

- Capture d'erreurs client et serveur
- Session Replay (10% des sessions + 100% des erreurs)
- Source maps uploadés automatiquement au build
- Route `/monitoring` pour contourner les ad-blockers
- Instrumentation automatique des Vercel Cron Monitors

---

## 🔧 Désactiver Sentry en développement (optionnel)

Si tu veux désactiver Sentry en local, ne définis pas `NEXT_PUBLIC_SENTRY_DSN` dans `.env.local`.

---

## 📊 Dashboard Sentry

Accès : https://sentry.io/organizations/planningo/projects/javascript-nextjs/

**Sections utiles :**
- **Issues** : Toutes les erreurs capturées
- **Performance** : Traces et monitoring performance
- **Replays** : Session Replay (10% des sessions + 100% erreurs)
- **Alerts** : Configurer notifications email/Slack
