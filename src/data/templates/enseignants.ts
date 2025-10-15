// src/data/templates/enseignants.ts
import { AgendaTemplate } from '@/types/template'

export const enseignantsTemplates: AgendaTemplate[] = [
  {
    id: 'enseignants-surveillance',
    persona: 'enseignants',
    useCase: 'Planning de surveillance',
    title: 'Planning de surveillance scolaire',
    description:
      'Organisez les tours de garde dans la cour, à l\'entrée ou au self. Visualisez d\'un coup d\'œil qui surveille quand.',
    icon: 'School',
    config: {
      activeDays: [0, 1, 2, 3, 4], // Lundi à Vendredi
      timeSlots: [
        { start: '08:00', end: '08:30', label: 'Entrée' },
        { start: '10:00', end: '10:15', label: 'Récréation matin' },
        { start: '12:00', end: '13:30', label: 'Pause déjeuner' },
        { start: '15:00', end: '15:15', label: 'Récréation après-midi' },
        { start: '16:30', end: '17:00', label: 'Sortie' },
      ],
      members: [
        { name: 'M. Dupont' },
        { name: 'Mme Martin' },
        { name: 'M. Bernard' },
        { name: 'Mme Petit' },
        { name: 'M. Durand' },
      ],
      blocks: [
        // Exemple Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0], label: 'Portail' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [1], label: 'Cour' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [2, 3], label: 'Cantine' },
        { day: 0, timeSlotIndex: 3, memberIndexes: [4], label: 'Cour' },
        { day: 0, timeSlotIndex: 4, memberIndexes: [0], label: 'Portail' },
        // Exemple Mardi
        { day: 1, timeSlotIndex: 0, memberIndexes: [1], label: 'Portail' },
        { day: 1, timeSlotIndex: 1, memberIndexes: [2], label: 'Cour' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [3, 4], label: 'Cantine' },
      ],
    },
  },
  {
    id: 'enseignants-emploi-temps',
    persona: 'enseignants',
    useCase: 'Emploi du temps enseignants',
    title: 'Emploi du temps professeur',
    description:
      'Planifiez vos heures de cours, permanences et réunions. Idéal pour les profs remplaçants ou avec emploi du temps variable.',
    icon: 'Calendar',
    config: {
      activeDays: [0, 1, 2, 3, 4], // Lundi à Vendredi
      timeSlots: [
        { start: '08:00', end: '09:00', label: 'Cours 1' },
        { start: '09:00', end: '10:00', label: 'Cours 2' },
        { start: '10:15', end: '11:15', label: 'Cours 3' },
        { start: '11:15', end: '12:15', label: 'Cours 4' },
        { start: '13:30', end: '14:30', label: 'Cours 5' },
        { start: '14:30', end: '15:30', label: 'Cours 6' },
        { start: '15:45', end: '16:45', label: 'Cours 7' },
      ],
      members: [
        { name: '6ème A' },
        { name: '6ème B' },
        { name: '5ème A' },
        { name: '4ème B' },
        { name: 'Permanence' },
      ],
      blocks: [
        // Exemple Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0], label: 'Mathématiques' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [1], label: 'Mathématiques' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [4], label: 'Permanence' },
        { day: 0, timeSlotIndex: 4, memberIndexes: [2], label: 'Français' },
        { day: 0, timeSlotIndex: 5, memberIndexes: [3], label: 'Français' },
      ],
    },
  },
  {
    id: 'enseignants-reunions-parents',
    persona: 'enseignants',
    useCase: 'Réunions parents-professeurs',
    title: 'Planning réunions parents-profs',
    description:
      'Créez un planning de disponibilités pour les rendez-vous parents. Idéal pour les portes ouvertes et conseils de classe.',
    icon: 'Users',
    config: {
      activeDays: [0, 1, 2, 3, 4], // Lundi à Vendredi
      timeSlots: [
        { start: '17:00', end: '17:20', label: 'Créneau 1' },
        { start: '17:20', end: '17:40', label: 'Créneau 2' },
        { start: '17:40', end: '18:00', label: 'Créneau 3' },
        { start: '18:00', end: '18:20', label: 'Créneau 4' },
        { start: '18:20', end: '18:40', label: 'Créneau 5' },
        { start: '18:40', end: '19:00', label: 'Créneau 6' },
      ],
      members: [
        { name: 'Famille Dupont' },
        { name: 'Famille Martin' },
        { name: 'Famille Durand' },
        { name: 'Disponible' },
      ],
      blocks: [
        // Exemple Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0] },
        { day: 0, timeSlotIndex: 2, memberIndexes: [1] },
        { day: 0, timeSlotIndex: 4, memberIndexes: [2] },
        // Exemple Mardi
        { day: 1, timeSlotIndex: 1, memberIndexes: [0] },
        { day: 1, timeSlotIndex: 3, memberIndexes: [1] },
      ],
    },
  },
]
