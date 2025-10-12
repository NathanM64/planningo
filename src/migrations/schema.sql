-- ========================================
-- PLANNINGO - Script de migration complet v2
-- Avec support de plusieurs membres par bloc
-- ========================================

-- 1. SUPPRESSION DE L'ANCIEN SCHÉMA
-- ========================================

-- Supprimer les anciennes tables et leurs dépendances
-- L'ordre est important : d'abord les tables de liaison, puis les tables principales
DROP TABLE IF EXISTS public.blocks_members CASCADE;
DROP TABLE IF EXISTS public.blocks CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.agendas CASCADE;

-- Supprimer la fonction si elle existe
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 2. CRÉATION DU NOUVEAU SCHÉMA (4 TABLES)
-- ========================================

-- Table des agendas
CREATE TABLE public.agendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  layout TEXT NOT NULL DEFAULT 'weekly' CHECK (layout IN ('daily', 'weekly', 'monthly')),
  current_week_start TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des membres
CREATE TABLE public.members (
  id UUID PRIMARY KEY,
  agenda_id UUID NOT NULL REFERENCES public.agendas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des blocs (sans member_id direct)
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY,
  agenda_id UUID NOT NULL REFERENCES public.agendas(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison Many-to-Many entre blocks et members
CREATE TABLE public.blocks_members (
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (block_id, member_id)
);

-- 3. INDEX POUR PERFORMANCES
-- ========================================

CREATE INDEX idx_agendas_user_id ON public.agendas(user_id);
CREATE INDEX idx_members_agenda_id ON public.members(agenda_id);
CREATE INDEX idx_blocks_agenda_id ON public.blocks(agenda_id);
CREATE INDEX idx_blocks_date ON public.blocks(date);
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

-- 6. DONNÉES DE TEST (OPTIONNEL)
-- ========================================

/*
-- Agenda de test
INSERT INTO public.agendas (id, name, layout, current_week_start)
VALUES ('a1111111-1111-1111-1111-111111111111', 'Salon de coiffure', 'weekly', '2025-01-06');

-- Membres
INSERT INTO public.members (id, agenda_id, name, color) VALUES
  ('m1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Alice', '#3B82F6'),
  ('m2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Bob', '#10B981'),
  ('m3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'Charlie', '#F59E0B');

-- Bloc avec UN seul membre
INSERT INTO public.blocks (id, agenda_id, date, start_time, end_time, label)
VALUES ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '2025-01-06', '09:00', '12:00', 'Matin');

INSERT INTO public.blocks_members (block_id, member_id)
VALUES ('b1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111');

-- Bloc avec PLUSIEURS membres (réunion)
INSERT INTO public.blocks (id, agenda_id, date, start_time, end_time, label)
VALUES ('b2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', '2025-01-07', '14:00', '16:00', 'Réunion équipe');

INSERT INTO public.blocks_members (block_id, member_id) VALUES
  ('b2222222-2222-2222-2222-222222222222', 'm1111111-1111-1111-1111-111111111111'),
  ('b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222'),
  ('b2222222-2222-2222-2222-222222222222', 'm3333333-3333-3333-3333-333333333333');
*/

-- ========================================
-- FIN DU SCRIPT
-- ========================================

SELECT 'Migration terminée ! 4 tables créées : agendas, members, blocks, blocks_members' AS status;