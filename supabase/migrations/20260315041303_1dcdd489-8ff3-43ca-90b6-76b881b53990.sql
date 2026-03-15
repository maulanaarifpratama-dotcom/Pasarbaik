
-- Update handle_auto_admin to also assign default 'user' role to all new users
CREATE OR REPLACE FUNCTION public.handle_auto_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Assign default 'user' role to everyone
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- If admin email, also assign admin role
  IF NEW.email = 'arif@bisabaik.or.id' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
