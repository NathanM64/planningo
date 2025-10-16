-- Migration: Add use_case column to agendas table
-- Date: 2025-10-17
-- Description: Adds use_case field to store agenda type (team, rotation, personal, other)

-- Add use_case column with default value 'team'
ALTER TABLE public.agendas
ADD COLUMN use_case TEXT NOT NULL DEFAULT 'team';

-- Add CHECK constraint to validate use_case values
ALTER TABLE public.agendas
ADD CONSTRAINT agendas_use_case_check
CHECK (use_case = ANY (ARRAY['team'::text, 'rotation'::text, 'personal'::text, 'other'::text]));

-- Create index for faster filtering by use_case
CREATE INDEX idx_agendas_use_case ON public.agendas(use_case);

-- Update schema.sql to reflect the new column (documentation)
COMMENT ON COLUMN public.agendas.use_case IS 'Type of agenda: team, rotation, personal, or other';
