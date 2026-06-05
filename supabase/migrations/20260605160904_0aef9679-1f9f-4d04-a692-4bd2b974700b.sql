
-- 1. user_roles INSERT: only super_admins can assign roles, and explicitly prevent
-- any path where a user could self-assign super_admin. Bootstrap (first super_admin)
-- must be done via service_role (SQL/admin), which bypasses RLS.
DROP POLICY IF EXISTS "Super admins insert roles" ON public.user_roles;

CREATE POLICY "Super admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin'::app_role)
  AND NOT (user_id = auth.uid() AND role = 'super_admin'::app_role)
);

-- Also harden UPDATE so an admin can't escalate themselves or change a row into super_admin self-assignment
DROP POLICY IF EXISTS "Super admins update roles" ON public.user_roles;

CREATE POLICY "Super admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin'::app_role)
  AND NOT (user_id = auth.uid() AND role = 'super_admin'::app_role)
);

-- 2. comments SELECT: members only see comments on published content.
-- Admins and authors still see everything.
DROP POLICY IF EXISTS "Comments readable by authenticated" ON public.comments;

CREATE POLICY "Comments readable by authenticated"
ON public.comments
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin'::app_role)
  OR public.has_role(auth.uid(), 'author'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.content c
    WHERE c.id = comments.content_id
      AND c.status = 'published'::content_status
  )
);
