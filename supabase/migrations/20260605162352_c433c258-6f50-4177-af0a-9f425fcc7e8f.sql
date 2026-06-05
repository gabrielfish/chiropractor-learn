DROP POLICY IF EXISTS "Users/admins delete comments" ON public.comments;

CREATE POLICY "Users/admins delete comments"
ON public.comments
FOR DELETE
TO authenticated
USING (
  (auth.uid() = user_id AND flagged = false)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);