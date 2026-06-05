
DROP POLICY IF EXISTS "Super admins insert non-admin roles" ON public.user_roles;
CREATE POLICY "Super admins insert non-admin roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role)
  AND role <> 'super_admin'::app_role
);

DROP POLICY IF EXISTS "Users create own comments" ON public.comments;
CREATE POLICY "Users create own comments"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND flagged = false
);
