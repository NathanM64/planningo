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
// Versions plus douces que le bleu brand
export const blockColors = [
  {
    name: 'Bleu',
    value: '#3B82F6', // blue-500 (plus doux que #0000EE)
    light: '#DBEAFE', // blue-100
    text: '#1E3A8A', // blue-900
    border: '#2563EB', // blue-600
    pattern: 'solid',
  },
  {
    name: 'Vert',
    value: '#10B981', // green-500
    light: '#D1FAE5', // green-100
    text: '#065F46', // green-900
    border: '#059669', // green-600
    pattern: 'dots',
  },
  {
    name: 'Rouge',
    value: '#F87171', // red-400 (pastel)
    light: '#FEE2E2', // red-100
    text: '#7F1D1D', // red-900
    border: '#EF4444', // red-500
    pattern: 'diagonal',
  },
  {
    name: 'Orange',
    value: '#FB923C', // orange-400
    light: '#FFEDD5', // orange-100
    text: '#7C2D12', // orange-900
    border: '#F97316', // orange-500
    pattern: 'horizontal',
  },
  {
    name: 'Violet',
    value: '#A78BFA', // violet-400
    light: '#EDE9FE', // violet-100
    text: '#4C1D95', // violet-900
    border: '#8B5CF6', // violet-500
    pattern: 'vertical',
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
