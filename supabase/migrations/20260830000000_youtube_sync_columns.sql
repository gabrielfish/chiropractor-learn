-- Replace Cloudflare Stream columns with YouTube sync column.
-- content: drop cloudflare_video_id, add youtube_video_id
-- course_lessons: drop cloudflare_video_id

ALTER TABLE public.content
  DROP COLUMN IF EXISTS cloudflare_video_id;

ALTER TABLE public.content
  ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;

ALTER TABLE public.course_lessons
  DROP COLUMN IF EXISTS cloudflare_video_id;
