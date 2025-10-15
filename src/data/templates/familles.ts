// src/data/templates/familles.ts
import { AgendaTemplate } from '@/types/template'

export const famillesTemplates: AgendaTemplate[] = [
  {
    id: 'famille-emploi-temps-enfants',
    persona: 'familles',
    useCase: 'Emploi du temps enfants',
    title: 'Planning emploi du temps enfants',
    description:
      'Organisez les semaines de vos enfants : école, devoirs, activités extra-scolaires. Un planning familial clair et partagé.',
    icon: 'Users',
    config: {
      activeDays: [0, 1, 2, 3, 4, 5, 6], // Toute la semaine
      timeSlots: [
        { start: '08:00', end: '12:00', label: 'Matinée' },
        { start: '12:00', end: '14:00', label: 'Pause déjeuner' },
        { start: '14:00', end: '17:00', label: 'Après-midi' },
        { start: '17:00', end: '19:00', label: 'Activités' },
        { start: '19:00', end: '21:00', label: 'Soirée' },
      ],
      members: [
        { name: 'Emma (10 ans)' },
        { name: 'Lucas (8 ans)' },
        { name: 'Famille' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0, 1], label: 'École' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [0, 1], label: 'École' },
        { day: 0, timeSlotIndex: 3, memberIndexes: [0], label: 'Piano' },
        { day: 0, timeSlotIndex: 3, memberIndexes: [1], label: 'Devoirs' },
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [0, 1], label: 'École' },
        { day: 2, timeSlotIndex: 2, memberIndexes: [0], label: 'Danse' },
        { day: 2, timeSlotIndex: 2, memberIndexes: [1], label: 'Foot' },
        // Samedi
        { day: 5, timeSlotIndex: 1, memberIndexes: [0, 1, 2], label: 'Déjeuner famille' },
        { day: 5, timeSlotIndex: 2, memberIndexes: [0], label: 'Match danse' },
        { day: 5, timeSlotIndex: 2, memberIndexes: [1], label: 'Match foot' },
        // Dimanche
        { day: 6, timeSlotIndex: 1, memberIndexes: [0, 1, 2], label: 'Sortie famille' },
      ],
    },
  },
  {
    id: 'famille-taches-menageres',
    persona: 'familles',
    useCase: 'Planning tâches ménagères',
    title: 'Planning tâches familiales',
    description:
      'Répartissez équitablement les corvées : vaisselle, courses, ménage. Chacun sait ce qu\'il doit faire chaque jour.',
    icon: 'Home',
    config: {
      activeDays: [0, 1, 2, 3, 4, 5, 6], // Toute la semaine
      timeSlots: [
        { start: '07:00', end: '09:00', label: 'Matin' },
        { start: '12:00', end: '14:00', label: 'Midi' },
        { start: '18:00', end: '20:00', label: 'Soir' },
        { start: '10:00', end: '12:00', label: 'Week-end matin' },
      ],
      members: [
        { name: 'Papa' },
        { name: 'Maman' },
        { name: 'Emma' },
        { name: 'Lucas' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 1, memberIndexes: [0], label: 'Vaisselle' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [1], label: 'Cuisine' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [2], label: 'Table' },
        // Mardi
        { day: 1, timeSlotIndex: 1, memberIndexes: [1], label: 'Vaisselle' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [0], label: 'Cuisine' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [3], label: 'Table' },
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [0, 1], label: 'Courses' },
        { day: 2, timeSlotIndex: 2, memberIndexes: [1], label: 'Cuisine' },
        // Jeudi
        { day: 3, timeSlotIndex: 1, memberIndexes: [0], label: 'Vaisselle' },
        { day: 3, timeSlotIndex: 2, memberIndexes: [1], label: 'Cuisine' },
        { day: 3, timeSlotIndex: 2, memberIndexes: [2, 3], label: 'Rangement' },
        // Samedi
        { day: 5, timeSlotIndex: 3, memberIndexes: [0, 1, 2, 3], label: 'Grand ménage' },
        // Dimanche
        { day: 6, timeSlotIndex: 1, memberIndexes: [0], label: 'Cuisine dominicale' },
        { day: 6, timeSlotIndex: 2, memberIndexes: [1, 2, 3], label: 'Vaisselle' },
      ],
    },
  },
  {
    id: 'famille-activites-extra-scolaires',
    persona: 'familles',
    useCase: 'Planning activités extra-scolaires',
    title: 'Planning activités enfants',
    description:
      'Centralisez sport, musique, arts : qui va où, quand, avec qui ? Gérez les transports et présences facilement.',
    icon: 'Star',
    config: {
      activeDays: [0, 1, 2, 3, 4, 5], // Lundi à Samedi
      timeSlots: [
        { start: '16:30', end: '17:30', label: 'Activité 1' },
        { start: '17:30', end: '18:30', label: 'Activité 2' },
        { start: '18:30', end: '19:30', label: 'Activité 3' },
        { start: '09:00', end: '11:00', label: 'Samedi matin' },
        { start: '14:00', end: '16:00', label: 'Samedi après-midi' },
      ],
      members: [
        { name: 'Emma' },
        { name: 'Lucas' },
        { name: 'Transport Papa' },
        { name: 'Transport Maman' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0, 3], label: 'Piano Emma' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [1, 2], label: 'Judo Lucas' },
        // Mardi
        { day: 1, timeSlotIndex: 0, memberIndexes: [1, 3], label: 'Anglais Lucas' },
        { day: 1, timeSlotIndex: 1, memberIndexes: [0, 2], label: 'Danse Emma' },
        // Mercredi
        { day: 2, timeSlotIndex: 3, memberIndexes: [0, 3], label: 'Théâtre Emma' },
        { day: 2, timeSlotIndex: 4, memberIndexes: [1, 2], label: 'Football Lucas' },
        // Jeudi
        { day: 3, timeSlotIndex: 0, memberIndexes: [0, 3], label: 'Natation Emma' },
        { day: 3, timeSlotIndex: 1, memberIndexes: [1, 2], label: 'Judo Lucas' },
        // Samedi
        { day: 5, timeSlotIndex: 3, memberIndexes: [0, 2], label: 'Cours piano' },
        { day: 5, timeSlotIndex: 4, memberIndexes: [1, 3], label: 'Match foot' },
      ],
    },
  },
]
