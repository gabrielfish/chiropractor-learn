-- Certificates table: one row per earned certificate
-- Publicly readable by ID so certificates can be shared/verified
CREATE TABLE IF NOT EXISTS public.certificates (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name      TEXT NOT NULL DEFAULT '',
  type           TEXT NOT NULL CHECK (type IN ('course', 'category')),
  reference_id   TEXT NOT NULL,
  reference_name TEXT NOT NULL,
  issued_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, type, reference_id)
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Anyone can view a certificate by its ID (UUID is unguessable — safe for sharing/LinkedIn)
CREATE POLICY "Certificates are publicly viewable" ON public.certificates
  FOR SELECT USING (true);
