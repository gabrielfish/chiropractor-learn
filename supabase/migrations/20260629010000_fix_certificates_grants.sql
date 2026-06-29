-- Grant table-level INSERT/UPDATE/DELETE privileges to all Supabase roles.
-- Tables created via SQL migrations do not inherit the auto-grants that
-- Dashboard-created tables receive. This caused INSERT to fail silently
-- even when using the service_role client.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO service_role;

-- Allow any authenticated user to insert a certificate for themselves.
-- The service_role bypasses RLS entirely, but this policy ensures the
-- authenticated role can also write (fallback if service_role grant is absent).
CREATE POLICY "Users can insert their own certificates"
  ON public.certificates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to see only their own certificates when using the user client.
-- The existing "Certificates are publicly viewable" policy allows SELECT on all
-- rows which is correct for the shareable certificate page using supabaseAdmin.
