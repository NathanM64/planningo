// src/data/templates/professionnels-sante.ts
import { AgendaTemplate } from '@/types/template'

export const professionnelsSanteTemplates: AgendaTemplate[] = [
  {
    id: 'sante-consultations',
    persona: 'professionnels-sante',
    useCase: 'Planning consultations',
    title: 'Planning consultations médicales',
    description:
      'Organisez vos rendez-vous patients par créneaux de 15 ou 30 minutes. Gérez consultations, visites et urgences.',
    icon: 'Stethoscope',
    config: {
      activeDays: [0, 1, 2, 3, 4], // Lundi à Vendredi
      timeSlots: [
        { start: '08:30', end: '09:00', label: 'Consultation 1' },
        { start: '09:00', end: '09:30', label: 'Consultation 2' },
        { start: '09:30', end: '10:00', label: 'Consultation 3' },
        { start: '10:00', end: '10:30', label: 'Consultation 4' },
        { start: '10:30', end: '11:00', label: 'Consultation 5' },
        { start: '11:00', end: '11:30', label: 'Consultation 6' },
        { start: '14:00', end: '14:30', label: 'Consultation 7' },
        { start: '14:30', end: '15:00', label: 'Consultation 8' },
        { start: '15:00', end: '15:30', label: 'Consultation 9' },
        { start: '15:30', end: '16:00', label: 'Consultation 10' },
        { start: '16:00', end: '16:30', label: 'Consultation 11' },
        { start: '16:30', end: '17:00', label: 'Consultation 12' },
      ],
      members: [
        { name: 'Dr. Dupont' },
        { name: 'Dr. Martin' },
        { name: 'Patient réservé' },
        { name: 'Urgence' },
      ],
      blocks: [
        // Lundi - Dr. Dupont
        { day: 0, timeSlotIndex: 0, memberIndexes: [0, 2], label: 'Consultation' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [0, 2], label: 'Consultation' },
        { day: 0, timeSlotIndex: 3, memberIndexes: [0, 2], label: 'Consultation' },
        { day: 0, timeSlotIndex: 6, memberIndexes: [0, 2], label: 'Consultation' },
        // Mardi - Dr. Martin
        { day: 1, timeSlotIndex: 0, memberIndexes: [1, 2], label: 'Consultation' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [1, 2], label: 'Consultation' },
        { day: 1, timeSlotIndex: 4, memberIndexes: [1, 3], label: 'Urgence' },
      ],
    },
  },
  {
    id: 'sante-gardes',
    persona: 'professionnels-sante',
    useCase: 'Planning gardes et astreintes',
    title: 'Planning gardes médicales',
    description:
      'Organisez les tours de garde entre praticiens. Planifiez gardes de jour, de nuit et week-ends sur plusieurs semaines.',
    icon: 'Moon',
    config: {
      activeDays: [0, 1, 2, 3, 4, 5, 6], // Toute la semaine
      timeSlots: [
        { start: '08:00', end: '18:00', label: 'Garde jour' },
        { start: '18:00', end: '08:00', label: 'Garde nuit' },
      ],
      members: [
        { name: 'Dr. Dupont' },
        { name: 'Dr. Martin' },
        { name: 'Dr. Bernard' },
        { name: 'Dr. Petit' },
        { name: 'Dr. Durand' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0], label: 'Jour' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [1], label: 'Nuit' },
        // Mardi
        { day: 1, timeSlotIndex: 0, memberIndexes: [2], label: 'Jour' },
        { day: 1, timeSlotIndex: 1, memberIndexes: [3], label: 'Nuit' },
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [4], label: 'Jour' },
        { day: 2, timeSlotIndex: 1, memberIndexes: [0], label: 'Nuit' },
        // Jeudi
        { day: 3, timeSlotIndex: 0, memberIndexes: [1], label: 'Jour' },
        { day: 3, timeSlotIndex: 1, memberIndexes: [2], label: 'Nuit' },
        // Vendredi
        { day: 4, timeSlotIndex: 0, memberIndexes: [3], label: 'Jour' },
        { day: 4, timeSlotIndex: 1, memberIndexes: [4], label: 'Nuit' },
        // Samedi
        { day: 5, timeSlotIndex: 0, memberIndexes: [0], label: 'Week-end jour' },
        { day: 5, timeSlotIndex: 1, memberIndexes: [1], label: 'Week-end nuit' },
        // Dimanche
        { day: 6, timeSlotIndex: 0, memberIndexes: [0], label: 'Week-end jour' },
        { day: 6, timeSlotIndex: 1, memberIndexes: [1], label: 'Week-end nuit' },
      ],
    },
  },
  {
    id: 'sante-formations',
    persona: 'professionnels-sante',
    useCase: 'Planning formations continue',
    title: 'Planning formations médicales',
    description:
      'Planifiez les formations continues, congrès et ateliers pratiques. Suivez les présences et validations DPC.',
    icon: 'GraduationCap',
    config: {
      activeDays: [2, 5], // Mercredi et Samedi
      timeSlots: [
        { start: '09:00', end: '10:30', label: 'Session 1' },
        { start: '10:45', end: '12:15', label: 'Session 2' },
        { start: '14:00', end: '15:30', label: 'Session 3' },
        { start: '15:45', end: '17:15', label: 'Session 4' },
      ],
      members: [
        { name: 'Formation ECG' },
        { name: 'Atelier sutures' },
        { name: 'Congrès' },
        { name: 'Formation DPC' },
      ],
      blocks: [
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [0], label: 'ECG Niveau 1' },
        { day: 2, timeSlotIndex: 1, memberIndexes: [0], label: 'ECG Niveau 2' },
        { day: 2, timeSlotIndex: 2, memberIndexes: [1], label: 'Sutures pratique' },
        { day: 2, timeSlotIndex: 3, memberIndexes: [1], label: 'Sutures avancé' },
        // Samedi
        { day: 5, timeSlotIndex: 0, memberIndexes: [2], label: 'Congrès cardio' },
        { day: 5, timeSlotIndex: 1, memberIndexes: [2], label: 'Congrès cardio' },
        { day: 5, timeSlotIndex: 2, memberIndexes: [3], label: 'DPC Urgences' },
        { day: 5, timeSlotIndex: 3, memberIndexes: [3], label: 'DPC Urgences' },
      ],
    },
  },
]
