-- Fix: GRANT only had SELECT for authenticated users, so INSERT/UPDATE/DELETE
-- were blocked at the privilege level before RLS even ran.
-- The existing RLS policies ("Admins manage categories", "Authors insert categories")
-- are correct -- they just need the underlying table privileges to match.

GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
