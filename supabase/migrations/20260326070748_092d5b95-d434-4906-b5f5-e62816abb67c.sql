
-- Add buyer tracking columns to rfq_requests
ALTER TABLE public.rfq_requests 
  ADD COLUMN IF NOT EXISTS buyer_session_id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS buyer_access_token uuid DEFAULT gen_random_uuid();

-- Create index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_rfq_requests_buyer_access_token ON public.rfq_requests(buyer_access_token);
CREATE INDEX IF NOT EXISTS idx_rfq_requests_buyer_session_id ON public.rfq_requests(buyer_session_id);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid REFERENCES public.rfq_requests(id) ON DELETE SET NULL,
  quote_id uuid REFERENCES public.rfq_quotes(id) ON DELETE SET NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  buyer_email text NOT NULL,
  buyer_company text NOT NULL,
  buyer_contact text NOT NULL,
  product_category text,
  quantity text,
  agreed_price text NOT NULL,
  lead_time text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin can do everything on orders
CREATE POLICY "Admin read orders" ON public.orders FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete orders" ON public.orders FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Supplier can read their own orders
CREATE POLICY "Supplier read own orders" ON public.orders FOR SELECT TO authenticated 
  USING (supplier_id IN (SELECT id FROM suppliers WHERE user_id = auth.uid()));

-- Public can insert orders (for buyer accepting quotes without login)
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT TO public WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policy for public to read rfq_requests by access token
-- We'll use an edge function instead for security
