import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ProducaoItem {
  dia: string;
  producao: number;
  meta: number;
}

interface Props {
  onAdd: (item: ProducaoItem) => void;
}

export default function AddProducaoForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ dia: "", producao: "", meta: "" });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dia.trim()) {
      toast.error("O campo Dia é obrigatório.");
      return;
    }
    onAdd({
      dia: form.dia.trim(),
      producao: Number(form.producao) || 0,
      meta: Number(form.meta) || 0,
    });
    toast.success("Registro de produção adicionado!");
    setForm({ dia: "", producao: "", meta: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Registro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Registrar Produção</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <Label htmlFor="dia">Dia / Data *</Label>
            <Input id="dia" value={form.dia} onChange={(e) => update("dia", e.target.value)} placeholder="Ex: Seg, 01/03" maxLength={20} />
          </div>
          <div>
            <Label htmlFor="producao">Quantidade Produzida</Label>
            <Input id="producao" type="number" min="0" value={form.producao} onChange={(e) => update("producao", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="meta">Meta</Label>
            <Input id="meta" type="number" min="0" value={form.meta} onChange={(e) => update("meta", e.target.value)} />
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
