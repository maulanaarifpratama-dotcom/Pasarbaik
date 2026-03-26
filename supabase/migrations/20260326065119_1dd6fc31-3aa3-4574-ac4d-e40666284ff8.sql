
-- Add new columns to rfq_requests
ALTER TABLE public.rfq_requests
  ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS buyer_user_id uuid,
  ADD COLUMN IF NOT EXISTS last_message_at timestamptz,
  ADD COLUMN IF NOT EXISTS quotation_price text,
  ADD COLUMN IF NOT EXISTS quotation_status text DEFAULT 'none';

-- Migrate existing 'pending' status to 'new'
UPDATE public.rfq_requests SET status = 'new' WHERE status = 'pending';

-- Update default status
ALTER TABLE public.rfq_requests ALTER COLUMN status SET DEFAULT 'new';

-- Create rfq_messages table
CREATE TABLE public.rfq_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('buyer', 'supplier', 'system')),
  sender_user_id uuid,
  message text NOT NULL,
  attachment_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rfq_messages ENABLE ROW LEVEL SECURITY;

-- RLS for rfq_messages
CREATE POLICY "Admin read rfq_messages" ON public.rfq_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Supplier read own rfq_messages" ON public.rfq_messages FOR SELECT TO authenticated USING (
  rfq_id IN (SELECT id FROM public.rfq_requests WHERE supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()))
);
CREATE POLICY "Supplier insert rfq_messages" ON public.rfq_messages FOR INSERT TO authenticated WITH CHECK (
  sender_user_id = auth.uid()
);
CREATE POLICY "Public insert rfq_messages" ON public.rfq_messages FOR INSERT TO public WITH CHECK (
  sender_type = 'buyer'
);

-- Create rfq_quotes table
CREATE TABLE public.rfq_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  price text NOT NULL,
  moq text,
  lead_time text,
  notes text,
  attachment_url text,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected', 'revised')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rfq_quotes ENABLE ROW LEVEL SECURITY;

-- RLS for rfq_quotes
CREATE POLICY "Admin read rfq_quotes" ON public.rfq_quotes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Supplier read own quotes" ON public.rfq_quotes FOR SELECT TO authenticated USING (
  supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
);
CREATE POLICY "Supplier insert own quotes" ON public.rfq_quotes FOR INSERT TO authenticated WITH CHECK (
  supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
);
CREATE POLICY "Supplier update own quotes" ON public.rfq_quotes FOR UPDATE TO authenticated USING (
  supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
);

-- Create rfq_activity_log table
CREATE TABLE public.rfq_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
  action text NOT NULL,
  actor_type text NOT NULL CHECK (actor_type IN ('buyer', 'supplier', 'system', 'admin')),
  actor_user_id uuid,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rfq_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS for rfq_activity_log
CREATE POLICY "Admin read rfq_activity_log" ON public.rfq_activity_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Supplier read own activity" ON public.rfq_activity_log FOR SELECT TO authenticated USING (
  rfq_id IN (SELECT id FROM public.rfq_requests WHERE supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()))
);
CREATE POLICY "Authenticated insert activity" ON public.rfq_activity_log FOR INSERT TO authenticated WITH CHECK (true);
