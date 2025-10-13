-- Table pour l'idempotence des webhooks Stripe
-- Evite le rejouage des memes evenements

CREATE TABLE IF NOT EXISTS stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE, -- ID de l'event Stripe (ex: evt_xxx)
  event_type TEXT NOT NULL, -- Type d'event (ex: checkout.session.completed)
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_stripe_events_event_id ON stripe_events(event_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed_at ON stripe_events(processed_at);

-- RLS: Pas de policies car acces uniquement via Service Role Key
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- Cleanup automatique des events de plus de 30 jours (optionnel)
-- A executer periodiquement ou via une fonction cron
-- DELETE FROM stripe_events WHERE processed_at < NOW() - INTERVAL '30 days';
