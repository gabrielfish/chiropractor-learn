
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
