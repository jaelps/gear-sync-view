import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const TIPOS_PRODUCAO = [
  { value: "200", label: "200 un/dia (2,4 min/un)", tempoPorUnidade: 2.4 },
  { value: "120", label: "120 un/dia (4,0 min/un)", tempoPorUnidade: 4.0 },
];

interface Props {
  onAdd: () => void;
}

export default function AddProducaoForm({ onAdd }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    data: new Date().toISOString().split("T")[0],
    tipo_producao: "200",
    quantidade_produzida: "",
    meta: "",
    justificativa: "",
    perda_material: "",
    descricao_perda: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const tipoSelecionado = TIPOS_PRODUCAO.find((t) => t.value === form.tipo_producao) || TIPOS_PRODUCAO[0];
  const qtd = Number(form.quantidade_produzida) || 0;
  const tempoTotal = useMemo(() => qtd * tipoSelecionado.tempoPorUnidade, [qtd, tipoSelecionado]);

  const formatTempo = (min: number) => {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.data) {
      toast.error("Informe a data.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("producao_registros").insert({
      user_id: user.id,
      data: form.data,
      tipo_producao: form.tipo_producao,
      tempo_por_unidade: tipoSelecionado.tempoPorUnidade,
      tempo_total: parseFloat(tempoTotal.toFixed(2)),
      quantidade_produzida: qtd,
      meta: Number(form.meta) || 0,
      justificativa: form.justificativa.trim() || null,
      perda_material: Number(form.perda_material) || 0,
      descricao_perda: form.descricao_perda.trim() || null,
    });

    if (error) {
      toast.error("Erro ao salvar registro.");
    } else {
      toast.success("Produção registrada!");
      setForm({
        data: new Date().toISOString().split("T")[0],
        tipo_producao: "200",
        quantidade_produzida: "",
        meta: "",
        justificativa: "",
        perda_material: "",
        descricao_perda: "",
      });
      setOpen(false);
      onAdd();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Registro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Produção</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="data">Data *</Label>
            <Input id="data" type="date" value={form.data} onChange={(e) => update("data", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo de Produção</Label>
            <Select value={form.tipo_producao} onValueChange={(v) => update("tipo_producao", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_PRODUCAO.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="quantidade">Qtd. Produzida</Label>
              <Input id="quantidade" type="number" min="0" value={form.quantidade_produzida} onChange={(e) => update("quantidade_produzida", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="meta">Meta</Label>
              <Input id="meta" type="number" min="0" value={form.meta} onChange={(e) => update("meta", e.target.value)} />
            </div>
          </div>

          {/* Tempo calculado */}
          {qtd > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Clock className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">Tempo total: </span>
                <span className="font-semibold text-foreground">{formatTempo(tempoTotal)}</span>
                <span className="text-muted-foreground ml-1">({tipoSelecionado.tempoPorUnidade} min/un × {qtd} un)</span>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="justificativa">Justificativa (opcional)</Label>
            <Textarea
              id="justificativa"
              value={form.justificativa}
              onChange={(e) => update("justificativa", e.target.value)}
              placeholder="Motivo de variação na produção..."
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="perda">Perda de Material</Label>
              <Input id="perda" type="number" min="0" value={form.perda_material} onChange={(e) => update("perda_material", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="desc_perda">Descrição da Perda</Label>
              <Input id="desc_perda" value={form.descricao_perda} onChange={(e) => update("descricao_perda", e.target.value)} placeholder="Tipo de material..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
