// src/config/agenda-templates.ts
import { Member, AgendaBlock, AgendaMode, TimeSlotDisplay, FixedPeriod } from '@/types/agenda'
import { formatDateISO, getMonday } from '@/types/agenda'

export interface AgendaTemplate {
  id: string
  name: string
  description: string
  useCase: 'team' | 'rotation' | 'personal' | 'other'
  members: Omit<Member, 'id'>[]
  sampleBlocks: Omit<AgendaBlock, 'id'>[]
  mode: AgendaMode
  timeSlotDisplay: TimeSlotDisplay
  fixedPeriods?: FixedPeriod[]
}

// Helper pour obtenir le lundi de la semaine courante
function getMondayISO(): string {
  return formatDateISO(getMonday(new Date()))
}

// Helper pour générer des dates relatives (lundi + offset jours)
function getRelativeDate(dayOffset: number): string {
  const monday = getMonday(new Date())
  const targetDate = new Date(monday)
  targetDate.setDate(monday.getDate() + dayOffset)
  return formatDateISO(targetDate)
}

export const AGENDA_TEMPLATES: AgendaTemplate[] = [
  // Template 1: Planning enseignant
  {
    id: 'teacher',
    name: 'Planning enseignant',
    description: 'Emploi du temps avec classes et salles',
    useCase: 'team',
    members: [
      { name: '3èmeA', color: '#3B82F6' },
      { name: '3èmeB', color: '#10B981' },
      { name: '2ndeC', color: '#F59E0B' },
      { name: '1èreD', color: '#EF4444' },
      { name: 'TaleS', color: '#8B5CF6' },
    ],
    sampleBlocks: [
      {
        memberIds: ['3èmeA'], // Sera remplacé par l'ID réel
        date: getRelativeDate(0), // Lundi
        start: '08:00',
        end: '10:00',
        label: 'Cours de maths - Salle 12',
      },
      {
        memberIds: ['3èmeB'],
        date: getRelativeDate(0), // Lundi
        start: '10:00',
        end: '12:00',
        label: 'Cours de français - Salle 8',
      },
      {
        memberIds: ['2ndeC'],
        date: getRelativeDate(1), // Mardi
        start: '14:00',
        end: '16:00',
        label: 'Cours de physique - Labo',
      },
      {
        memberIds: ['1èreD'],
        date: getRelativeDate(2), // Mercredi
        start: '09:00',
        end: '11:00',
        label: 'Cours d\'anglais - Salle 15',
      },
      {
        memberIds: ['TaleS'],
        date: getRelativeDate(3), // Jeudi
        start: '08:00',
        end: '10:00',
        label: 'Cours de philosophie - Salle 3',
      },
    ],
    mode: 'simple',
    timeSlotDisplay: 'precise-hours',
  },

  // Template 2: Restaurant Midi/Soir
  {
    id: 'restaurant',
    name: 'Restaurant Midi/Soir',
    description: 'Roulement services pour équipe de serveurs',
    useCase: 'rotation',
    members: [
      { name: 'Thomas', color: '#3B82F6' },
      { name: 'Julie', color: '#10B981' },
      { name: 'Alex', color: '#F59E0B' },
      { name: 'Sarah', color: '#EF4444' },
    ],
    sampleBlocks: [
      {
        memberIds: ['Thomas', 'Julie'],
        date: getRelativeDate(0), // Lundi
        start: '12:00',
        end: '14:00',
        label: 'Service midi',
      },
      {
        memberIds: ['Alex', 'Sarah'],
        date: getRelativeDate(0), // Lundi
        start: '19:00',
        end: '22:00',
        label: 'Service soir',
      },
      {
        memberIds: ['Alex', 'Julie'],
        date: getRelativeDate(1), // Mardi
        start: '12:00',
        end: '14:00',
        label: 'Service midi',
      },
      {
        memberIds: ['Thomas', 'Sarah'],
        date: getRelativeDate(1), // Mardi
        start: '19:00',
        end: '22:00',
        label: 'Service soir',
      },
    ],
    mode: 'simple',
    timeSlotDisplay: 'fixed-periods',
    fixedPeriods: [
      { id: 'period-0', label: 'Midi' },
      { id: 'period-1', label: 'Soir' },
    ],
  },

  // Template 3: Agenda personnel
  {
    id: 'personal-agenda',
    name: 'Agenda personnel',
    description: 'Planning de rendez-vous type Google Agenda',
    useCase: 'personal',
    members: [
      { name: 'Rendez-vous', color: '#3B82F6' },
    ],
    sampleBlocks: [
      {
        memberIds: ['Rendez-vous'],
        date: getRelativeDate(0), // Lundi
        start: '09:00',
        end: '10:30',
        label: 'RDV Client A',
      },
      {
        memberIds: ['Rendez-vous'],
        date: getRelativeDate(0), // Lundi
        start: '14:00',
        end: '15:00',
        label: 'Réunion équipe',
      },
      {
        memberIds: ['Rendez-vous'],
        date: getRelativeDate(2), // Mercredi
        start: '10:00',
        end: '11:00',
        label: 'RDV Client B',
      },
      {
        memberIds: ['Rendez-vous'],
        date: getRelativeDate(3), // Jeudi
        start: '15:00',
        end: '16:30',
        label: 'Présentation projet',
      },
    ],
    mode: 'simple',
    timeSlotDisplay: 'precise-hours',
  },

  // Template 4: Réservation terrains sportifs
  {
    id: 'sports-courts',
    name: 'Réservation terrains',
    description: 'Planning de réservation de ressources (terrains, salles)',
    useCase: 'other',
    members: [
      { name: 'Terrain 1', color: '#3B82F6' },
      { name: 'Terrain 2', color: '#10B981' },
      { name: 'Terrain 3', color: '#F59E0B' },
    ],
    sampleBlocks: [
      {
        memberIds: ['Terrain 1'],
        date: getRelativeDate(0), // Lundi
        start: '18:00',
        end: '20:00',
        label: 'Club foot U15',
      },
      {
        memberIds: ['Terrain 2'],
        date: getRelativeDate(0), // Lundi
        start: '18:00',
        end: '19:00',
        label: 'Cours tennis débutants',
      },
      {
        memberIds: ['Terrain 1'],
        date: getRelativeDate(2), // Mercredi
        start: '19:00',
        end: '21:00',
        label: 'Match amical',
      },
      {
        memberIds: ['Terrain 3'],
        date: getRelativeDate(3), // Jeudi
        start: '17:00',
        end: '18:30',
        label: 'Entraînement basket',
      },
    ],
    mode: 'simple',
    timeSlotDisplay: 'precise-hours',
  },
]

// Helper pour obtenir les templates selon le use case
export function getTemplatesByUseCase(
  useCase: 'team' | 'rotation' | 'personal' | 'other'
): AgendaTemplate[] {
  return AGENDA_TEMPLATES.filter((t) => t.useCase === useCase)
}

// Helper pour obtenir un template par ID
export function getTemplateById(id: string): AgendaTemplate | undefined {
  return AGENDA_TEMPLATES.find((t) => t.id === id)
}
