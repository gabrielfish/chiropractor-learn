-- Fix profiles RLS: restrict mcp_token visibility to row owner only.
--
-- The original "Profiles readable by authenticated" policy used USING (true),
-- which allowed any authenticated member to read every other member's mcp_token.
-- A member with another member's token can impersonate them at /member.
--
-- This migration:
-- 1) Drops the overly-permissive SELECT policy.
-- 2) Adds a new policy: members read only their own profile row.
-- 3) Adds a separate admin policy so super_admins retain full read access.

-- Drop the old blanket SELECT policy
drop policy if exists "Profiles readable by authenticated" on public.profiles;
drop policy if exists "profiles_select_authenticated" on public.profiles;

-- Members can only read their own profile (including mcp_token)
create policy "Users can only read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Super admins can read all profiles
create policy "Super admins can read all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role = 'super_admin'
    )
  );
