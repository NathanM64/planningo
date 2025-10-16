-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.agendas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  mode_config jsonb NOT NULL DEFAULT '{"mode": "simple"}'::jsonb,
  time_slot_display text NOT NULL DEFAULT 'precise-hours'::text CHECK (time_slot_display = ANY (ARRAY['precise-hours'::text, 'fixed-periods'::text, 'full-day'::text])),
  fixed_periods jsonb,
  active_days ARRAY NOT NULL DEFAULT ARRAY[1, 2, 3, 4, 5, 6, 0],
  current_week_start text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agendas_pkey PRIMARY KEY (id),
  CONSTRAINT agendas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.blocks (
  id uuid NOT NULL,
  agenda_id uuid NOT NULL,
  date text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  label text,
  pattern_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blocks_pkey PRIMARY KEY (id),
  CONSTRAINT blocks_agenda_id_fkey FOREIGN KEY (agenda_id) REFERENCES public.agendas(id)
);
CREATE TABLE public.blocks_members (
  block_id uuid NOT NULL,
  member_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blocks_members_pkey PRIMARY KEY (block_id, member_id),
  CONSTRAINT blocks_members_block_id_fkey FOREIGN KEY (block_id) REFERENCES public.blocks(id),
  CONSTRAINT blocks_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  image_data text,
  created_at timestamp with time zone DEFAULT now(),
  read boolean DEFAULT false,
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.members (
  id uuid NOT NULL,
  agenda_id uuid NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (id),
  CONSTRAINT members_agenda_id_fkey FOREIGN KEY (agenda_id) REFERENCES public.agendas(id)
);
CREATE TABLE public.stripe_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  processed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT stripe_events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  is_pro boolean DEFAULT false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);