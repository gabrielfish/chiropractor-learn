
-- Allow any authenticated user to read profiles of authors and super_admins (for "Taught by" display)
CREATE POLICY "Authenticated can read author profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(id, 'author') OR public.has_role(id, 'super_admin')
);

-- Allow super_admin to update any profile (to edit author profiles)
CREATE POLICY "Super admin can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Allow authenticated users to update their own profile (in case it's missing)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users update own profile'
  ) THEN
    CREATE POLICY "Users update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;
