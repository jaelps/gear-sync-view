import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Target, Plus, Trash2, CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Meta {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string | null;
  valor_meta: number;
  valor_atual: number;
  unidade: string;
  data_inicio: string;
  data_fim: string | null;
  concluida: boolean;
  created_at: string;
}

const MetasPessoais = () => {
  const { user } = useAuth();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // form state
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorMeta, setValorMeta] = useState("");
  const [unidade, setUnidade] = useState("peças");
  const [dataFim, setDataFim] = useState("");

  const fetchMetas = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("metas_pessoais")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMetas((data as Meta[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetas();
  }, [user]);

  const handleCreate = async () => {
    if (!user || !titulo || !valorMeta) return;
    const { error } = await supabase.from("metas_pessoais").insert({
      user_id: user.id,
      titulo,
      descricao: descricao || null,
      valor_meta: Number(valorMeta),
      unidade,
      data_fim: dataFim || null,
    });
    if (error) {
      toast.error("Erro ao criar meta");
      return;
    }
    toast.success("Meta criada!");
    setTitulo("");
    setDescricao("");
    setValorMeta("");
    setUnidade("peças");
    setDataFim("");
    setOpen(false);
    fetchMetas();
  };

  const handleUpdateProgress = async (meta: Meta, novoValor: number) => {
    const concluida = novoValor >= meta.valor_meta;
    await supabase
      .from("metas_pessoais")
      .update({ valor_atual: novoValor, concluida, updated_at: new Date().toISOString() })
      .eq("id", meta.id);
    if (concluida) toast.success(`Meta "${meta.titulo}" concluída! 🎉`);
    fetchMetas();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("metas_pessoais").delete().eq("id", id);
    toast.success("Meta excluída");
    fetchMetas();
  };

  const ativas = metas.filter((m) => !m.concluida);
  const concluidas = metas.filter((m) => m.concluida);
  const progresso =
    metas.length > 0
      ? Math.round((concluidas.length / metas.length) * 100)
      : 0;

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Metas Pessoais</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Defina e acompanhe suas metas de produtividade
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Meta</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Input
                placeholder="Título da meta"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Valor da meta"
                  value={valorMeta}
                  onChange={(e) => setValorMeta(e.target.value)}
                />
                <Input
                  placeholder="Unidade (ex: peças)"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                />
              </div>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
              <Button onClick={handleCreate} className="w-full" disabled={!titulo || !valorMeta}>
                Criar Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/15">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Metas Ativas</p>
              <p className="text-2xl font-bold text-foreground">{ativas.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/15">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Concluídas</p>
              <p className="text-2xl font-bold text-foreground">{concluidas.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/15">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Progresso Geral</p>
              <p className="text-2xl font-bold text-foreground">{progresso}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metas List */}
      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : metas.length === 0 ? (
        <div className="glass-card p-8 sm:p-12 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma meta criada ainda.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em "Nova Meta" para começar!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {ativas.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Em andamento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ativas.map((meta) => (
                  <MetaCard
                    key={meta.id}
                    meta={meta}
                    onUpdateProgress={handleUpdateProgress}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {concluidas.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Concluídas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {concluidas.map((meta) => (
                  <MetaCard
                    key={meta.id}
                    meta={meta}
                    onUpdateProgress={handleUpdateProgress}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

function MetaCard({
  meta,
  onUpdateProgress,
  onDelete,
}: {
  meta: Meta;
  onUpdateProgress: (meta: Meta, val: number) => void;
  onDelete: (id: string) => void;
}) {
  const [editValue, setEditValue] = useState(String(meta.valor_atual));
  const pct = Math.min(Math.round((meta.valor_atual / meta.valor_meta) * 100), 100);

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          {meta.concluida ? (
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          )}
          <div className="min-w-0">
            <p className={`font-semibold text-sm truncate ${meta.concluida ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {meta.titulo}
            </p>
            {meta.descricao && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{meta.descricao}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(meta.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {meta.valor_atual} / {meta.valor_meta} {meta.unidade}
          </span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {!meta.concluida && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            min={0}
          />
          <Button
            size="sm"
            variant="secondary"
            className="shrink-0 h-8"
            onClick={() => onUpdateProgress(meta, Number(editValue))}
          >
            Atualizar
          </Button>
        </div>
      )}

      {meta.data_fim && (
        <p className="text-xs text-muted-foreground">
          Prazo: {new Date(meta.data_fim).toLocaleDateString("pt-BR")}
        </p>
      )}
    </div>
  );
}

export default MetasPessoais;
