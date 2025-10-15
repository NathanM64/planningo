import { track } from '@vercel/analytics'

/**
 * Tracking des événements utilisateur pour analytics
 * Utilise Vercel Analytics pour le suivi des conversions
 */

export const analytics = {
  // Événements d'authentification
  signUp: (email: string) => {
    track('user_signup', { email })
  },

  signIn: (email: string) => {
    track('user_signin', { email })
  },

  signOut: () => {
    track('user_signout')
  },

  // Événements de création/édition
  createAgenda: (mode: 'test' | 'free' | 'pro') => {
    track('agenda_created', { mode })
  },

  addMember: (mode: 'test' | 'free' | 'pro', memberCount: number) => {
    track('member_added', { mode, memberCount })
  },

  addBlock: (mode: 'test' | 'free' | 'pro', blockCount: number) => {
    track('block_added', { mode, blockCount })
  },

  // Événements de conversion
  upgradeModalShown: (from: 'test' | 'free', trigger: 'member_limit' | 'agenda_limit' | 'pdf_watermark' | 'manual') => {
    track('upgrade_modal_shown', { from, trigger })
  },

  upgradeModalClosed: (from: 'test' | 'free', action: 'cancel' | 'outside_click') => {
    track('upgrade_modal_closed', { from, action })
  },

  checkoutStarted: (plan: 'free' | 'pro', source: 'dashboard' | 'editor' | 'pricing') => {
    track('checkout_started', { plan, source })
  },

  checkoutCompleted: (plan: 'free' | 'pro', amount: number) => {
    track('checkout_completed', { plan, amount })
  },

  // Événements PDF
  pdfExported: (mode: 'test' | 'free' | 'pro', memberCount: number, blockCount: number) => {
    track('pdf_exported', { mode, memberCount, blockCount })
  },

  // Événements pricing page
  pricingViewed: () => {
    track('pricing_page_viewed')
  },

  pricingPlanClicked: (plan: 'test' | 'free' | 'pro') => {
    track('pricing_plan_clicked', { plan })
  },

  // Événements d'engagement
  dashboardVisited: (agendaCount: number) => {
    track('dashboard_visited', { agendaCount })
  },

  editorVisited: (mode: 'test' | 'free' | 'pro') => {
    track('editor_visited', { mode })
  },
}
