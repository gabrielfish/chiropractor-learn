
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
