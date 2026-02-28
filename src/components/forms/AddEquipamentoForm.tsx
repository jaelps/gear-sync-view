import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Equipamento } from "@/data/mockData";
import { toast } from "sonner";

interface Props {
  onAdd: (item: Equipamento) => void;
  nextId: number;
}

export default function AddEquipamentoForm({ onAdd, nextId }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", codigo: "", tipo: "", capacidade: "", status: "Ativo" as Equipamento["status"] });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.codigo.trim()) {
      toast.error("Nome e Código são obrigatórios.");
      return;
    }
    onAdd({
      id: String(nextId),
      nome: form.nome.trim(),
      codigo: form.codigo.trim(),
      tipo: form.tipo.trim(),
      capacidade: Number(form.capacidade) || 0,
      status: form.status,
    });
    toast.success("Equipamento adicionado!");
    setForm({ nome: "", codigo: "", tipo: "", capacidade: "", status: "Ativo" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Equipamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cadastrar Equipamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" value={form.nome} onChange={(e) => update("nome", e.target.value)} maxLength={100} />
          </div>
          <div>
            <Label htmlFor="codigo">Código *</Label>
            <Input id="codigo" value={form.codigo} onChange={(e) => update("codigo", e.target.value)} maxLength={20} />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Input id="tipo" value={form.tipo} onChange={(e) => update("tipo", e.target.value)} maxLength={50} />
          </div>
          <div>
            <Label htmlFor="capacidade">Capacidade (un/dia)</Label>
            <Input id="capacidade" type="number" min="0" value={form.capacidade} onChange={(e) => update("capacidade", e.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
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
