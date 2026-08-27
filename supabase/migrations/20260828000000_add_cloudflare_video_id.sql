-- Add Cloudflare Stream video ID to content and course_lessons tables.
-- When set, the player uses the Cloudflare Stream embed instead of video_url.
-- video_url continues to hold YouTube URLs; cloudflare_video_id holds CF Stream IDs.

ALTER TABLE public.content
  ADD COLUMN IF NOT EXISTS cloudflare_video_id TEXT;

ALTER TABLE public.course_lessons
  ADD COLUMN IF NOT EXISTS cloudflare_video_id TEXT;
