import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ClipboardList, Clock, CheckCircle2, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type StatusSolicitacao = "solicitada" | "pendente" | "validada";

interface Solicitacao {
  id: string;
  titulo: string;
  descricao: string | null;
  quantidade: number;
  status: StatusSolicitacao;
  criado_por: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<StatusSolicitacao, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  solicitada: { label: "Peças Solicitadas", icon: ClipboardList, color: "text-primary", bg: "bg-primary/15" },
  pendente: { label: "Peças Pendentes", icon: Clock, color: "text-accent", bg: "bg-accent/15" },
  validada: { label: "Peças Validadas", icon: CheckCircle2, color: "text-success", bg: "bg-success/15" },
};

const nextStatus: Record<StatusSolicitacao, StatusSolicitacao | null> = {
  solicitada: "pendente",
  pendente: "validada",
  validada: null,
};

export default function Pendencias() {
  const { isLider, user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const fetchSolicitacoes = async () => {
    const { data, error } = await supabase
      .from("solicitacoes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar solicitações");
      console.error(error);
    } else {
      setSolicitacoes((data as unknown as Solicitacao[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSolicitacoes();

    const channel = supabase
      .channel("solicitacoes-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "solicitacoes" }, () => {
        fetchSolicitacoes();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleCreate = async () => {
    if (!titulo.trim()) { toast.error("Título é obrigatório"); return; }
    const { error } = await supabase.from("solicitacoes").insert({
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      quantidade,
      criado_por: user?.id ?? "",
    } as any);
    if (error) { toast.error("Erro ao criar solicitação"); console.error(error); return; }
    toast.success("Solicitação criada!");
    setTitulo(""); setDescricao(""); setQuantidade(1); setDialogOpen(false);
  };

  const handleStatusChange = async (id: string, newStatus: StatusSolicitacao) => {
    const { error } = await supabase
      .from("solicitacoes")
      .update({ status: newStatus, updated_at: new Date().toISOString() } as any)
      .eq("id", id);
    if (error) { toast.error("Erro ao atualizar status"); console.error(error); return; }
    toast.success(`Status atualizado para ${statusConfig[newStatus].label}`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("solicitacoes").delete().eq("id", id);
    if (error) { toast.error("Erro ao excluir"); console.error(error); return; }
    toast.success("Solicitação excluída");
  };

  const columns: StatusSolicitacao[] = ["solicitada", "pendente", "validada"];

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pendências</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de peças solicitadas, pendentes e validadas
          </p>
        </div>
        {isLider && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Nova Solicitação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Solicitação de Peça</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Título</label>
                  <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Parafuso M8 para linha A" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Descrição</label>
                  <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes da solicitação..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Quantidade</label>
                  <Input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
                </div>
                <Button onClick={handleCreate} className="w-full">Criar Solicitação</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((status) => {
            const config = statusConfig[status];
            const items = solicitacoes.filter((s) => s.status === status);
            const Icon = config.icon;
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <div className={`p-1.5 rounded-md ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">{config.label}</h2>
                  <Badge variant="secondary" className="ml-auto text-xs">{items.length}</Badge>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">Nenhum item</p>
                ) : (
                  items.map((item) => (
                    <Card key={item.id} className="p-4 space-y-2 bg-card border-border">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-foreground leading-tight">{item.titulo}</h3>
                        <Badge variant="outline" className="shrink-0 text-xs">{item.quantidade}x</Badge>
                      </div>
                      {item.descricao && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.descricao}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("pt-BR")}
                      </p>
                      {isLider && (
                        <div className="flex items-center gap-1 pt-1">
                          {nextStatus[status] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => handleStatusChange(item.id, nextStatus[status]!)}
                            >
                              <ArrowRight className="w-3 h-3" />
                              {statusConfig[nextStatus[status]!].label.replace("Peças ", "")}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive ml-auto"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
