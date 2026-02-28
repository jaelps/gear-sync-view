import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Funcionario } from "@/data/mockData";
import { toast } from "sonner";

interface Props {
  onAdd: (item: Funcionario) => void;
  nextId: number;
}

export default function AddFuncionarioForm({ onAdd, nextId }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", producaoHoje: "", metaDiaria: "150", eficiencia: "", tempoMedio: "" });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }
    const producao = Number(form.producaoHoje) || 0;
    const meta = Number(form.metaDiaria) || 150;
    onAdd({
      id: String(nextId),
      nome: form.nome.trim(),
      producaoHoje: producao,
      metaDiaria: meta,
      eficiencia: form.eficiencia ? Number(form.eficiencia) : meta > 0 ? parseFloat(((producao / meta) * 100).toFixed(1)) : 0,
      tempoMedio: Number(form.tempoMedio) || 0,
    });
    toast.success("Funcionário adicionado!");
    setForm({ nome: "", producaoHoje: "", metaDiaria: "150", eficiencia: "", tempoMedio: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Funcionário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cadastrar Funcionário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" value={form.nome} onChange={(e) => update("nome", e.target.value)} maxLength={100} />
          </div>
          <div>
            <Label htmlFor="producaoHoje">Produção Hoje</Label>
            <Input id="producaoHoje" type="number" min="0" value={form.producaoHoje} onChange={(e) => update("producaoHoje", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="metaDiaria">Meta Diária</Label>
            <Input id="metaDiaria" type="number" min="0" value={form.metaDiaria} onChange={(e) => update("metaDiaria", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="eficiencia">Eficiência (%) <span className="text-muted-foreground text-xs">(auto se vazio)</span></Label>
            <Input id="eficiencia" type="number" min="0" step="0.1" value={form.eficiencia} onChange={(e) => update("eficiencia", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tempoMedio">Tempo Médio (min)</Label>
            <Input id="tempoMedio" type="number" min="0" step="0.1" value={form.tempoMedio} onChange={(e) => update("tempoMedio", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" size="sm">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
