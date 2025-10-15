import { format, addDays, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'

// Jours de la semaine en français
export const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
]

// Heures par défaut (9h-18h)
export const DEFAULT_HOURS = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9
  return `${hour.toString().padStart(2, '0')}:00`
})

// Formater une date en format lisible français
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMMM yyyy', { locale: fr })
}

// Formater une heure (HH:MM)
export const formatTime = (time: string): string => {
  return time.slice(0, 5) // "09:00:00" -> "09:00"
}

// Obtenir les dates de la semaine courante
export const getCurrentWeekDates = (): Date[] => {
  const today = new Date()
  const start = startOfWeek(today, { weekStartsOn: 1 }) // Commence lundi
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

// Vérifier si une heure est valide
export const isValidTime = (time: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(time)
}

// Calculer la durée entre deux heures en minutes
export const getDurationMinutes = (start: string, end: string): number => {
  const [startHour, startMin] = start.split(':').map(Number)
  const [endHour, endMin] = end.split(':').map(Number)
  return endHour * 60 + endMin - (startHour * 60 + startMin)
}

// Convertir des minutes en format "Xh Ymin"
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}
