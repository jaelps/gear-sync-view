
CREATE TYPE public.status_solicitacao AS ENUM ('solicitada', 'pendente', 'validada');

CREATE TABLE public.solicitacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  quantidade INTEGER NOT NULL DEFAULT 1,
  status status_solicitacao NOT NULL DEFAULT 'solicitada',
  criado_por UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lider can do everything" ON public.solicitacoes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'lider'))
  WITH CHECK (has_role(auth.uid(), 'lider'));

CREATE POLICY "Funcionario can view solicitacoes" ON public.solicitacoes
  FOR SELECT TO authenticated
  USING (true);
