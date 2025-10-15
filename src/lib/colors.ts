// Palette de couleurs Planningo - "Classic + Moderne"
// Bleu classique web + touches modernes

export const colors = {
  // Brand (bleu classique)
  brand: {
    primary: '#0000EE', // Classic Link Blue - logo, boutons, liens
    hover: '#0000CC', // Plus foncé au hover
    active: '#000099', // Encore plus foncé en active
  },

  // Accent (orange chaud)
  accent: {
    primary: '#F59E0B', // amber-500 - actions secondaires
    hover: '#D97706', // amber-600
    active: '#B45309', // amber-700
  },

  // Backgrounds
  background: {
    primary: '#FFFFFF', // Blanc pur pour le contenu
    secondary: '#F9FAFB', // gray-50 - Canvas, sidebar
    tertiary: '#F3F4F6', // gray-100 - Hover states
  },

  // Texte
  text: {
    primary: '#111827', // gray-900 - Titres et texte principal
    secondary: '#4B5563', // gray-600 - Labels et légendes
    muted: '#6B7280', // gray-500 - Texte désactivé
  },

  // Bordures et séparateurs
  border: {
    default: '#E5E7EB', // gray-200 - Séparation des zones
    medium: '#D1D5DB', // gray-300 - Bordures plus visibles
    dark: '#9CA3AF', // gray-400 - Bordures accentuées
  },

  // États
  success: '#10B981', // green-500
  warning: '#F59E0B', // amber-500
  error: '#EF4444', // red-500
  info: '#0000EE', // Brand blue
}

// Couleurs pour les créneaux d'agenda
// Optimisées pour WCAG AA (ratio ≥ 4.5:1 sur fond blanc)
export const blockColors = [
  {
    name: 'Bleu',
    value: '#1D4ED8', // blue-700 - WCAG AA (7.0:1)
    light: '#DBEAFE', // blue-100
    text: '#1E3A8A', // blue-900
    border: '#1E40AF', // blue-800
    pattern: 'solid',
  },
  {
    name: 'Vert',
    value: '#047857', // green-700 - WCAG AA (5.9:1)
    light: '#D1FAE5', // green-100
    text: '#065F46', // green-900
    border: '#065F46', // green-800
    pattern: 'dots',
  },
  {
    name: 'Rouge',
    value: '#DC2626', // red-600 - WCAG AA (5.9:1)
    light: '#FEE2E2', // red-100
    text: '#7F1D1D', // red-900
    border: '#B91C1C', // red-700
    pattern: 'diagonal',
  },
  {
    name: 'Orange',
    value: '#C2410C', // orange-700 - WCAG AA (6.3:1)
    light: '#FFEDD5', // orange-100
    text: '#7C2D12', // orange-900
    border: '#9A3412', // orange-800
    pattern: 'horizontal',
  },
  {
    name: 'Violet',
    value: '#6D28D9', // violet-700 - WCAG AA (7.1:1)
    light: '#EDE9FE', // violet-100
    text: '#4C1D95', // violet-900
    border: '#5B21B6', // violet-800
    pattern: 'vertical',
  },
  {
    name: 'Rose',
    value: '#BE185D', // pink-700 - WCAG AA (7.6:1)
    light: '#FCE7F3', // pink-100
    text: '#831843', // pink-900
    border: '#9F1239', // pink-800
    pattern: 'solid',
  },
  {
    name: 'Cyan',
    value: '#0E7490', // cyan-700 - WCAG AA (5.1:1)
    light: '#CFFAFE', // cyan-100
    text: '#164E63', // cyan-900
    border: '#155E75', // cyan-800
    pattern: 'dots',
  },
  {
    name: 'Indigo',
    value: '#4338CA', // indigo-700 - WCAG AA (7.7:1)
    light: '#E0E7FF', // indigo-100
    text: '#312E81', // indigo-900
    border: '#3730A3', // indigo-800
    pattern: 'diagonal',
  },
]

// Helper pour obtenir une couleur aléatoire
export const getRandomBlockColor = () => {
  return blockColors[Math.floor(Math.random() * blockColors.length)]
}

// Couleurs optimisées pour l'impression
export const printColors = {
  text: '#000000',
  border: '#374151', // gray-700
  background: '#FFFFFF',
  gridLines: '#E5E7EB', // gray-200
}
