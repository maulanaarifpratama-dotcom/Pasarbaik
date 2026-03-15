
-- Add user_id to suppliers so partners can own their supplier profile
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS user_id uuid;

-- RLS: Partners can update their own supplier
CREATE POLICY "Partner update own supplier"
ON public.suppliers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- RLS: Partners can read their own supplier (already public read)

-- RLS: Partners can insert products linked to their supplier
CREATE POLICY "Partner insert own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
);

-- RLS: Partners can update their own products
CREATE POLICY "Partner update own products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
);

-- RLS: Partners can delete their own products
CREATE POLICY "Partner delete own products"
ON public.products
FOR DELETE
TO authenticated
USING (
  supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
);
