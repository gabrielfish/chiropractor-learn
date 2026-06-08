
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
