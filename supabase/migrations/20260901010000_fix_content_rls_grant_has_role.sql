-- Ensure has_role function is executable by authenticated users
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Add a simple status-only policy so published content is always readable
-- without relying on has_role (which may not work if grants are missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'content'
      AND policyname = 'Published content readable'
  ) THEN
    CREATE POLICY "Published content readable" ON public.content
      FOR SELECT TO authenticated
      USING (status = 'published');
  END IF;
END $$;
