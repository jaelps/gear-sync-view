ALTER TABLE public.profiles ADD COLUMN responsavel_estoque boolean NOT NULL DEFAULT false;

-- Allow leaders to view all profiles
CREATE POLICY "Lider can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'lider'));

-- Allow leaders to update any profile
CREATE POLICY "Lider can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'lider'));
