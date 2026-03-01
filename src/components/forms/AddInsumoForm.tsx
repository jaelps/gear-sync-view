import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Insumo } from "@/data/mockData";
import { toast } from "sonner";

interface Props {
  onAdd: (item: Insumo) => void;
  nextId: number;
}

export default function AddInsumoForm({ onAdd, nextId }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "", codigo: "", categoria: "", unidade: "kg",
    qtdAtual: "", estoqueMinimo: "", fornecedor: "",
    dataEntrada: new Date().toISOString().slice(0, 10),
  });

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
      categoria: form.categoria.trim(),
      unidade: form.unidade.trim(),
      qtdAtual: Number(form.qtdAtual) || 0,
      estoqueMinimo: Number(form.estoqueMinimo) || 0,
      fornecedor: form.fornecedor.trim(),
      dataEntrada: form.dataEntrada,
    });
    toast.success("Insumo adicionado!");
    setForm({ nome: "", codigo: "", categoria: "", unidade: "kg", qtdAtual: "", estoqueMinimo: "", fornecedor: "", dataEntrada: new Date().toISOString().slice(0, 10) });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Novo Insumo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Insumo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-2">
          <div className="col-span-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" value={form.nome} onChange={(e) => update("nome", e.target.value)} maxLength={100} />
          </div>
          <div>
            <Label htmlFor="codigo">Código *</Label>
            <Input id="codigo" value={form.codigo} onChange={(e) => update("codigo", e.target.value)} maxLength={20} />
          </div>
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input id="categoria" value={form.categoria} onChange={(e) => update("categoria", e.target.value)} maxLength={50} />
          </div>
          <div>
            <Label htmlFor="unidade">Unidade</Label>
            <Input id="unidade" value={form.unidade} onChange={(e) => update("unidade", e.target.value)} maxLength={10} />
          </div>
          <div>
            <Label htmlFor="qtdAtual">Qtd Atual</Label>
            <Input id="qtdAtual" type="number" min="0" value={form.qtdAtual} onChange={(e) => update("qtdAtual", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
            <Input id="estoqueMinimo" type="number" min="0" value={form.estoqueMinimo} onChange={(e) => update("estoqueMinimo", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input id="fornecedor" value={form.fornecedor} onChange={(e) => update("fornecedor", e.target.value)} maxLength={100} />
          </div>
          <div>
            <Label htmlFor="dataEntrada">Data Entrada</Label>
            <Input id="dataEntrada" type="date" value={form.dataEntrada} onChange={(e) => update("dataEntrada", e.target.value)} />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" size="sm">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
