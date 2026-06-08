
-- Avatars: any signed-in user can read; user can write to their own folder (user_id/...)
CREATE POLICY "Avatars readable by authenticated"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Content files: any signed-in user can read; admins/authors can write
CREATE POLICY "Content files readable by authenticated"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'content-files');

CREATE POLICY "Admins upload content files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'content-files'
    AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
  );

CREATE POLICY "Admins update content files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'content-files'
    AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
  );

CREATE POLICY "Admins delete content files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'content-files'
    AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'author'))
  );

-- Also allow authors to insert categories (currently only super_admin via 'Admins manage categories')
CREATE POLICY "Authors insert categories"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'author') OR public.has_role(auth.uid(), 'super_admin'));
