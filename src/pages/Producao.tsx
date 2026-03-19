import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Factory, TrendingUp, Target, Download, Check, AlertTriangle, PackageMinus, Clock } from "lucide-react";
import { exportToExcel } from "@/lib/exportExcel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AddProducaoForm from "@/components/forms/AddProducaoForm";

interface ProducaoRegistro {
  id: string;
  user_id: string;
  data: string;
  tipo_producao: string;
  tempo_por_unidade: number;
  tempo_total: number;
  quantidade_produzida: number;
  meta: number;
  justificativa: string | null;
  perda_material: number;
  descricao_perda: string | null;
  confirmada: boolean;
  confirmada_por: string | null;
  confirmada_em: string | null;
  created_at: string;
  nome_funcionario?: string;
}

const formatTempo = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
};

const TIPO_LABEL: Record<string, string> = {
  "200": "200 un/dia",
  "120": "120 un/dia",
};

const Producao = () => {
  const { user, isLider, isLiderProducao } = useAuth();
  const canConfirm = isLider || isLiderProducao;
  const [registros, setRegistros] = useState<ProducaoRegistro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistros = async () => {
    const { data, error } = await supabase
      .from("producao_registros")
      .select("*")
      .order("data", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar registros.");
      return;
    }

    if (data && (isLider || isLiderProducao)) {
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, nome")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.nome]) || []);
      setRegistros(data.map((r) => ({ ...r, nome_funcionario: profileMap.get(r.user_id) || "—" })));
    } else {
      setRegistros(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistros();
  }, [user, isLider, isLiderProducao]);

  const handleConfirm = async (id: string) => {
    const { error } = await supabase
      .from("producao_registros")
      .update({
        confirmada: true,
        confirmada_por: user?.id,
        confirmada_em: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao confirmar produção.");
    } else {
      toast.success("Produção confirmada!");
      fetchRegistros();
    }
  };

  const totalProd = registros.reduce((a, r) => a + r.quantidade_produzida, 0);
  const totalMeta = registros.reduce((a, r) => a + r.meta, 0);
  const totalPerda = registros.reduce((a, r) => a + r.perda_material, 0);
  const totalTempo = registros.reduce((a, r) => a + Number(r.tempo_total || 0), 0);
  const eficiencia = totalMeta > 0 ? ((totalProd / totalMeta) * 100).toFixed(1) : "0";
  const pendentes = registros.filter((r) => !r.confirmada).length;

  const handleExport = () => {
    const data = registros.map((r) => ({
      Data: r.data,
      Funcionário: r.nome_funcionario || "—",
      Tipo: TIPO_LABEL[r.tipo_producao] || r.tipo_producao,
      Produzido: r.quantidade_produzida,
      Meta: r.meta,
      "Tempo/Un (min)": r.tempo_por_unidade,
      "Tempo Total (min)": r.tempo_total,
      "Perda Material": r.perda_material,
      Justificativa: r.justificativa || "",
      "Desc. Perda": r.descricao_perda || "",
      Confirmada: r.confirmada ? "Sim" : "Não",
    }));
    exportToExcel(data, "producao", "Produção");
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Módulo de Produção</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLider ? "Acompanhe e confirme a produção dos funcionários" : "Registre sua produção diária"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isLider && !isLiderProducao && <AddProducaoForm onAdd={fetchRegistros} />}
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15">
              <Factory className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Produção</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{totalProd.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/15">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Meta</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{totalMeta.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/30">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Tempo Total</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{formatTempo(totalTempo)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/15">
              <PackageMinus className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Perdas</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{totalPerda.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/15">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Eficiência</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{eficiencia}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pendentes badge */}
      {canConfirm && pendentes > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/30">
          <AlertTriangle className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-medium">{pendentes} registro(s) aguardando confirmação</span>
        </div>
      )}

      {/* Tabela */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-3 text-muted-foreground font-medium">Data</th>
              {canConfirm && <th className="text-left p-3 text-muted-foreground font-medium">Funcionário</th>}
              <th className="text-left p-3 text-muted-foreground font-medium">Tipo</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Produzido</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Meta</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Tempo</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Perdas</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Justificativa</th>
              <th className="text-center p-3 text-muted-foreground font-medium">Status</th>
              {canConfirm && <th className="text-center p-3 text-muted-foreground font-medium">Ação</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
              <td colSpan={canConfirm ? 10 : 8} className="p-6 text-center text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            ) : registros.length === 0 ? (
              <tr>
                <td colSpan={isLider ? 10 : 8} className="p-6 text-center text-muted-foreground">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              registros.map((r) => (
                <tr key={r.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 text-foreground whitespace-nowrap">
                    {new Date(r.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  {isLider && <td className="p-3 text-foreground">{r.nome_funcionario}</td>}
                  <td className="p-3 text-foreground text-xs">
                    <Badge variant="secondary" className="font-normal">
                      {TIPO_LABEL[r.tipo_producao] || r.tipo_producao}
                    </Badge>
                  </td>
                  <td className="p-3 text-right text-foreground font-medium">{r.quantidade_produzida}</td>
                  <td className="p-3 text-right text-muted-foreground">{r.meta}</td>
                  <td className="p-3 text-right text-foreground whitespace-nowrap">
                    {formatTempo(Number(r.tempo_total || 0))}
                  </td>
                  <td className="p-3 text-right">
                    {r.perda_material > 0 ? (
                      <span className="text-destructive font-medium" title={r.descricao_perda || ""}>
                        {r.perda_material}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="p-3 text-muted-foreground max-w-[200px] truncate" title={r.justificativa || ""}>
                    {r.justificativa || "—"}
                  </td>
                  <td className="p-3 text-center">
                    {r.confirmada ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                        Confirmada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-xs">
                        Pendente
                      </Badge>
                    )}
                  </td>
                  {isLider && (
                    <td className="p-3 text-center">
                      {!r.confirmada && (
                        <Button size="sm" variant="ghost" onClick={() => handleConfirm(r.id)} className="gap-1 text-success hover:text-success">
                          <Check className="w-4 h-4" /> Confirmar
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Producao;
