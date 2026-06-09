-- Update master invite token from DCPG2026 to INNERCIRCLE.
-- Creates the invites table first if it does not already exist.

CREATE TABLE IF NOT EXISTS public.invites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token       TEXT NOT NULL UNIQUE,
  label       TEXT,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rename the old token if it exists
UPDATE public.invites SET token = 'INNERCIRCLE' WHERE token = 'DCPG2026';

-- Insert the master invite if neither old nor new token is present
INSERT INTO public.invites (token, label, active)
SELECT 'INNERCIRCLE', 'Member invite link', true
WHERE NOT EXISTS (SELECT 1 FROM public.invites WHERE token = 'INNERCIRCLE');
