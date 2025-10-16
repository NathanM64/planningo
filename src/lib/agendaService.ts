// src/lib/agendaService.ts - Version avec support multi-membres par bloc et cycles
import { createClient } from './supabase/client'
import { Agenda, AgendaBlock, formatDateISO } from '@/types/agenda'

/**
 * Service pour gérer les agendas dans Supabase
 * Version avec support de plusieurs membres par bloc (relation Many-to-Many) et cycles
 */

// Helper pour vérifier si Supabase est configuré
function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/**
 * Génère les blocs pour une semaine donnée en mode cycle
 * @param agenda - L'agenda en mode cycle
 * @param weekStart - Date de début de semaine (format ISO)
 * @returns Les blocs générés pour cette semaine
 */
function generateCycleBlocksForWeek(
  agenda: Agenda,
  weekStart: string
): AgendaBlock[] {
  // Vérifier que c'est bien un agenda en mode cycle
  if (agenda.modeConfig.mode !== 'cycle') {
    return []
  }

  const { cycleConfig } = agenda.modeConfig
  const cycleWeeks = cycleConfig.cycleWeeks

  // Calculer le nombre de semaines écoulées depuis le début de l'agenda
  const startDate = new Date(agenda.currentWeekStart)
  const targetDate = new Date(weekStart)
  const weeksDiff = Math.floor(
    (targetDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  )

  // Déterminer à quelle semaine du cycle on est
  const cycleWeekIndex = weeksDiff % cycleWeeks

  // Filtrer les blocs pattern de cette semaine du cycle
  const patternBlocks = agenda.blocks.filter((block) => {
    const blockDate = new Date(block.date)
    const blockWeekStart = new Date(agenda.currentWeekStart)
    const blockWeeksDiff = Math.floor(
      (blockDate.getTime() - blockWeekStart.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    )
    return blockWeeksDiff === cycleWeekIndex
  })

  // Générer les blocs pour la semaine cible
  return patternBlocks.map((pattern) => {
    const patternDate = new Date(pattern.date)
    const dayOffset = patternDate.getDay()
    const targetBlockDate = new Date(weekStart)
    targetBlockDate.setDate(targetBlockDate.getDate() + dayOffset)

    return {
      ...pattern,
      id: `${pattern.id}-w${weeksDiff}`, // ID unique généré
      date: formatDateISO(targetBlockDate),
      patternId: pattern.patternId || pattern.id, // Référence au pattern source
    }
  })
}

/**
 * Récupère tous les blocs d'un agenda pour une semaine donnée
 * Inclut les blocs générés à la volée si mode = cycle
 * @param agenda - L'agenda
 * @param weekStart - Date de début de semaine
 * @returns Tous les blocs de la semaine (réels + générés)
 */
export function getBlocksForWeek(
  agenda: Agenda,
  weekStart: string
): AgendaBlock[] {
  if (agenda.modeConfig.mode === 'simple') {
    // Mode simple : retourner uniquement les blocs réels
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    return agenda.blocks.filter((block) => {
      const blockDate = new Date(block.date)
      return blockDate >= new Date(weekStart) && blockDate < weekEnd
    })
  } else if (agenda.modeConfig.mode === 'cycle') {
    // Mode cycle : générer les blocs pour cette semaine
    return generateCycleBlocksForWeek(agenda, weekStart)
  }

  return []
}

// ========== SAUVEGARDER UN AGENDA ==========

export async function saveAgenda(agenda: Agenda): Promise<{
  success: boolean
  error?: string
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase non configuré. Vérifiez vos variables d'environnement.",
    }
  }

  try {
    const supabase = createClient()

    // Récupérer le user_id de la session active
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Utilisateur non authentifié. Veuillez vous connecter.',
      }
    }

    // 1. Sauvegarder l'agenda principal
    const { error: agendaError } = await supabase.from('agendas').upsert({
      id: agenda.id,
      user_id: user.id,
      name: agenda.name,
      current_week_start: agenda.currentWeekStart,
      // Nouvelles propriétés
      mode_config: agenda.modeConfig,
      time_slot_display: agenda.timeSlotDisplay,
      fixed_periods: agenda.fixedPeriods || null,
      active_days: agenda.activeDays,
      updated_at: new Date().toISOString(),
    })

    if (agendaError) throw agendaError

    // 2. Supprimer les anciennes relations (members, blocks, blocks_members)
    await supabase.from('members').delete().eq('agenda_id', agenda.id)
    await supabase.from('blocks').delete().eq('agenda_id', agenda.id)
    // blocks_members sera supprimé automatiquement grâce au CASCADE

    // 3. Sauvegarder les membres
    if (agenda.members.length > 0) {
      const membersToInsert = agenda.members.map((member) => ({
        id: member.id,
        agenda_id: agenda.id,
        name: member.name,
        color: member.color,
      }))

      const { error: membersError } = await supabase
        .from('members')
        .insert(membersToInsert)

      if (membersError) throw membersError
    }

    // 4. Sauvegarder les blocs ET leurs relations avec les membres
    if (agenda.blocks.length > 0) {
      // 4a. Insérer les blocs
      const blocksToInsert = agenda.blocks.map((block) => ({
        id: block.id,
        agenda_id: agenda.id,
        date: block.date,
        start_time: block.start,
        end_time: block.end,
        label: block.label || null,
        pattern_id: block.patternId || null, // Pour les blocs générés par cycle
      }))

      const { error: blocksError } = await supabase
        .from('blocks')
        .insert(blocksToInsert)

      if (blocksError) throw blocksError

      // 4b. Insérer les relations blocks_members
      const blocksMembersToInsert = agenda.blocks.flatMap((block) =>
        block.memberIds.map((memberId) => ({
          block_id: block.id,
          member_id: memberId,
        }))
      )

      if (blocksMembersToInsert.length > 0) {
        const { error: bmError } = await supabase
          .from('blocks_members')
          .insert(blocksMembersToInsert)

        if (bmError) throw bmError
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

// ========== CHARGER UN AGENDA ==========

export async function loadAgenda(agendaId: string): Promise<{
  success: boolean
  data?: Agenda
  error?: string
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase non configuré.',
    }
  }

  try {
    const supabase = createClient()

    // 1. Charger l'agenda
    const { data: agendaData, error: agendaError } = await supabase
      .from('agendas')
      .select('*')
      .eq('id', agendaId)
      .single()

    if (agendaError) throw agendaError

    // 2. Charger les membres
    const { data: membersData, error: membersError } = await supabase
      .from('members')
      .select('*')
      .eq('agenda_id', agendaId)

    if (membersError) throw membersError

    // 3. Charger les blocs
    const { data: blocksData, error: blocksError } = await supabase
      .from('blocks')
      .select('*')
      .eq('agenda_id', agendaId)

    if (blocksError) throw blocksError

    // 4. Charger les relations blocks_members
    const { data: blocksMembersData, error: bmError } = await supabase
      .from('blocks_members')
      .select('block_id, member_id')
      .in(
        'block_id',
        blocksData.map((b) => b.id)
      )

    if (bmError) throw bmError

    // 5. Regrouper les memberIds par block_id
    const memberIdsByBlock = blocksMembersData.reduce((acc, bm) => {
      if (!acc[bm.block_id]) {
        acc[bm.block_id] = []
      }
      acc[bm.block_id].push(bm.member_id)
      return acc
    }, {} as Record<string, string[]>)

    // 6. Reconstruire l'objet Agenda
    const agenda: Agenda = {
      id: agendaData.id,
      user_id: agendaData.user_id,
      name: agendaData.name,
      currentWeekStart: agendaData.current_week_start,
      // Nouvelles propriétés
      modeConfig: agendaData.mode_config,
      timeSlotDisplay: agendaData.time_slot_display,
      fixedPeriods: agendaData.fixed_periods || undefined,
      activeDays: agendaData.active_days,
      members: membersData.map((m) => ({
        id: m.id,
        name: m.name,
        color: m.color,
      })),
      blocks: blocksData.map((b) => ({
        id: b.id,
        memberIds: memberIdsByBlock[b.id] || [],
        date: b.date,
        start: b.start_time,
        end: b.end_time,
        label: b.label || undefined,
        patternId: b.pattern_id || undefined,
      })),
      created_at: agendaData.created_at,
      updated_at: agendaData.updated_at,
    }

    return { success: true, data: agenda }
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

// ========== CHARGER TOUS LES AGENDAS ==========

export async function loadAllAgendas(userId?: string): Promise<{
  success: boolean
  data?: Array<{
    id: string
    name: string
    created_at: string
    updated_at: string
    members?: Array<{ id: string; name: string; color: string }>
  }>
  error?: string
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase non configuré.',
    }
  }

  try {
    const supabase = createClient()

    // OPTIMISATION: Charger agendas ET membres en une seule requete (evite N+1)
    let query = supabase
      .from('agendas')
      .select(
        `
        id,
        name,
        created_at,
        updated_at,
        members (
          id,
          name,
          color
        )
      `
      )

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('updated_at', {
      ascending: false,
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erreur lors du chargement des agendas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

// ========== SUPPRIMER UN AGENDA ==========

export async function deleteAgenda(agendaId: string): Promise<{
  success: boolean
  error?: string
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase non configuré.',
    }
  }

  try {
    const supabase = createClient()

    const { error } = await supabase.from('agendas').delete().eq('id', agendaId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}
