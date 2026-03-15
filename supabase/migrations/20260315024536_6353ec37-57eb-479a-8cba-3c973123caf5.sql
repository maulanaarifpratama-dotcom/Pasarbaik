
CREATE TABLE public.rfq_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text,
  category text,
  quantity text,
  target_price text,
  deadline date,
  location text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rfq_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an RFQ (public insert)
CREATE POLICY "Public insert rfq" ON public.rfq_requests
  FOR INSERT TO public WITH CHECK (true);

-- Only admins can read RFQs
CREATE POLICY "Admin read rfq" ON public.rfq_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Only admins can update RFQs (status changes)
CREATE POLICY "Admin update rfq" ON public.rfq_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Only admins can delete RFQs
CREATE POLICY "Admin delete rfq" ON public.rfq_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
