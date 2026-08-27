-- =============================================================================
-- DCPG Membership Portal — Full Schema Migration
-- Generated from all incremental migrations, synthesized to final state.
-- =============================================================================
--
-- HOW TO USE
-- ----------
-- 1. Create a fresh Supabase project.
-- 2. Run THIS file in the Supabase SQL Editor (or psql) ONCE.
-- 3. Export transactional data from the OLD project:
--      Supabase Dashboard → Table Editor → [table] → Export CSV
--    OR use pg_dump on the old project's Postgres connection string:
--      pg_dump -h <old-host> -U postgres -d postgres -t public.profiles \
--              -t public.content -t public.user_roles ... --data-only -f data.sql
-- 4. Re-seed or re-import that data into the new project.
-- 5. Set up Storage buckets (avatars, content-files) in the new project dashboard.
-- 6. Copy all environment variables to the new project (Vercel + .env.local).
--
-- NOTE: auth.users rows (email/password accounts) cannot be migrated via SQL —
-- members must be invited/re-registered, OR use Supabase's project migration
-- tool: https://supabase.com/docs/guides/platform/migrating-and-upgrading-projects
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'author', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 2. Tables (in FK dependency order)
-- ---------------------------------------------------------------------------

-- 2a. profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name            TEXT,
  email                TEXT,
  avatar_url           TEXT,
  phone                TEXT,
  bio                  TEXT,
  job_title            TEXT,
  practice_name        TEXT,
  email_notifications  BOOLEAN NOT NULL DEFAULT true,
  sms_notifications    BOOLEAN NOT NULL DEFAULT false,
  is_active            BOOLEAN NOT NULL DEFAULT true,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login           TIMESTAMPTZ
);

-- 2b. user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role     app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 2c. categories
CREATE TABLE IF NOT EXISTS public.categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  icon         TEXT,
  "order"      INT NOT NULL DEFAULT 0
);

-- 2d. content
CREATE TABLE IF NOT EXISTS public.content (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  description         TEXT,
  author_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id         UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags                TEXT[] NOT NULL DEFAULT '{}',
  video_url           TEXT,
  video_duration      TEXT,
  pdf_url             TEXT,
  pdf_name            TEXT,
  book_url            TEXT,
  book_name           TEXT,
  thumbnail_url       TEXT,
  status              content_status NOT NULL DEFAULT 'draft',
  views               INT NOT NULL DEFAULT 0,
  content_type        TEXT CHECK (content_type IN ('video', 'pdf', 'book')),
  display_author_name TEXT,
  text_content        TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at        TIMESTAMPTZ
);

-- 2e. progress
CREATE TABLE IF NOT EXISTS public.progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id   UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, content_id)
);

-- 2f. comments
CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  flagged    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2g. support_requests
CREATE TABLE IF NOT EXISTS public.support_requests (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category   TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2h. search_logs
CREATE TABLE IF NOT EXISTS public.search_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query      TEXT NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2i. invites
CREATE TABLE IF NOT EXISTS public.invites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token      TEXT NOT NULL UNIQUE,
  label      TEXT,
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2j. courses
CREATE TABLE IF NOT EXISTS public.courses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  description         TEXT,
  thumbnail_url       TEXT,
  category_id         UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  display_author_name TEXT DEFAULT 'Dr Ryan Rieder',
  status              content_status NOT NULL DEFAULT 'draft',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2k. course_modules
CREATE TABLE IF NOT EXISTS public.course_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2l. course_lessons
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  course_id    UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  video_url    TEXT,
  pdf_url      TEXT,
  text_content TEXT,
  content_type TEXT NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'pdf', 'text')),
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2m. course_progress
CREATE TABLE IF NOT EXISTS public.course_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  course_id        UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed        BOOLEAN NOT NULL DEFAULT false,
  completed_at     TIMESTAMPTZ,
  UNIQUE(user_id, course_lesson_id)
);

-- 2n. certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name      TEXT NOT NULL DEFAULT '',
  type           TEXT NOT NULL CHECK (type IN ('course', 'category')),
  reference_id   TEXT NOT NULL,
  reference_name TEXT NOT NULL,
  issued_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, type, reference_id)
);

-- 2o. notifications_log
-- NOTE: if this table was created via the Supabase Dashboard (not a migration),
-- adjust the schema to match. This is a best-guess definition.
CREATE TABLE IF NOT EXISTS public.notifications_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  payload    JSONB,
  sent_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 3. Functions
-- ---------------------------------------------------------------------------

-- has_role: security-definer; checks user_roles for the supplied user_id.
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- handle_new_user: trigger that auto-creates profile + member role on signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- get_public_profile: was created then dropped; not included.

