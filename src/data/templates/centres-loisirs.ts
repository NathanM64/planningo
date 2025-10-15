// src/data/templates/centres-loisirs.ts
import { AgendaTemplate } from '@/types/template'

export const centresLoisirsTemplates: AgendaTemplate[] = [
  {
    id: 'loisirs-activites-hebdo',
    persona: 'centres-loisirs',
    useCase: 'Planning activités hebdomadaires',
    title: 'Planning activités centre de loisirs',
    description:
      'Organisez les ateliers et animations de la semaine : arts, sports, jeux. Un planning clair pour enfants et animateurs.',
    icon: 'Palette',
    config: {
      activeDays: [0, 1, 2, 3, 4], // Lundi à Vendredi
      timeSlots: [
        { start: '09:00', end: '10:30', label: 'Activité matin 1' },
        { start: '10:30', end: '12:00', label: 'Activité matin 2' },
        { start: '14:00', end: '15:30', label: 'Activité après-midi 1' },
        { start: '15:30', end: '17:00', label: 'Activité après-midi 2' },
      ],
      members: [
        { name: 'Groupe 3-6 ans' },
        { name: 'Groupe 7-10 ans' },
        { name: 'Groupe 11-14 ans' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0], label: 'Peinture' },
        { day: 0, timeSlotIndex: 0, memberIndexes: [1], label: 'Football' },
        { day: 0, timeSlotIndex: 0, memberIndexes: [2], label: 'Basket' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [0], label: 'Jeux libres' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [1], label: 'Arts plastiques' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [2], label: 'Théâtre' },
        // Mardi
        { day: 1, timeSlotIndex: 2, memberIndexes: [0], label: 'Musique' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [1], label: 'Danse' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [2], label: 'Escalade' },
        { day: 1, timeSlotIndex: 3, memberIndexes: [0, 1, 2], label: 'Grand jeu collectif' },
        // Mercredi
        { day: 2, timeSlotIndex: 0, memberIndexes: [0], label: 'Pâte à modeler' },
        { day: 2, timeSlotIndex: 0, memberIndexes: [1, 2], label: 'Sortie parc' },
        { day: 2, timeSlotIndex: 2, memberIndexes: [0, 1, 2], label: 'Cinéma' },
      ],
    },
  },
  {
    id: 'loisirs-rotation-animateurs',
    persona: 'centres-loisirs',
    useCase: 'Planning rotation animateurs',
    title: 'Planning rotation équipe',
    description:
      'Gérez la rotation des animateurs sur les différents groupes et activités. Assurez une répartition équitable.',
    icon: 'Users',
    config: {
      activeDays: [0, 1, 2, 3, 4], // Lundi à Vendredi
      timeSlots: [
        { start: '08:00', end: '12:00', label: 'Matinée' },
        { start: '12:00', end: '14:00', label: 'Pause déjeuner' },
        { start: '14:00', end: '18:00', label: 'Après-midi' },
      ],
      members: [
        { name: 'Julie (anim.)' },
        { name: 'Thomas (anim.)' },
        { name: 'Sophie (anim.)' },
        { name: 'Marc (anim.)' },
        { name: 'Directeur' },
      ],
      blocks: [
        // Lundi
        { day: 0, timeSlotIndex: 0, memberIndexes: [0], label: 'Groupe 3-6 ans' },
        { day: 0, timeSlotIndex: 0, memberIndexes: [1], label: 'Groupe 7-10 ans' },
        { day: 0, timeSlotIndex: 0, memberIndexes: [2], label: 'Groupe 11-14 ans' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [0, 1, 2, 3], label: 'Cantine' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [1], label: 'Groupe 3-6 ans' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [2], label: 'Groupe 7-10 ans' },
        { day: 0, timeSlotIndex: 2, memberIndexes: [3], label: 'Groupe 11-14 ans' },
        // Mardi
        { day: 1, timeSlotIndex: 0, memberIndexes: [2], label: 'Groupe 3-6 ans' },
        { day: 1, timeSlotIndex: 0, memberIndexes: [3], label: 'Groupe 7-10 ans' },
        { day: 1, timeSlotIndex: 0, memberIndexes: [0], label: 'Groupe 11-14 ans' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [0], label: 'Groupe 3-6 ans' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [1], label: 'Groupe 7-10 ans' },
        { day: 1, timeSlotIndex: 2, memberIndexes: [4], label: 'Administratif' },
      ],
    },
  },
  {
    id: 'loisirs-stages-vacances',
    persona: 'centres-loisirs',
    useCase: 'Planning stages vacances',
    title: 'Planning stages vacances',
    description:
      'Planifiez les stages thématiques des vacances : sports, arts, nature. Organisez sorties et ateliers spéciaux.',
    icon: 'Tent',
    config: {
      activeDays: [0, 1, 2, 3, 4], // Lundi à Vendredi (semaine de vacances)
      timeSlots: [
        { start: '09:00', end: '12:00', label: 'Matinée stage' },
        { start: '14:00', end: '17:00', label: 'Après-midi stage' },
      ],
      members: [
        { name: 'Stage Nature' },
        { name: 'Stage Arts' },
        { name: 'Stage Sports' },
        { name: 'Stage Sciences' },
      ],
      blocks: [
        // Lundi - Lancement stages
        { day: 0, timeSlotIndex: 0, memberIndexes: [0], label: 'Randonnée forêt' },
        { day: 0, timeSlotIndex: 0, memberIndexes: [1], label: 'Peinture créative' },
        { day: 0, timeSlotIndex: 0, memberIndexes: [2], label: 'Multi-sports' },
        { day: 0, timeSlotIndex: 0, memberIndexes: [3], label: 'Expériences' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [0], label: 'Construction cabane' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [1], label: 'Sculpture argile' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [2], label: 'Tournoi foot' },
        { day: 0, timeSlotIndex: 1, memberIndexes: [3], label: 'Robotique' },
        // Mercredi - Sortie spéciale
        { day: 2, timeSlotIndex: 0, memberIndexes: [0], label: 'Parc animalier' },
        { day: 2, timeSlotIndex: 0, memberIndexes: [1], label: 'Musée d\'art' },
        { day: 2, timeSlotIndex: 0, memberIndexes: [2], label: 'Piscine' },
        { day: 2, timeSlotIndex: 0, memberIndexes: [3], label: 'Planétarium' },
        { day: 2, timeSlotIndex: 1, memberIndexes: [0, 1, 2, 3], label: 'Retour + goûter' },
        // Vendredi - Spectacle final
        { day: 4, timeSlotIndex: 0, memberIndexes: [0], label: 'Préparation expo' },
        { day: 4, timeSlotIndex: 0, memberIndexes: [1], label: 'Vernissage' },
        { day: 4, timeSlotIndex: 0, memberIndexes: [2], label: 'Olympiades' },
        { day: 4, timeSlotIndex: 0, memberIndexes: [3], label: 'Présentation projets' },
        { day: 4, timeSlotIndex: 1, memberIndexes: [0, 1, 2, 3], label: 'Spectacle parents' },
      ],
    },
  },
]
