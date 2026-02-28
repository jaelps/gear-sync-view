import { useState } from "react";
import Layout from "@/components/Layout";
import EquipmentStatus from "@/components/dashboard/EquipmentStatus";
import { Equipamento, equipamentos as defaultEquipamentos } from "@/data/mockData";
import { CheckCircle, Wrench, AlertCircle, Download } from "lucide-react";
import { exportToExcel, importFromExcel } from "@/lib/exportExcel";
import { Button } from "@/components/ui/button";
import ExcelImportButton from "@/components/ExcelImportButton";
import AddEquipamentoForm from "@/components/forms/AddEquipamentoForm";

const Equipamentos = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(defaultEquipamentos);

  const ativos = equipamentos.filter((e) => e.status === "Ativo").length;
  const manutencao = equipamentos.filter((e) => e.status === "Manutenção").length;
  const inativos = equipamentos.filter((e) => e.status === "Inativo").length;

  const handleExport = () => {
    const data = equipamentos.map((e) => ({
      Nome: e.nome,
      Código: e.codigo,
      Tipo: e.tipo,
      Capacidade: e.capacidade,
      Status: e.status,
    }));
    exportToExcel(data, "equipamentos", "Equipamentos");
  };

  const handleImport = async (file: File) => {
    const imported = await importFromExcel<Equipamento>(file, (row, i) => {
      const status = String(row["Status"] ?? "Ativo");
      const validStatus: Equipamento["status"] =
        status === "Manutenção" || status === "Manutencao" ? "Manutenção" :
        status === "Inativo" ? "Inativo" : "Ativo";
      return {
        id: String(equipamentos.length + i + 1),
        nome: String(row["Nome"] ?? ""),
        codigo: String(row["Código"] ?? row["Codigo"] ?? ""),
        tipo: String(row["Tipo"] ?? ""),
        capacidade: Number(row["Capacidade"] ?? 0),
        status: validStatus,
      };
    });
    if (imported.length > 0) {
      setEquipamentos((prev) => [...prev, ...imported]);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipamentos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastro, status e manutenções
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddEquipamentoForm nextId={equipamentos.length + 1} onAdd={(item) => setEquipamentos((prev) => [...prev, item])} />
          <ExcelImportButton onFileSelect={handleImport} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/15">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Ativos</p>
              <p className="text-2xl font-bold text-success">{ativos}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/15">
              <Wrench className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Em Manutenção</p>
              <p className="text-2xl font-bold text-accent">{manutencao}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-destructive/15">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Inativos</p>
              <p className="text-2xl font-bold text-destructive">{inativos}</p>
            </div>
          </div>
        </div>
      </div>

      <EquipmentStatus data={equipamentos} />
    </Layout>
  );
};

export default Equipamentos;
