-- Lock down SECURITY DEFINER functions per linter warnings
-- has_role is used inside RLS policies, so authenticated must keep EXECUTE
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- handle_new_user is a trigger function, no external caller should execute it
REVOKE ALL ON FUNCTION public.handle_new_user() FROM public;