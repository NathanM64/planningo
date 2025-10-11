# 📅 Planningo

**Générateur d'agendas imprimables pour petites équipes**

Planningo est un outil simple et intuitif pour créer des agendas personnalisés, collaboratifs et imprimables. Conçu pour les petites équipes, associations, artisans et entrepreneurs qui ont besoin d'un planning clair sans la complexité des outils traditionnels.

---

## ✨ Fonctionnalités (en développement)

- 📆 **Création d'agendas** : Journalier, hebdomadaire ou mensuel
- 🎨 **Interface intuitive** : Drag & drop pour organiser les créneaux
- 🖨️ **Export PDF** : Impression optimisée format A4
- 👥 **Collaboration simple** : Partage avec ton équipe
- 🎨 **Thèmes personnalisables** : Adapte le style à tes besoins
- ☁️ **Sauvegarde cloud** : Accède à tes agendas partout

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 15](https://nextjs.org/) avec App Router et Turbopack
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management** : [Zustand](https://github.com/pmndrs/zustand)
- **Drag & Drop** : [dnd-kit](https://dndkit.com/)
- **Export PDF** : [react-to-print](https://github.com/gregnb/react-to-print)
- **Backend** : [Supabase](https://supabase.com/) (Auth + Database + Storage)
- **Utilitaires** : [date-fns](https://date-fns.org/)

---

## 🚀 Installation

### Prérequis

- Node.js 20+ et Yarn installés
- Un compte [Supabase](https://supabase.com/) (gratuit)

### Étapes

```bash
# Clone le projet
git clone https://github.com/ton-username/planningo.git
cd planningo

# Installe les dépendances
yarn install

# Configure les variables d'environnement
cp .env.example .env.local
# Ajoute tes clés Supabase dans .env.local

# Lance le serveur de développement
yarn dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── editor/            # Page éditeur d'agenda
│   │   ├── components/    # Composants spécifiques à l'éditeur
│   │   └── hooks/         # Hooks personnalisés
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── layout/           # Layout (Header, Footer, etc.)
│   └── shared/           # Composants partagés
├── lib/                  # Utilitaires et services
│   ├── supabaseClient.ts # Client Supabase
│   └── dateUtils.ts      # Fonctions pour les dates
├── stores/               # State management (Zustand)
│   └── editorStore.ts    # Store de l'éditeur
└── types/                # Types TypeScript
    └── agenda.ts         # Types pour les agendas
```

---

## 🧪 Scripts Disponibles

```bash
# Développement avec Turbopack
yarn dev

# Build de production
yarn build

# Démarrer en production
yarn start

# Linter
yarn lint
```

---

## 🔧 Configuration

### Variables d'Environnement

Crée un fichier `.env.local` à la racine du projet :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Tu trouveras ces clés dans ton projet Supabase sous **Settings → API**.

---

## 🗺️ Roadmap

### Phase 1 : MVP (en cours)

- [x] Setup du projet et architecture
- [x] Configuration de la stack technique
- [ ] Page d'accueil
- [ ] Éditeur d'agenda avec drag & drop
- [ ] Export PDF basique
- [ ] Sauvegarde locale (localStorage)

### Phase 2 : Backend & Auth

- [ ] Intégration Supabase
- [ ] Authentification utilisateur
- [ ] Sauvegarde cloud des agendas
- [ ] Partage d'agendas

### Phase 3 : Fonctionnalités avancées

- [ ] Thèmes personnalisables
- [ ] Templates d'agendas
- [ ] Collaboration en temps réel
- [ ] Export en plusieurs formats (PNG, PDF, Excel)

### Phase 4 : Monétisation

- [ ] Système de paiement (Stripe)
- [ ] Plan gratuit vs Pro
- [ ] Page de landing marketing

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour l'instant, le projet est en phase de développement initial.

Si tu veux contribuer :

1. Fork le projet
2. Crée une branche pour ta feature (`git checkout -b feature/ma-feature`)
3. Commit tes changements (`git commit -m 'feat: ajoute ma feature'`)
4. Push sur la branche (`git push origin feature/ma-feature`)
5. Ouvre une Pull Request

---

## 📝 Conventions de Commits

Ce projet utilise les [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatting, CSS
- `refactor:` Refactorisation du code
- `test:` Ajout de tests
- `chore:` Maintenance, config

---

## 📄 Licence

Ce projet est sous licence **MIT**.

---

## 👨‍💻 Auteur

**Ton Nom**

- GitHub : [@ton-username](https://github.com/NathanM64)
- Email : marimbordes.nathan@gmail.com

---

## 🙏 Remerciements

- [Vercel](https://vercel.com) pour Next.js
- [Supabase](https://supabase.com) pour le backend
- [Tailwind Labs](https://tailwindlabs.com) pour Tailwind CSS
- La communauté open-source ❤️

---

**⭐ Si ce projet t'aide, n'hésite pas à lui donner une étoile !**
