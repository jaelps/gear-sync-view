
-- Add new role columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lider_producao boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS responsavel_limpeza boolean NOT NULL DEFAULT false;

-- Security definer function to check profile flags
CREATE OR REPLACE FUNCTION public.has_profile_flag(_user_id uuid, _flag text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE _flag
    WHEN 'lider_producao' THEN COALESCE((SELECT lider_producao FROM public.profiles WHERE user_id = _user_id), false)
    WHEN 'responsavel_estoque' THEN COALESCE((SELECT responsavel_estoque FROM public.profiles WHERE user_id = _user_id), false)
    WHEN 'responsavel_limpeza' THEN COALESCE((SELECT responsavel_limpeza FROM public.profiles WHERE user_id = _user_id), false)
    ELSE false
  END
$$;

-- Allow lider_producao to view all production
CREATE POLICY "Lider producao can view all production"
ON public.producao_registros
FOR SELECT
TO authenticated
USING (public.has_profile_flag(auth.uid(), 'lider_producao'));

-- Allow lider_producao to update (confirm) all production
CREATE POLICY "Lider producao can update all production"
ON public.producao_registros
FOR UPDATE
TO authenticated
USING (public.has_profile_flag(auth.uid(), 'lider_producao'));
