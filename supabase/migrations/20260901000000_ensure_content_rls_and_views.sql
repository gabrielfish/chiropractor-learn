-- Ensure content table RLS allows authenticated users to read published rows
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'content'
      AND policyname = 'Members read published content'
  ) THEN
    CREATE POLICY "Members read published content" ON public.content
      FOR SELECT TO authenticated
      USING (
        status = 'published'
        OR public.has_role(auth.uid(), 'super_admin')
        OR public.has_role(auth.uid(), 'author')
      );
  END IF;
END $$;

-- Ensure categories table is readable
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'categories'
      AND policyname = 'Categories readable by all'
  ) THEN
    CREATE POLICY "Categories readable by all" ON public.categories
      FOR SELECT USING (true);
  END IF;
END $$;

GRANT SELECT ON public.categories TO authenticated, anon;

-- Ensure author_profiles_public view exists
CREATE OR REPLACE VIEW public.author_profiles_public AS
SELECT id, full_name, avatar_url, job_title, bio
FROM public.profiles
WHERE public.has_role(id, 'author'::public.app_role)
   OR public.has_role(id, 'super_admin'::public.app_role);

ALTER VIEW public.author_profiles_public SET (security_invoker = off);
GRANT SELECT ON public.author_profiles_public TO authenticated, anon;
