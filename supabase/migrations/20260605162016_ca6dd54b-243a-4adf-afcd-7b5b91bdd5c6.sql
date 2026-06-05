
-- Remove the over-broad policy that exposed email/phone
DROP POLICY IF EXISTS "Authenticated can read profile name/avatar via view" ON public.profiles;

-- Recreate view WITHOUT security_invoker so it runs as the view owner
-- (postgres), bypassing profiles RLS — but the view only selects safe columns,
-- so email and phone are never reachable through it.
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT id, full_name, avatar_url
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated;
