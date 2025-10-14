# Configuration Supabase pour l'authentification

## ⚠️ Configuration obligatoire dans le dashboard Supabase

### 1. URL de redirection (Redirect URLs)

Aller dans **Authentication > URL Configuration** et ajouter :

```
http://localhost:3000/auth/update-password
https://planningo.app/auth/update-password
```

### 2. Configuration Email (Email Templates)

Aller dans **Authentication > Email Templates** et vérifier que :

- **Reset Password** est activé
- Le template contient `{{ .ConfirmationURL }}`
- L'URL de redirection est correcte

### 3. Migration SQL à exécuter

Exécuter le fichier : `supabase/migrations/add_user_names.sql`

Cette migration ajoute les colonnes `first_name` et `last_name` à la table `users`.

### 4. Test des flows

**Inscription :**
1. Aller sur `/auth`
2. Cliquer sur "Créer un compte"
3. Remplir prénom, nom, email, mot de passe
4. Vérifier l'email de confirmation
5. Cliquer sur le lien de confirmation

**Connexion :**
1. Aller sur `/auth`
2. Entrer email et mot de passe
3. Cliquer sur "Se connecter"

**Réinitialisation mot de passe :**
1. Aller sur `/auth`
2. Cliquer sur "Mot de passe oublié ?"
3. Entrer email
4. Vérifier l'email de réinitialisation
5. Cliquer sur le lien → redirige vers `/auth/update-password`
6. Entrer nouveau mot de passe
7. Redirection vers dashboard

### 5. Variables d'environnement

Vérifier que les variables suivantes sont bien définies :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 📝 Notes importantes

- Les métadonnées utilisateur (first_name, last_name) sont stockées dans `auth.users.raw_user_meta_data`
- Le trigger `handle_new_user()` copie ces données dans `public.users`
- Les emails sont envoyés automatiquement par Supabase
- Le token de réinitialisation est valide 1 heure par défaut
