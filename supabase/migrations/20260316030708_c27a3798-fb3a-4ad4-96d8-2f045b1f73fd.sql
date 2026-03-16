
ALTER TABLE public.producao_registros
ADD COLUMN tipo_producao text NOT NULL DEFAULT '200',
ADD COLUMN tempo_por_unidade numeric(5,2) NOT NULL DEFAULT 2.4,
ADD COLUMN tempo_total numeric(8,2) NOT NULL DEFAULT 0;
