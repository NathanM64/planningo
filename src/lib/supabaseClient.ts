import { createClient } from '@supabase/supabase-js'

// Récupère les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérifie que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase non configuré. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local'
  )
}

// Crée le client Supabase
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper pour vérifier si Supabase est configuré
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
