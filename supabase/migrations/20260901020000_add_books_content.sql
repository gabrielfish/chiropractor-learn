-- Books content table: stores Ryan's written book/teaching material as searchable chapters
CREATE TABLE IF NOT EXISTS public.books_content (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_title   TEXT NOT NULL,
  chapter_title TEXT,
  content_text TEXT NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index over all text fields
CREATE INDEX IF NOT EXISTS books_content_fts_idx ON public.books_content
  USING GIN (
    to_tsvector('english',
      book_title || ' ' ||
      COALESCE(chapter_title, '') || ' ' ||
      content_text
    )
  );

-- Index for fast book-title grouping / ordering
CREATE INDEX IF NOT EXISTS books_content_book_order_idx
  ON public.books_content (book_title, order_index);

-- RLS
ALTER TABLE public.books_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage books_content" ON public.books_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authenticated users read books_content" ON public.books_content
  FOR SELECT TO authenticated
  USING (true);

GRANT SELECT ON public.books_content TO authenticated;
GRANT ALL    ON public.books_content TO service_role;
