-- Auto-assign admin role for arif@bisabaik.or.id on profile creation
CREATE OR REPLACE FUNCTION public.handle_auto_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'arif@bisabaik.or.id' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auto_admin_assignment ON public.profiles;
CREATE TRIGGER on_auto_admin_assignment
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auto_admin();