-- Analytics functions (admin/author only; check role inside function body).
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
  FROM generate_series(
    date_trunc('month', now()) - interval '11 months',
    date_trunc('month', now()),
    interval '1 month'
  ) m
  LEFT JOIN public.profiles p ON date_trunc('month', p.created_at) = m
  GROUP BY m ORDER BY m;
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
       AND (c.title ILIKE '%' || q.query || '%' OR c.description ILIKE '%' || q.query || '%'))
  FROM q ORDER BY q.search_count DESC;
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
  ORDER BY q.search_count DESC LIMIT lim;
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

REVOKE ALL ON FUNCTION public.analytics_signups_by_month() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_top_searches(int, int) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_zero_result_searches(int, int) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_recent_members(int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_signups_by_month() TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_top_searches(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_zero_result_searches(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_recent_members(int) TO authenticated;

-- ---------------------------------------------------------------------------
-- 4. Views
-- ---------------------------------------------------------------------------

-- author_profiles_public: safe subset of author/admin profiles (no PII).
CREATE OR REPLACE VIEW public.author_profiles_public AS
SELECT id, full_name, avatar_url, job_title, bio
FROM public.profiles
WHERE public.has_role(id, 'author'::public.app_role)
   OR public.has_role(id, 'super_admin'::public.app_role);

ALTER VIEW public.author_profiles_public SET (security_invoker = off);
GRANT SELECT ON public.author_profiles_public TO authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Enable RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 6. RLS Policies
-- ---------------------------------------------------------------------------

-- profiles
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admin can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- user_roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins read all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins insert non-admin roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    AND role <> 'super_admin'::app_role
  );

CREATE POLICY "Super admins update non-admin roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    AND role <> 'super_admin'::app_role
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    AND role <> 'super_admin'::app_role
  );

CREATE POLICY "Super admins delete non-admin roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    AND role <> 'super_admin'::app_role
  );

-- categories
CREATE POLICY "Categories readable by all"
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins manage categories"
  ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authors insert categories"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'author') OR public.has_role(auth.uid(), 'super_admin'));

-- content
CREATE POLICY "Members read published content"
  ON public.content FOR SELECT TO authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));

CREATE POLICY "Authors and admins insert content"
  ON public.content FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));

CREATE POLICY "Authors update own, admins update all"
  ON public.content FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND author_id = auth.uid()));

CREATE POLICY "Admins delete content"
  ON public.content FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- progress
CREATE POLICY "Users manage own progress"
  ON public.progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- comments
CREATE POLICY "Comments readable by authenticated"
  ON public.comments FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    OR public.has_role(auth.uid(), 'author'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.content c
      WHERE c.id = comments.content_id AND c.status = 'published'::content_status
    )
  );

CREATE POLICY "Users create own comments"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND flagged = false);

CREATE POLICY "Users update own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND flagged = (SELECT c.flagged FROM public.comments c WHERE c.id = comments.id)
  );

CREATE POLICY "Admins update any comment"
  ON public.comments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users/admins delete comments"
  ON public.comments FOR DELETE TO authenticated
  USING (
    (auth.uid() = user_id AND flagged = false)
    OR public.has_role(auth.uid(), 'super_admin'::app_role)
  );

-- support_requests
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

-- search_logs
CREATE POLICY "Users insert own searches"
  ON public.search_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own searches"
  ON public.search_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all searches"
  ON public.search_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));

-- courses
CREATE POLICY "Members read published courses"
  ON public.courses FOR SELECT TO authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));

CREATE POLICY "Authors and admins insert courses"
  ON public.courses FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'));

CREATE POLICY "Authors update own, admins update all courses"
  ON public.courses FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND author_id = auth.uid()));

CREATE POLICY "Admins delete courses"
  ON public.courses FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- course_modules
CREATE POLICY "Members read accessible course modules"
  ON public.course_modules FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_modules.course_id
        AND (c.status = 'published' OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
    )
  );

CREATE POLICY "Authors and admins insert course modules"
  ON public.course_modules FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_modules.course_id
        AND (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND c.author_id = auth.uid()))
    )
  );

CREATE POLICY "Authors and admins update course modules"
  ON public.course_modules FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_modules.course_id
        AND (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND c.author_id = auth.uid()))
    )
  );

CREATE POLICY "Authors and admins delete course modules"
  ON public.course_modules FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_modules.course_id
        AND (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND c.author_id = auth.uid()))
    )
  );

-- course_lessons
CREATE POLICY "Members read accessible course lessons"
  ON public.course_lessons FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_lessons.course_id
        AND (c.status = 'published' OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
    )
  );

CREATE POLICY "Authors and admins insert course lessons"
  ON public.course_lessons FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_lessons.course_id
        AND (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND c.author_id = auth.uid()))
    )
  );

