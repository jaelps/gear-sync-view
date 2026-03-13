
CREATE TABLE public.metas_pessoais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  titulo text NOT NULL,
  descricao text,
  valor_meta integer NOT NULL DEFAULT 0,
  valor_atual integer NOT NULL DEFAULT 0,
  unidade text NOT NULL DEFAULT 'peças',
  data_inicio date NOT NULL DEFAULT CURRENT_DATE,
  data_fim date,
  concluida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.metas_pessoais ENABLE ROW LEVEL SECURITY;

-- Employees can manage their own goals
CREATE POLICY "Users can view own metas" ON public.metas_pessoais
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metas" ON public.metas_pessoais
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metas" ON public.metas_pessoais
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own metas" ON public.metas_pessoais
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Leaders can view all goals
CREATE POLICY "Lider can view all metas" ON public.metas_pessoais
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'lider'::app_role));
