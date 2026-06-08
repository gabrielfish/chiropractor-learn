
-- Remove broad SELECT policy that exposed author/admin PII to all authenticated users
DROP POLICY IF EXISTS "Authenticated can read author profiles" ON public.profiles;

-- Public-safe view of author/admin profiles (excludes email, phone, practice_name)
CREATE OR REPLACE VIEW public.author_profiles_public AS
SELECT id, full_name, avatar_url, job_title, bio
FROM public.profiles
WHERE public.has_role(id, 'author'::public.app_role)
   OR public.has_role(id, 'super_admin'::public.app_role);

ALTER VIEW public.author_profiles_public SET (security_invoker = off);
GRANT SELECT ON public.author_profiles_public TO authenticated, anon;

-- Tighten search_logs: require user_id = auth.uid() on insert, allow members to read their own
DROP POLICY IF EXISTS "Users insert own searches" ON public.search_logs;
CREATE POLICY "Users insert own searches"
  ON public.search_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own searches"
  ON public.search_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
