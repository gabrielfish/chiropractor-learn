-- ============================================================
-- Migration: 20260605142109_b2540001-d2d3-4c91-96af-390423a41fa2.sql
-- ============================================================

-- Enums
CREATE TYPE public.app_role AS ENUM ('super_admin', 'author', 'member');
CREATE TYPE public.content_status AS ENUM ('draft', 'published');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles (separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  "order" INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.categories TO authenticated, anon;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories readable by all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Content
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  video_duration TEXT,
  pdf_url TEXT,
  pdf_name TEXT,
  book_url TEXT,
  book_name TEXT,
  thumbnail_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content TO authenticated;
GRANT ALL ON public.content TO service_role;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read published content" ON public.content FOR SELECT TO authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));
CREATE POLICY "Authors and admins insert content" ON public.content FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));
CREATE POLICY "Authors update own, admins update all" ON public.content FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND author_id = auth.uid()));
CREATE POLICY "Admins delete content" ON public.content FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Progress
CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, content_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO authenticated;
GRANT ALL ON public.progress TO service_role;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments readable by authenticated" ON public.comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own comments" ON public.comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users/admins delete comments" ON public.comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

-- Auto-create profile + default member role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed categories
INSERT INTO public.categories (name, slug, icon, "order") VALUES
  ('New Patient Growth', 'new-patient-growth', 'TrendingUp', 1),
  ('Marketing & Facebook Ads', 'marketing-facebook-ads', 'Megaphone', 2),
  ('Practice Management', 'practice-management', 'Briefcase', 3),
  ('Mastermind Sessions', 'mastermind-sessions', 'Users', 4),
  ('Team & Front Desk Training', 'team-front-desk', 'UserCheck', 5),
  ('Tech & Tools', 'tech-tools', 'Wrench', 6),
  ('AI & Innovation', 'ai-innovation', 'Sparkles', 7),
  ('Done For You Resources', 'done-for-you', 'Package', 8),
  ('Foundations & Core Values', 'foundations', 'Compass', 9),
  ('Events & Workshops', 'events-workshops', 'Calendar', 10),
  ('Conversion & Sales', 'conversion-sales', 'Target', 11),
  ('Clinical Training', 'clinical-training', 'Stethoscope', 12);


-- ============================================================
-- Migration: 20260605142122_8e2ad9ab-14ca-498e-9194-370286323800.sql
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;


-- ============================================================
-- Migration: 20260605151841_50cf9c8b-ec79-4bcd-ba77-3027a11e0ab5.sql
-- ============================================================

DROP POLICY IF EXISTS "Profiles readable by authenticated" ON public.profiles;

CREATE POLICY "Users read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));


-- ============================================================
-- Migration: 20260605160904_0aef9679-1f9f-4d04-a692-4bd2b974700b.sql
-- ============================================================

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


-- ============================================================
-- Migration: 20260605161355_60b8a0fe-eefd-49cc-9b68-26e047f78d22.sql
-- ============================================================

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


-- ============================================================
-- Migration: 20260605161644_1d2ff1c1-b62c-4f84-9d33-da2a85ef5691.sql
-- ============================================================

-- 1. Harden has_role: ignore the passed-in _user_id and always use auth.uid().
-- Keeping the same signature so existing policies don't need to change.
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
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- 2. Super admins can read all user roles
CREATE POLICY "Super admins read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'::app_role));


-- ============================================================
-- Migration: 20260605162000_dfe51c08-98e0-4d78-a24d-65683e7dc0aa.sql
-- ============================================================

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
-- row visibility â€” the view restricts which columns can come back.
CREATE POLICY "Authenticated can read profile name/avatar via view"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);


-- ============================================================
-- Migration: 20260605162016_ca6dd54b-243a-4adf-afcd-7b5b91bdd5c6.sql
-- ============================================================

-- Remove the over-broad policy that exposed email/phone
DROP POLICY IF EXISTS "Authenticated can read profile name/avatar via view" ON public.profiles;

-- Recreate view WITHOUT security_invoker so it runs as the view owner
-- (postgres), bypassing profiles RLS â€” but the view only selects safe columns,
-- so email and phone are never reachable through it.
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT id, full_name, avatar_url
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated;


-- ============================================================
-- Migration: 20260605162031_c092c917-d3c4-4afe-8a60-da275d3c302b.sql
-- ============================================================

DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE FUNCTION public.get_public_profile(_user_id uuid)
RETURNS TABLE (id uuid, full_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.avatar_url
  FROM public.profiles p
  WHERE p.id = _user_id
$$;

REVOKE ALL ON FUNCTION public.get_public_profile(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;


-- ============================================================
-- Migration: 20260605162352_c433c258-6f50-4177-af0a-9f425fcc7e8f.sql
-- ============================================================
DROP POLICY IF EXISTS "Users/admins delete comments" ON public.comments;

CREATE POLICY "Users/admins delete comments"
ON public.comments
FOR DELETE
TO authenticated
USING (
  (auth.uid() = user_id AND flagged = false)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- ============================================================
-- Migration: 20260605162428_11994891-c133-442d-bc59-b96c24e3c7f3.sql
-- ============================================================
-- Lock down SECURITY DEFINER functions per linter warnings
-- has_role is used inside RLS policies, so authenticated must keep EXECUTE
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- handle_new_user is a trigger function, no external caller should execute it
REVOKE ALL ON FUNCTION public.handle_new_user() FROM public;

-- ============================================================
-- Migration: 20260605162528_9c457d3d-4393-4f98-bdf2-f0980eb0878f.sql
-- ============================================================
REVOKE ALL ON FUNCTION public.get_public_profile(uuid) FROM anon;


-- ============================================================
-- Migration: 20260605163357_06f37818-f8f4-4d7f-a597-e3223ba429f0.sql
-- ============================================================

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


-- ============================================================
-- Migration: 20260608110303_e782384b-80fd-4912-b754-3b86cafe52e9.sql
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS practice_name TEXT,
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN NOT NULL DEFAULT false;


-- ============================================================
-- Migration: 20260608110325_501e325a-c5d9-4ec0-b89f-c89c638e8b4f.sql
-- ============================================================

CREATE POLICY "Users can view their own avatar" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ============================================================
-- Migration: 20260608111352_1faa2cd3-2dec-4ebd-82d0-c25ff7329959.sql
-- ============================================================
CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.support_requests TO authenticated;
GRANT ALL ON public.support_requests TO service_role;

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can insert their own support requests"
  ON public.support_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Members can view their own support requests"
  ON public.support_requests FOR SELECT TO authenticated
  USING (auth.uid() = member_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can update support requests"
  ON public.support_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));


-- ============================================================
-- Migration: 20260608112131_fa605978-a781-4810-90e4-7b83a535b036.sql
-- ============================================================
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

-- ============================================================
-- Migration: 20260608115230_3c727cc6-9074-4f27-b4c5-179b8226e9a7.sql
-- ============================================================

-- Avatars: any signed-in user can read; user can write to their own folder (user_id/...)
CREATE POLICY "Avatars readable by authenticated"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Content files: any signed-in user can read; admins/authors can write
CREATE POLICY "Content files readable by authenticated"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'content-files');

CREATE POLICY "Admins upload content files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'content-files'
    AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
  );

CREATE POLICY "Admins update content files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'content-files'
    AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
  );

CREATE POLICY "Admins delete content files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'content-files'
    AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
  );

-- Also allow authors to insert categories (currently only super_admin via 'Admins manage categories')
CREATE POLICY "Authors insert categories"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'author') OR public.has_role(auth.uid(), 'super_admin'));


-- ============================================================
-- Migration: 20260608120618_08b5b3a5-f56d-4df5-8086-e4b1bb5ee204.sql
-- ============================================================

CREATE TABLE public.search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.search_logs TO authenticated;
GRANT ALL ON public.search_logs TO service_role;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own searches" ON public.search_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins view all searches" ON public.search_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));

CREATE INDEX idx_search_logs_created_at ON public.search_logs(created_at DESC);
CREATE INDEX idx_search_logs_query ON public.search_logs(lower(query));