CREATE POLICY "Authors and admins update course lessons"
  ON public.course_lessons FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_lessons.course_id
        AND (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND c.author_id = auth.uid()))
    )
  );

CREATE POLICY "Authors and admins delete course lessons"
  ON public.course_lessons FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_lessons.course_id
        AND (public.has_role(auth.uid(), 'super_admin') OR (public.has_role(auth.uid(), 'author') AND c.author_id = auth.uid()))
    )
  );

-- course_progress
CREATE POLICY "Users manage own course progress"
  ON public.course_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- certificates
CREATE POLICY "Certificates are publicly viewable"
  ON public.certificates FOR SELECT USING (true);

CREATE POLICY "Users can insert their own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- notifications_log (adjust policies to match your actual schema)
CREATE POLICY "Users read own notifications"
  ON public.notifications_log FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin'));

-- ---------------------------------------------------------------------------
-- 7. Table-level grants
-- ---------------------------------------------------------------------------
GRANT SELECT (id, full_name, avatar_url, bio, job_title, last_login,
              email_notifications, sms_notifications, created_at, is_active)
  ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT ON public.categories TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content TO authenticated;
GRANT ALL ON public.content TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO authenticated;
GRANT ALL ON public.progress TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;

GRANT SELECT, INSERT ON public.support_requests TO authenticated;
GRANT ALL ON public.support_requests TO service_role;

GRANT SELECT, INSERT ON public.search_logs TO authenticated;
GRANT ALL ON public.search_logs TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invites TO authenticated;
GRANT ALL ON public.invites TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT ALL ON public.course_modules TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_progress TO authenticated;
GRANT ALL ON public.course_progress TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO service_role;

GRANT SELECT ON public.notifications_log TO authenticated;
GRANT ALL ON public.notifications_log TO service_role;

-- ---------------------------------------------------------------------------
-- 8. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON public.search_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON public.search_logs(lower(query));

-- ---------------------------------------------------------------------------
-- 9. Seed data (static / configuration rows from original migrations)
-- ---------------------------------------------------------------------------

-- Categories
INSERT INTO public.categories (name, slug, icon, "order") VALUES
  ('New Patient Growth',        'new-patient-growth',   'TrendingUp',   1),
  ('Marketing & Facebook Ads',  'marketing-facebook-ads','Megaphone',   2),
  ('Practice Management',       'practice-management',  'Briefcase',    3),
  ('Mastermind Sessions',       'mastermind-sessions',  'Users',        4),
  ('Team & Front Desk Training','team-front-desk',       'UserCheck',   5),
  ('Tech & Tools',              'tech-tools',           'Wrench',       6),
  ('AI & Innovation',           'ai-innovation',        'Sparkles',     7),
  ('Done For You Resources',    'done-for-you',         'Package',      8),
  ('Foundations & Core Values', 'foundations',          'Compass',      9),
  ('Events & Workshops',        'events-workshops',     'Calendar',    10),
  ('Conversion & Sales',        'conversion-sales',     'Target',      11),
  ('Clinical Training',         'clinical-training',    'Stethoscope', 12)
ON CONFLICT (slug) DO NOTHING;

-- Master invite token
INSERT INTO public.invites (token, label, active)
VALUES ('INNERCIRCLE', 'Member invite link', true)
ON CONFLICT (token) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 10. TRANSACTIONAL DATA — must be exported separately
-- ---------------------------------------------------------------------------
-- The following tables contain live member/content data that cannot be
-- queried here. Export them from your old Supabase project:
--
--   Option A — Supabase Dashboard:
--     Table Editor → select table → "Export to CSV" → re-import via Table Editor
--
--   Option B — pg_dump (recommended for large datasets):
--     pg_dump "postgres://postgres:[password]@[host]:5432/postgres" \
--       --data-only --no-owner --no-acl \
--       -t public.profiles \
--       -t public.user_roles \
--       -t public.content \
--       -t public.progress \
--       -t public.comments \
--       -t public.courses \
--       -t public.course_modules \
--       -t public.course_lessons \
--       -t public.course_progress \
--       -t public.certificates \
--       -t public.invites \
--       -t public.search_logs \
--       -t public.support_requests \
--       -t public.notifications_log \
--       -f data_export.sql
--
--   Option C — Supabase project migration tool (migrates auth.users too):
--     https://supabase.com/docs/guides/platform/migrating-and-upgrading-projects
--
-- IMPORTANT: auth.users rows cannot be moved via SQL INSERT — they live in
-- Supabase's internal auth schema. Use Option C if you need to preserve
-- existing member login credentials.
-- ---------------------------------------------------------------------------

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
