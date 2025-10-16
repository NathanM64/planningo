# Planningo Phase 18 - Refonte UX/Fonctionnelle

## Vision Globale

Transformer Planningo d'un outil rigide vers un outil **flexible mais simple** qui s'adapte naturellement à différents cas d'usage via un **parcours guidé intelligent**.

### Principe Fondateur : Progressive Disclosure
Au lieu d'exposer 10 paramètres techniques, poser 2-3 questions simples qui configurent automatiquement l'agenda pour le cas d'usage spécifique.

### Objectifs Mesurables
- Réduire le temps de création d'un agenda de 5 min à 30 secondes
- Augmenter le taux de complétion (création → premier créneau) de 40% à 80%
- Supporter 5+ cas d'usage sans complexifier l'interface

---

## État d'Implémentation

✅ **Sprints 1-6 COMPLÉTÉS :**
1. Wizard intelligent 3 étapes
2. Templates pré-configurés (4 personas)
3. Vue Mois (calendrier)
4. Vue Jour (timeline)
5. ViewSwitcher (toggle vues)
6. PropertiesPanel (drawer)

🚧 **Sprints 7-11 À FAIRE :**
7. Responsive Mobile
8. Raccourcis clavier
9-11. Tests, accessibilité, polish

---

## Cas d'Usage (Personas)

### Persona 1 : Clara - Enseignante de lycée
- **Besoin :** Planning hebdo cours avec salles
- **Template :** Planning équipe → Heures précises
- **Bénéfice :** Création 5 min vs 30 min avant

### Persona 2 : Marc - Manager de restaurant
- **Besoin :** Roulements service midi/soir pour 8 serveurs
- **Template :** Roulement → Périodes Midi/Soir
- **Bénéfice :** Assignation 2 min vs 30 min/semaine

### Persona 3 : Sophie - Psychologue libérale
- **Besoin :** Agenda RDV avec horaires précis
- **Template :** Agenda personnel → Vue jour
- **Bénéfice :** Alternative simple à Google Agenda

### Persona 4 : Antoine - Coordinateur d'association
- **Besoin :** Planning réservation terrains
- **Template :** Autre → Heures précises (ressources)
- **Bénéfice :** Plus de doubles réservations

### Persona 5 : Léa - Coordinatrice crèche
- **Besoin :** Planning 12 éducatrices sur 4 périodes
- **Template :** Roulement → 4 périodes custom
- **Bénéfice :** Temps création 10 min → 2 min

---

## Fonctionnalités Futures (Sprints 7-11)

### Sprint 7 : Responsive Mobile
**Challenge :** Afficher grille complexe sur mobile

**Vue Semaine Mobile :**
- Scroll horizontal pour jours
- 1 ligne visible à la fois (tabs)
- Créneaux en cards verticales

**Vue Mois Mobile :**
- Calendrier compact 7x5
- Clic jour → Liste créneaux en modal

**Vue Jour Mobile :**
- Timeline verticale (fonctionne bien nativement)

### Sprint 8 : Raccourcis Clavier
| Raccourci | Action |
|-----------|--------|
| `N` | Nouveau créneau |
| `S` | Sauvegarder |
| `P` | Imprimer |
| `←` `→` | Navigation semaine |
| `T` | Aller à aujourd'hui |
| `Esc` | Fermer panneau/modal |
| `Suppr` | Supprimer créneau |

**UI :** Badge "?" en bas à droite → Liste raccourcis

### Sprint 9 : Filtres & Recherche
- Masquer/afficher lignes sans supprimer
- Filtre par nom
- "Lignes avec créneaux cette semaine"

### Sprint 10 : Détection Conflits
**Problème :** Personne à 2 endroits en même temps

**Solution :** Détection automatique + alerte
- Alerte modale si overlap
- Option "forcer quand même"
- Visual indicator (bordure rouge)

### Sprint 11 : Accessibilité WCAG AA
- [ ] Contraste minimum 4.5:1
- [ ] Navigation complète au clavier
- [ ] Focus visible partout
- [ ] Aria labels sur actions
- [ ] Annonces screen reader
- [ ] Tests NVDA/JAWS

---

## Métriques de Succès

| Métrique | Avant | Objectif | Mesure |
|----------|-------|----------|--------|
| Temps création | ~5 min | <30 sec | Analytics |
| Taux complétion | ~40% | >80% | Analytics |
| Taux abandon wizard | ? | <10% | Analytics |
| NPS satisfaction | ? | >50 | Sondage |

---

## Design System

### Palette Couleurs
```typescript
primary.blue: '#0000EE'     // Brand blue
neutral[600]: '#4B5563'     // Body text
neutral[900]: '#111827'     // Headings
```

### Composants Standards
- Buttons : primary, secondary, ghost, danger
- Cards : bg-white + border-2 + rounded-lg
- Inputs : focus:border-blue-500 + ring

---

## Ressources Utiles

**Design Inspiration :**
- Google Calendar (vue jour/mois)
- Notion (slide-in panels)
- Linear (wizard onboarding)

**Libs Techniques :**
- `react-window` (virtualisation)
- `html2canvas` (export PNG)
- `date-fns` (manipulation dates)

**Accessibilité :**
- [WebAIM WCAG Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project](https://www.a11yproject.com/)

---

**Document créé :** 2025-10-16
**Version :** 2.0 (réduit pour sprints restants)
**Sprints restants :** 7-11