-- Signups per month for last 12 months
CREATE OR REPLACE FUNCTION public.analytics_signups_by_month()
RETURNS TABLE(month date, count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT date_trunc('month', m)::date AS month,
         COUNT(p.id)::bigint
  FROM generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month') m
  LEFT JOIN public.profiles p
    ON date_trunc('month', p.created_at) = m
  GROUP BY m
  ORDER BY m;
$$;

-- Top search terms last 7 days with matching-content counts
CREATE OR REPLACE FUNCTION public.analytics_top_searches(days int DEFAULT 7, lim int DEFAULT 20)
RETURNS TABLE(query text, search_count bigint, match_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH q AS (
    SELECT lower(trim(query)) AS query, COUNT(*)::bigint AS search_count
    FROM public.search_logs
    WHERE created_at >= now() - (days || ' days')::interval
      AND length(trim(query)) > 0
    GROUP BY lower(trim(query))
    ORDER BY search_count DESC
    LIMIT lim
  )
  SELECT q.query, q.search_count,
    (SELECT COUNT(*)::bigint FROM public.content c
       WHERE c.status = 'published'
         AND (c.title ILIKE '%' || q.query || '%' OR c.description ILIKE '%' || q.query || '%')
    ) AS match_count
  FROM q
  ORDER BY q.search_count DESC;
$$;

-- Zero-result searches last 30 days
CREATE OR REPLACE FUNCTION public.analytics_zero_result_searches(days int DEFAULT 30, lim int DEFAULT 20)
RETURNS TABLE(query text, search_count bigint, last_searched timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH q AS (
    SELECT lower(trim(query)) AS query,
           COUNT(*)::bigint AS search_count,
           MAX(created_at) AS last_searched
    FROM public.search_logs
    WHERE created_at >= now() - (days || ' days')::interval
      AND length(trim(query)) > 0
    GROUP BY lower(trim(query))
  )
  SELECT q.query, q.search_count, q.last_searched
  FROM q
  WHERE NOT EXISTS (
    SELECT 1 FROM public.content c
    WHERE c.status = 'published'
      AND (c.title ILIKE '%' || q.query || '%' OR c.description ILIKE '%' || q.query || '%')
  )
  ORDER BY q.search_count DESC
  LIMIT lim;
$$;

-- Recently active members
CREATE OR REPLACE FUNCTION public.analytics_recent_members(lim int DEFAULT 10)
RETURNS TABLE(id uuid, full_name text, email text, last_login timestamptz, completed_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.full_name, p.email, p.last_login,
    (SELECT COUNT(*)::bigint FROM public.progress pr WHERE pr.user_id = p.id AND pr.completed) AS completed_count
  FROM public.profiles p
  WHERE p.last_login IS NOT NULL
  ORDER BY p.last_login DESC NULLS LAST
  LIMIT lim;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_signups_by_month() TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_top_searches(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_zero_result_searches(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_recent_members(int) TO authenticated;


-- ============================================================
-- Migration: 20260608120646_d0247414-fb85-4b91-a233-c4ffdd3f6dd0.sql
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.analytics_signups_by_month() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_top_searches(int, int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_zero_result_searches(int, int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.analytics_recent_members(int) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.analytics_signups_by_month()
RETURNS TABLE(month date, count bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author')) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  SELECT date_trunc('month', m)::date,
         COUNT(p.id)::bigint
  FROM generate_series(date_trunc('month', now()) - interval '11 months', date_trunc('month', now()), interval '1 month') m
  LEFT JOIN public.profiles p ON date_trunc('month', p.created_at) = m
  GROUP BY m
  ORDER BY m;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_top_searches(days int DEFAULT 7, lim int DEFAULT 20)
RETURNS TABLE(query text, search_count bigint, match_count bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author')) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  WITH q AS (
    SELECT lower(trim(sl.query)) AS query, COUNT(*)::bigint AS search_count
    FROM public.search_logs sl
    WHERE sl.created_at >= now() - (days || ' days')::interval
      AND length(trim(sl.query)) > 0
    GROUP BY lower(trim(sl.query))
    ORDER BY COUNT(*) DESC
    LIMIT lim
  )
  SELECT q.query, q.search_count,
    (SELECT COUNT(*)::bigint FROM public.content c
       WHERE c.status = 'published'
         AND (c.title ILIKE '%' || q.query || '%' OR c.description ILIKE '%' || q.query || '%')
    )
  FROM q
  ORDER BY q.search_count DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_zero_result_searches(days int DEFAULT 30, lim int DEFAULT 20)
RETURNS TABLE(query text, search_count bigint, last_searched timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author')) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  WITH q AS (
    SELECT lower(trim(sl.query)) AS query,
           COUNT(*)::bigint AS search_count,
           MAX(sl.created_at) AS last_searched
    FROM public.search_logs sl
    WHERE sl.created_at >= now() - (days || ' days')::interval
      AND length(trim(sl.query)) > 0
    GROUP BY lower(trim(sl.query))
  )
  SELECT q.query, q.search_count, q.last_searched
  FROM q
  WHERE NOT EXISTS (
    SELECT 1 FROM public.content c
    WHERE c.status = 'published'
      AND (c.title ILIKE '%' || q.query || '%' OR c.description ILIKE '%' || q.query || '%')
  )
  ORDER BY q.search_count DESC
  LIMIT lim;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_recent_members(lim int DEFAULT 10)
RETURNS TABLE(id uuid, full_name text, email text, last_login timestamptz, completed_count bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author')) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  SELECT p.id, p.full_name, p.email, p.last_login,
    (SELECT COUNT(*)::bigint FROM public.progress pr WHERE pr.user_id = p.id AND pr.completed)
  FROM public.profiles p
  WHERE p.last_login IS NOT NULL
  ORDER BY p.last_login DESC NULLS LAST
  LIMIT lim;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_signups_by_month() TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_top_searches(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_zero_result_searches(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_recent_members(int) TO authenticated;


-- ============================================================
-- Migration: 20260608122233_861ce0b5-732f-4e2a-839d-447c43b8728e.sql
-- ============================================================

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


-- ============================================================
-- Migration: 20260608123815_b819ea04-ce9c-42f9-9203-773a558084e2.sql
-- ============================================================

-- 1. Profiles PII column-level grants
REVOKE SELECT ON public.profiles FROM authenticated;
GRANT SELECT (id, full_name, avatar_url, bio, job_title, last_login, email_notifications, sms_notifications, created_at)
  ON public.profiles TO authenticated;

-- 2. Drop broad avatars SELECT policy (signed URLs still work)
DROP POLICY IF EXISTS "Avatars readable by authenticated" ON storage.objects;

-- 3. Replace broad content-files SELECT with admin/author-only direct read
DROP POLICY IF EXISTS "Content files readable by authenticated" ON storage.objects;
CREATE POLICY "Admins and authors read content files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'content-files'
    AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
  );


-- ============================================================
-- Migration: 20260608135125_b747c19e-dc2a-451c-828a-bbdd440b6fcc.sql
-- ============================================================
ALTER TYPE public.content_status ADD VALUE IF NOT EXISTS 'archived';

