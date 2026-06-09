-- Add display_author_name to content table.
-- When set, this overrides the author's profile name for display purposes,
-- allowing team members to upload content on behalf of Ryan Rieder.
-- If NULL, the system falls back to the author's profile full_name.

ALTER TABLE public.content
  ADD COLUMN IF NOT EXISTS display_author_name TEXT;
