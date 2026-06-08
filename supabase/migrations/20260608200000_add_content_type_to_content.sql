-- Add content_type column to content table
-- Values: 'video' | 'pdf' | 'book' | null (null = mixed/unspecified)
ALTER TABLE public.content
  ADD COLUMN IF NOT EXISTS content_type TEXT
  CHECK (content_type IN ('video', 'pdf', 'book'));

-- Backfill existing rows:
-- Items with a book_url → 'book'
UPDATE public.content SET content_type = 'book'  WHERE book_url IS NOT NULL AND content_type IS NULL;
-- Items with a pdf_url but no book_url → 'pdf'
UPDATE public.content SET content_type = 'pdf'   WHERE pdf_url IS NOT NULL AND book_url IS NULL AND content_type IS NULL;
-- Items with a video_url only → 'video'
UPDATE public.content SET content_type = 'video' WHERE video_url IS NOT NULL AND pdf_url IS NULL AND book_url IS NULL AND content_type IS NULL;
