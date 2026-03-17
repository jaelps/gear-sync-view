
-- Public function to check if any leader exists (no auth required)
CREATE OR REPLACE FUNCTION public.has_any_leader()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'lider'
  )
$$;
