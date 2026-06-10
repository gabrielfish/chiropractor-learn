-- Add text_content column to content table for mixed media lessons
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS text_content TEXT;
