
DROP POLICY IF EXISTS "Super admins insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins update roles" ON public.user_roles;

CREATE POLICY "Super admins insert non-admin roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin'::app_role)
  AND role <> 'super_admin'::app_role
);

CREATE POLICY "Super admins update non-admin roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin'::app_role)
  AND role <> 'super_admin'::app_role
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin'::app_role)
  AND role <> 'super_admin'::app_role
);

-- Also prevent deletion of super_admin rows via the app
DROP POLICY IF EXISTS "Super admins delete roles" ON public.user_roles;

CREATE POLICY "Super admins delete non-admin roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin'::app_role)
  AND role <> 'super_admin'::app_role
);
