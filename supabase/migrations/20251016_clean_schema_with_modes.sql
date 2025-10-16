-- ========================================
-- PLANNINGO - Schéma propre avec modes et cycles
-- Date: 16 Octobre 2025
-- Description: Remplace complètement l'ancien schéma
-- ========================================

-- 1. SUPPRESSION DE L'ANCIEN SCHÉMA (tables agendas uniquement)
-- ========================================

DROP TABLE IF EXISTS public.blocks_members CASCADE;
DROP TABLE IF EXISTS public.blocks CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.agendas CASCADE;

-- 2. CRÉATION DU NOUVEAU SCHÉMA
-- ========================================

-- Table des agendas (architecture extensible)
CREATE TABLE public.agendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,

  -- Mode et configuration (JSONB pour extensibilité)
  mode_config JSONB NOT NULL DEFAULT '{"mode": "simple"}'::jsonb,

  -- Affichage des créneaux
  time_slot_display TEXT NOT NULL DEFAULT 'precise-hours'
    CHECK (time_slot_display IN ('precise-hours', 'fixed-periods', 'full-day')),
  fixed_periods JSONB DEFAULT NULL,

  -- Jours actifs (0=dimanche, 1=lundi, ..., 6=samedi)
  active_days INTEGER[] NOT NULL DEFAULT ARRAY[1,2,3,4,5,6,0],

  -- Navigation
  current_week_start TEXT NOT NULL,

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des membres
CREATE TABLE public.members (
  id UUID PRIMARY KEY,
  agenda_id UUID NOT NULL REFERENCES public.agendas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des blocs (avec support pattern pour cycles)
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY,
  agenda_id UUID NOT NULL REFERENCES public.agendas(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  label TEXT,
  pattern_id UUID DEFAULT NULL,  -- Référence au bloc source si généré par cycle
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de liaison Many-to-Many entre blocks et members
CREATE TABLE public.blocks_members (
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (block_id, member_id)
);

-- 3. INDEX POUR PERFORMANCES
-- ========================================

CREATE INDEX idx_agendas_user_id ON public.agendas(user_id);
CREATE INDEX idx_agendas_mode_config ON public.agendas USING GIN (mode_config);

CREATE INDEX idx_members_agenda_id ON public.members(agenda_id);

CREATE INDEX idx_blocks_agenda_id ON public.blocks(agenda_id);
CREATE INDEX idx_blocks_date ON public.blocks(date);
CREATE INDEX idx_blocks_pattern_id ON public.blocks(pattern_id) WHERE pattern_id IS NOT NULL;

CREATE INDEX idx_blocks_members_block_id ON public.blocks_members(block_id);
CREATE INDEX idx_blocks_members_member_id ON public.blocks_members(member_id);

-- 4. FONCTION POUR AUTO-UPDATE DU TIMESTAMP
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agendas_updated_at
  BEFORE UPDATE ON public.agendas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE public.agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks_members ENABLE ROW LEVEL SECURITY;

-- Politiques pour agendas
CREATE POLICY "Users can view their own agendas"
  ON public.agendas FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create agendas"
  ON public.agendas FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own agendas"
  ON public.agendas FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own agendas"
  ON public.agendas FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Politiques pour members
CREATE POLICY "Users can view members of their agendas"
  ON public.members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = members.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

CREATE POLICY "Users can create members in their agendas"
  ON public.members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = members.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

CREATE POLICY "Users can update members in their agendas"
  ON public.members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = members.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

CREATE POLICY "Users can delete members in their agendas"
  ON public.members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = members.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

-- Politiques pour blocks
CREATE POLICY "Users can view blocks of their agendas"
  ON public.blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = blocks.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

CREATE POLICY "Users can create blocks in their agendas"
  ON public.blocks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = blocks.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

CREATE POLICY "Users can update blocks in their agendas"
  ON public.blocks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = blocks.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

CREATE POLICY "Users can delete blocks in their agendas"
  ON public.blocks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.agendas
      WHERE agendas.id = blocks.agenda_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

-- Politiques pour blocks_members
CREATE POLICY "Users can view blocks_members of their agendas"
  ON public.blocks_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blocks
      JOIN public.agendas ON agendas.id = blocks.agenda_id
      WHERE blocks.id = blocks_members.block_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

CREATE POLICY "Users can manage blocks_members in their agendas"
  ON public.blocks_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.blocks
      JOIN public.agendas ON agendas.id = blocks.agenda_id
      WHERE blocks.id = blocks_members.block_id
      AND (agendas.user_id = auth.uid() OR agendas.user_id IS NULL)
    )
  );

-- 6. COMMENTAIRES POUR DOCUMENTATION
-- ========================================

COMMENT ON COLUMN public.agendas.mode_config IS
  'Configuration du mode d''agenda (type discriminé JSONB). Exemples:
   - {"mode": "simple"} pour planning libre
   - {"mode": "cycle", "cycleConfig": {"cycleWeeks": 3, "repeatIndefinitely": true}} pour roulement';

COMMENT ON COLUMN public.agendas.time_slot_display IS
  'Mode d''affichage des créneaux: precise-hours | fixed-periods | full-day';

COMMENT ON COLUMN public.agendas.fixed_periods IS
  'Périodes fixes (JSONB) si time_slot_display = fixed-periods. Format: [{"id": "morning", "label": "Matin", "defaultStart": "08:00", "defaultEnd": "12:00"}, ...]';

COMMENT ON COLUMN public.agendas.active_days IS
  'Jours actifs (0=dimanche, 1=lundi, ..., 6=samedi). Exemple: [1,2,3,4,5] = lun-ven';

COMMENT ON COLUMN public.blocks.pattern_id IS
  'ID du bloc source si ce bloc est généré par un cycle. NULL si créé manuellement';

-- ========================================
-- FIN DU SCRIPT
-- ========================================

SELECT 'Migration terminée ! Nouveau schéma propre avec modes créé.' AS status;
