CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.support_requests TO authenticated;
GRANT ALL ON public.support_requests TO service_role;

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can insert their own support requests"
  ON public.support_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Members can view their own support requests"
  ON public.support_requests FOR SELECT TO authenticated
  USING (auth.uid() = member_id OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can update support requests"
  ON public.support_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
