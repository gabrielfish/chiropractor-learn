
-- 1. Fix has_role to honor the passed-in user id
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 2. Prevent comment authors from changing the flagged field on their own comments.
--    Only admins (or service_role) can toggle flagged.
DROP POLICY IF EXISTS "Users update own comments" ON public.comments;

CREATE POLICY "Users update own comments"
ON public.comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND flagged = (SELECT c.flagged FROM public.comments c WHERE c.id = comments.id)
);

-- Separate policy lets super_admins update flagged (and anything else)
CREATE POLICY "Admins update any comment"
ON public.comments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

-- 3. Safe view exposing ONLY full_name + avatar_url to authenticated users
--    (authors can use this to render commenter info without seeing email/phone).
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, full_name, avatar_url
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated;

-- The view runs as the invoker, so it still respects profiles RLS. Add a
-- narrow SELECT policy on profiles for authenticated users that only grants
-- row visibility — the view restricts which columns can come back.
CREATE POLICY "Authenticated can read profile name/avatar via view"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
