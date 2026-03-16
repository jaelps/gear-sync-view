
-- Tabela de registros de produção
CREATE TABLE public.producao_registros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  quantidade_produzida INTEGER NOT NULL DEFAULT 0,
  meta INTEGER NOT NULL DEFAULT 0,
  justificativa TEXT,
  perda_material INTEGER NOT NULL DEFAULT 0,
  descricao_perda TEXT,
  confirmada BOOLEAN NOT NULL DEFAULT false,
  confirmada_por UUID REFERENCES auth.users(id),
  confirmada_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.producao_registros ENABLE ROW LEVEL SECURITY;

-- Funcionários podem ver seus próprios registros
CREATE POLICY "Users can view own production" ON public.producao_registros
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Funcionários podem inserir seus próprios registros
CREATE POLICY "Users can insert own production" ON public.producao_registros
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Funcionários podem atualizar seus próprios registros (apenas não confirmados)
CREATE POLICY "Users can update own unconfirmed production" ON public.producao_registros
  FOR UPDATE TO authenticated USING (auth.uid() = user_id AND confirmada = false);

-- Líder pode ver todos os registros
CREATE POLICY "Lider can view all production" ON public.producao_registros
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'lider'::app_role));

-- Líder pode atualizar todos os registros (para confirmar)
CREATE POLICY "Lider can update all production" ON public.producao_registros
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'lider'::app_role));

-- Líder pode deletar registros
CREATE POLICY "Lider can delete production" ON public.producao_registros
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'lider'::app_role));
