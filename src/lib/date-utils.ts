// src/lib/date-utils.ts
/**
 * Utilitaires de manipulation de dates pour les vues calendrier
 */

export interface DayInfo {
  date: Date
  dateISO: string // Format: "2025-10-17"
  dayNumber: number // 1-31
  dayOfWeek: number // 0=dimanche, 1=lundi, ..., 6=samedi
  isToday: boolean
  isCurrentMonth: boolean
  isWeekend: boolean
}

/**
 * Récupère tous les jours d'un mois (incluant les jours du mois précédent/suivant pour remplir la grille)
 * Retourne toujours un tableau de 35 ou 42 jours (5 ou 6 semaines complètes)
 */
export function getMonthDays(weekStart: string): DayInfo[] {
  const date = new Date(weekStart)
  const year = date.getFullYear()
  const month = date.getMonth()

  // Premier jour du mois
  const firstDayOfMonth = new Date(year, month, 1)

  // Dernier jour du mois
  const lastDayOfMonth = new Date(year, month + 1, 0)

  // Jour de la semaine du premier jour (0=dim, 1=lun, ...)
  let firstDayOfWeek = firstDayOfMonth.getDay()
  // Convertir pour que lundi = 0
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Date de départ de la grille (peut être dans le mois précédent)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfWeek)

  // Générer 42 jours (6 semaines complètes)
  const days: DayInfo[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    const dayOfWeek = currentDate.getDay()
    const isCurrentMonth = currentDate.getMonth() === month
    const isToday = currentDate.getTime() === today.getTime()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    days.push({
      date: currentDate,
      dateISO: formatDateISO(currentDate),
      dayNumber: currentDate.getDate(),
      dayOfWeek,
      isToday,
      isCurrentMonth,
      isWeekend,
    })
  }

  return days
}

/**
 * Formatte une date en ISO (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Obtient le lundi de la semaine courante
 */
export function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

/**
 * Obtient le premier jour d'un mois
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Obtient le dernier jour d'un mois
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Navigue au mois précédent
 */
export function getPreviousMonth(weekStart: string): string {
  const date = new Date(weekStart)
  date.setMonth(date.getMonth() - 1)
  return formatDateISO(getMonday(date))
}

/**
 * Navigue au mois suivant
 */
export function getNextMonth(weekStart: string): string {
  const date = new Date(weekStart)
  date.setMonth(date.getMonth() + 1)
  return formatDateISO(getMonday(date))
}

/**
 * Formate une date en français (ex: "17 octobre 2025")
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formate un mois et année (ex: "Octobre 2025")
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
}
