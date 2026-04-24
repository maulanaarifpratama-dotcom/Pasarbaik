DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typnamespace = 'public'::regnamespace AND typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'supplier', 'buyer', 'partner', 'editor', 'user');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.app_role'::regtype AND enumlabel = 'admin') THEN ALTER TYPE public.app_role ADD VALUE 'admin'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.app_role'::regtype AND enumlabel = 'supplier') THEN ALTER TYPE public.app_role ADD VALUE 'supplier'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.app_role'::regtype AND enumlabel = 'buyer') THEN ALTER TYPE public.app_role ADD VALUE 'buyer'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.app_role'::regtype AND enumlabel = 'partner') THEN ALTER TYPE public.app_role ADD VALUE 'partner'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.app_role'::regtype AND enumlabel = 'editor') THEN ALTER TYPE public.app_role ADD VALUE 'editor'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.app_role'::regtype AND enumlabel = 'user') THEN ALTER TYPE public.app_role ADD VALUE 'user'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_key ON public.profiles(user_id);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.ensure_user_profile(_user_id uuid, _name text DEFAULT NULL, _email text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> _user_id THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  INSERT INTO public.profiles (user_id, name, email)
  VALUES (_user_id, COALESCE(_name, ''), _email)
  ON CONFLICT (user_id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    name = COALESCE(NULLIF(EXCLUDED.name, ''), public.profiles.name),
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF _email = 'arif@bisabaik.or.id' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  category text,
  location text,
  impact_tags text[],
  images text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  slug text UNIQUE,
  logo text,
  type text,
  location text,
  description text,
  contact text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  image text,
  category text,
  impact_tags text[],
  status text DEFAULT 'active',
  price text,
  moq text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.impact_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  date date,
  beneficiaries integer DEFAULT 0,
  metrics jsonb DEFAULT '{}'::jsonb,
  sdg_tags text[],
  images text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rfq_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  buyer_user_id uuid,
  buyer_session_id uuid DEFAULT gen_random_uuid(),
  buyer_access_token uuid DEFAULT gen_random_uuid(),
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
  status text NOT NULL DEFAULT 'new',
  quotation_price text,
  quotation_status text DEFAULT 'none',
  last_message_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rfq_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
  sender_type text NOT NULL,
  sender_user_id uuid,
  message text NOT NULL,
  attachment_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rfq_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  price text NOT NULL,
  moq text,
  lead_time text,
  notes text,
  attachment_url text,
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rfq_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
  actor_type text NOT NULL,
  actor_user_id uuid,
  action text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
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

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_program_id ON public.products(program_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON public.orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_rfq_requests_supplier_id ON public.rfq_requests(supplier_id);
CREATE INDEX IF NOT EXISTS idx_rfq_messages_rfq_id ON public.rfq_messages(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_quotes_rfq_id ON public.rfq_quotes(rfq_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public read programs" ON public.programs;
DROP POLICY IF EXISTS "Admins manage programs" ON public.programs;
CREATE POLICY "Public read programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Admins manage programs" ON public.programs FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public read suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Admins manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Partners update own supplier" ON public.suppliers;
CREATE POLICY "Public read suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Admins manage suppliers" ON public.suppliers FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners update own supplier" ON public.suppliers FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
DROP POLICY IF EXISTS "Partners manage own products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partners manage own products" ON public.products FOR ALL USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())) WITH CHECK (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public read impact reports" ON public.impact_reports;
DROP POLICY IF EXISTS "Admins manage impact reports" ON public.impact_reports;
CREATE POLICY "Public read impact reports" ON public.impact_reports FOR SELECT USING (true);
CREATE POLICY "Admins manage impact reports" ON public.impact_reports FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public read pages" ON public.pages;
DROP POLICY IF EXISTS "Admins manage pages" ON public.pages;
CREATE POLICY "Public read pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public insert rfq" ON public.rfq_requests;
DROP POLICY IF EXISTS "Admins read rfq" ON public.rfq_requests;
DROP POLICY IF EXISTS "Admins update rfq" ON public.rfq_requests;
DROP POLICY IF EXISTS "Suppliers read own rfq" ON public.rfq_requests;
DROP POLICY IF EXISTS "Suppliers update own rfq" ON public.rfq_requests;
CREATE POLICY "Public insert rfq" ON public.rfq_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read rfq" ON public.rfq_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update rfq" ON public.rfq_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Suppliers read own rfq" ON public.rfq_requests FOR SELECT TO authenticated USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));
CREATE POLICY "Suppliers update own rfq" ON public.rfq_requests FOR UPDATE TO authenticated USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())) WITH CHECK (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public insert buyer messages" ON public.rfq_messages;
DROP POLICY IF EXISTS "Suppliers insert own messages" ON public.rfq_messages;
DROP POLICY IF EXISTS "Admins read messages" ON public.rfq_messages;
DROP POLICY IF EXISTS "Suppliers read own messages" ON public.rfq_messages;
CREATE POLICY "Public insert buyer messages" ON public.rfq_messages FOR INSERT WITH CHECK (sender_type = 'buyer');
CREATE POLICY "Suppliers insert own messages" ON public.rfq_messages FOR INSERT TO authenticated WITH CHECK (sender_user_id = auth.uid());
CREATE POLICY "Admins read messages" ON public.rfq_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Suppliers read own messages" ON public.rfq_messages FOR SELECT TO authenticated USING (rfq_id IN (SELECT r.id FROM public.rfq_requests r JOIN public.suppliers s ON s.id = r.supplier_id WHERE s.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins read quotes" ON public.rfq_quotes;
DROP POLICY IF EXISTS "Suppliers manage own quotes" ON public.rfq_quotes;
CREATE POLICY "Admins read quotes" ON public.rfq_quotes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Suppliers manage own quotes" ON public.rfq_quotes FOR ALL TO authenticated USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())) WITH CHECK (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated insert activity" ON public.rfq_activity_log;
DROP POLICY IF EXISTS "Admins read activity" ON public.rfq_activity_log;
DROP POLICY IF EXISTS "Suppliers read own activity" ON public.rfq_activity_log;
CREATE POLICY "Authenticated insert activity" ON public.rfq_activity_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins read activity" ON public.rfq_activity_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Suppliers read own activity" ON public.rfq_activity_log FOR SELECT TO authenticated USING (rfq_id IN (SELECT r.id FROM public.rfq_requests r JOIN public.suppliers s ON s.id = r.supplier_id WHERE s.user_id = auth.uid()));

DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
DROP POLICY IF EXISTS "Suppliers read own orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Suppliers read own orders" ON public.orders FOR SELECT TO authenticated USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));