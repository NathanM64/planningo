// src/data/templates/clubs-sportifs.ts
import { AgendaTemplate } from '@/types/template'

export const clubsSportifsTemplates: AgendaTemplate[] = [
  {
    id: 'sport-entrainements',
    persona: 'clubs-sportifs',
    useCase: 'Planning entraînements hebdomadaires',
    title: 'Planning entraînements club',
    description:
      'Organisez les séances de vos différentes équipes : entraînements techniques, physiques, matchs amicaux. Évitez les conflits de créneaux.',
    icon: 'Dumbbell',
    config: {
      activeDays: [1, 2, 4, 5], // Mardi, Mercredi, Vendredi, Samedi
      timeSlots: [
        { start: '14:00', end: '15:30', label: 'Après-midi 1' },
        { start: '15:30', end: '17:00', label: 'Après-midi 2' },
        { start: '17:00', end: '18:30', label: 'Soirée 1' },
        { start: '18:30', end: '20:00', label: 'Soirée 2' },
        { start: '20:00', end: '21:30', label: 'Soirée 3' },
      ],
      members: [
        { name: 'U9' },
        { name: 'U13' },
        { name: 'U17' },
        { name: 'Seniors' },
        { name: 'Coach 1' },
        { name: 'Coach 2' },
      ],
      blocks: [
        // Mardi
        { day: 1, timeSlotIndex: 2, memberIndexes: [0, 4], label: 'Technique U9' },
        { day: 1, timeSlotIndex: 3, memberIndexes: [1, 4], label: 'Technique U13' },
        { day: 1, timeSlotIndex: 4, memberIndexes: [3, 5], label: 'Seniors' },
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [0, 4], label: 'Match amical U9' },
        { day: 2, timeSlotIndex: 1, memberIndexes: [1, 5], label: 'Match amical U13' },
        // Vendredi
        { day: 4, timeSlotIndex: 3, memberIndexes: [2, 5], label: 'U17 Physique' },
        { day: 4, timeSlotIndex: 4, memberIndexes: [3, 4], label: 'Seniors Tactique' },
      ],
    },
  },
  {
    id: 'sport-matchs-tournois',
    persona: 'clubs-sportifs',
    useCase: 'Calendrier matchs et tournois',
    title: 'Planning matchs et compétitions',
    description:
      'Planifiez les matchs de championnat, tournois et déplacements. Ajoutez les horaires et adversaires pour composer vos équipes.',
    icon: 'Trophy',
    config: {
      activeDays: [2, 5, 6], // Mercredi, Samedi, Dimanche
      timeSlots: [
        { start: '09:00', end: '11:00', label: 'Match matin 1' },
        { start: '11:00', end: '13:00', label: 'Match matin 2' },
        { start: '14:00', end: '16:00', label: 'Match après-midi 1' },
        { start: '16:00', end: '18:00', label: 'Match après-midi 2' },
      ],
      members: [
        { name: 'U9 - Domicile' },
        { name: 'U13 - Domicile' },
        { name: 'U17 - Extérieur' },
        { name: 'Seniors - Domicile' },
        { name: 'Tournoi' },
      ],
      blocks: [
        // Mercredi
        { day: 2, timeSlotIndex: 1, memberIndexes: [0], label: 'vs FC Lyon' },
        // Samedi
        { day: 5, timeSlotIndex: 0, memberIndexes: [1], label: 'vs AS Paris' },
        { day: 5, timeSlotIndex: 2, memberIndexes: [2], label: 'Déplacement Marseille' },
        { day: 5, timeSlotIndex: 3, memberIndexes: [3], label: 'vs RC Nantes' },
        // Dimanche
        { day: 6, timeSlotIndex: 0, memberIndexes: [4], label: 'Tournoi U13' },
        { day: 6, timeSlotIndex: 1, memberIndexes: [4], label: 'Tournoi U13' },
      ],
    },
  },
  {
    id: 'sport-disponibilites',
    persona: 'clubs-sportifs',
    useCase: 'Disponibilités joueurs et coachs',
    title: 'Planning disponibilités équipe',
    description:
      'Créez un planning de présence pour savoir qui sera là chaque semaine. Anticipez les absences et ajustez vos compositions.',
    icon: 'UserCheck',
    config: {
      activeDays: [1, 2, 4, 5, 6], // Mardi à Dimanche
      timeSlots: [
        { start: '18:00', end: '20:00', label: 'Entraînement soir' },
        { start: '14:00', end: '16:00', label: 'Match samedi' },
        { start: '10:00', end: '12:00', label: 'Match dimanche' },
      ],
      members: [
        { name: 'Joueur 1' },
        { name: 'Joueur 2' },
        { name: 'Joueur 3' },
        { name: 'Joueur 4' },
        { name: 'Joueur 5' },
        { name: 'Coach' },
      ],
      blocks: [
        // Mardi - Entraînement
        { day: 1, timeSlotIndex: 0, memberIndexes: [0, 1, 2, 3, 5], label: 'Présents' },
        // Mercredi - Entraînement
        { day: 2, timeSlotIndex: 0, memberIndexes: [0, 1, 4, 5], label: 'Présents' },
        // Vendredi - Entraînement
        { day: 4, timeSlotIndex: 0, memberIndexes: [0, 1, 2, 3, 4, 5], label: 'Tous présents' },
        // Samedi - Match
        { day: 5, timeSlotIndex: 1, memberIndexes: [0, 1, 2, 4, 5], label: 'Composition' },
        // Dimanche - Match
        { day: 6, timeSlotIndex: 2, memberIndexes: [0, 1, 3, 4, 5], label: 'Composition' },
      ],
    },
  },
]
