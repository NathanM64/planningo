// src/data/templates/associations.ts
import { AgendaTemplate } from '@/types/template'

export const associationsTemplates: AgendaTemplate[] = [
  {
    id: 'asso-permanences',
    persona: 'associations',
    useCase: 'Permanences bénévoles',
    title: 'Planning permanences bénévoles',
    description:
      'Organisez les permanences de vos bénévoles à l\'accueil, au standard ou lors d\'événements. Assurez une présence continue.',
    icon: 'Handshake',
    config: {
      activeDays: [0, 1, 2, 3, 4, 5], // Lundi à Samedi
      timeSlots: [
        { start: '09:00', end: '12:00', label: 'Permanence matin' },
        { start: '14:00', end: '17:00', label: 'Permanence après-midi' },
        { start: '17:00', end: '19:00', label: 'Permanence soir' },
      ],
      members: [
        { name: 'Marie Dupont' },
        { name: 'Jean Martin' },
        { name: 'Sophie Bernard' },
        { name: 'Pierre Durand' },
        { name: 'Lucie Petit' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0], label: 'Accueil' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [1], label: 'Standard' },
        // Mardi
        { day: 1, timeSlotIndex: 0, memberIndexes: [2], label: 'Accueil' },
        { day: 1, timeSlotIndex: 1, memberIndexes: [3], label: 'Standard' },
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [4], label: 'Accueil' },
        { day: 2, timeSlotIndex: 1, memberIndexes: [0, 1], label: 'Événement' },
        // Jeudi
        { day: 3, timeSlotIndex: 0, memberIndexes: [1], label: 'Accueil' },
        { day: 3, timeSlotIndex: 1, memberIndexes: [2], label: 'Standard' },
        // Vendredi
        { day: 4, timeSlotIndex: 0, memberIndexes: [3], label: 'Accueil' },
        { day: 4, timeSlotIndex: 1, memberIndexes: [4], label: 'Standard' },
        // Samedi
        { day: 5, timeSlotIndex: 0, memberIndexes: [0, 2, 4], label: 'Permanence groupée' },
      ],
    },
  },
  {
    id: 'asso-evenements',
    persona: 'associations',
    useCase: 'Événements et activités',
    title: 'Planning événements associatifs',
    description:
      'Planifiez vos ateliers, conférences et événements ponctuels. Organisez les bénévoles par activité et par créneau horaire.',
    icon: 'CalendarDays',
    config: {
      activeDays: [2, 5, 6], // Mercredi, Samedi, Dimanche
      timeSlots: [
        { start: '10:00', end: '12:00', label: 'Atelier matin' },
        { start: '14:00', end: '16:00', label: 'Atelier après-midi' },
        { start: '16:00', end: '18:00', label: 'Conférence' },
        { start: '18:00', end: '20:00', label: 'Soirée' },
      ],
      members: [
        { name: 'Atelier Cuisine' },
        { name: 'Atelier Arts' },
        { name: 'Conférence' },
        { name: 'Sortie nature' },
        { name: 'Événement spécial' },
      ],
      blocks: [
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [0], label: 'Cuisine débutants' },
        { day: 2, timeSlotIndex: 1, memberIndexes: [1], label: 'Peinture aquarelle' },
        // Samedi
        { day: 5, timeSlotIndex: 0, memberIndexes: [3], label: 'Randonnée forêt' },
        { day: 5, timeSlotIndex: 1, memberIndexes: [0], label: 'Cuisine avancée' },
        { day: 5, timeSlotIndex: 2, memberIndexes: [2], label: 'Conférence climat' },
        // Dimanche
        { day: 6, timeSlotIndex: 0, memberIndexes: [4], label: 'Portes ouvertes' },
        { day: 6, timeSlotIndex: 1, memberIndexes: [4], label: 'Portes ouvertes' },
      ],
    },
  },
  {
    id: 'asso-salles',
    persona: 'associations',
    useCase: 'Réservation de salles',
    title: 'Planning réservation salles',
    description:
      'Gérez les réservations de vos salles et espaces communs. Évitez les doublons et visualisez la disponibilité en temps réel.',
    icon: 'DoorOpen',
    config: {
      activeDays: [0, 1, 2, 3, 4, 5, 6], // Toute la semaine
      timeSlots: [
        { start: '08:00', end: '10:00', label: 'Créneau 1' },
        { start: '10:00', end: '12:00', label: 'Créneau 2' },
        { start: '14:00', end: '16:00', label: 'Créneau 3' },
        { start: '16:00', end: '18:00', label: 'Créneau 4' },
        { start: '18:00', end: '20:00', label: 'Créneau 5' },
      ],
      members: [
        { name: 'Salle A' },
        { name: 'Salle B' },
        { name: 'Salle C' },
        { name: 'Jardin' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 1, memberIndexes: [0], label: 'Réunion bureau' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [1], label: 'Atelier yoga' },
        { day: 0, timeSlotIndex: 4, memberIndexes: [0], label: 'AG membres' },
        // Mercredi
        { day: 2, timeSlotIndex: 1, memberIndexes: [1], label: 'Cours danse' },
        { day: 2, timeSlotIndex: 2, memberIndexes: [2], label: 'Cours musique' },
        { day: 2, timeSlotIndex: 3, memberIndexes: [3], label: 'Jardinage' },
        // Samedi
        { day: 5, timeSlotIndex: 0, memberIndexes: [0, 1], label: 'Formation bénévoles' },
        { day: 5, timeSlotIndex: 1, memberIndexes: [0, 1], label: 'Formation bénévoles' },
        { day: 5, timeSlotIndex: 3, memberIndexes: [2], label: 'Concert privé' },
      ],
    },
  },
]
