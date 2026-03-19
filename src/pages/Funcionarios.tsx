import { useState } from "react";
import Layout from "@/components/Layout";
import EmployeeBarChart from "@/components/dashboard/EmployeeBarChart";
import EmployeeRanking from "@/components/dashboard/EmployeeRanking";
import { Funcionario, funcionarios as defaultFuncionarios } from "@/data/mockData";
import { Users, Trophy, Clock, Download } from "lucide-react";
import { exportToExcel, importFromExcel } from "@/lib/exportExcel";
import { Button } from "@/components/ui/button";
import ExcelImportButton from "@/components/ExcelImportButton";
import AddFuncionarioForm from "@/components/forms/AddFuncionarioForm";

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(defaultFuncionarios);

  const totalProd = funcionarios.reduce((acc, f) => acc + f.producaoHoje, 0);
  const melhor = [...funcionarios].sort((a, b) => b.eficiencia - a.eficiencia)[0] ?? null;
  const tempoMedioGeral = funcionarios.length > 0
    ? (funcionarios.reduce((acc, f) => acc + f.tempoMedio, 0) / funcionarios.length).toFixed(1)
    : "0";

  const handleExport = () => {
    const data = funcionarios.map((f) => ({
      Nome: f.nome,
      "Produção Hoje": f.producaoHoje,
      "Meta Diária": f.metaDiaria,
      "Eficiência (%)": f.eficiencia,
      "Tempo Médio (min)": f.tempoMedio,
    }));
    exportToExcel(data, "funcionarios", "Funcionários");
  };

  const handleImport = async (file: File) => {
    const imported = await importFromExcel<Funcionario>(file, (row, i) => ({
      id: String(funcionarios.length + i + 1),
      nome: String(row["Nome"] ?? ""),
      producaoHoje: Number(row["Produção Hoje"] ?? row["Producao Hoje"] ?? 0),
      metaDiaria: Number(row["Meta Diária"] ?? row["Meta Diaria"] ?? 0),
      eficiencia: Number(row["Eficiência (%)"] ?? row["Eficiencia (%)"] ?? 0),
      tempoMedio: Number(row["Tempo Médio (min)"] ?? row["Tempo Medio (min)"] ?? 0),
    }));
    if (imported.length > 0) {
      setFuncionarios((prev) => [...prev, ...imported]);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhamento de produtividade e ranking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddFuncionarioForm nextId={funcionarios.length + 1} onAdd={(item) => setFuncionarios((prev) => [...prev, item])} />
          <ExcelImportButton onFileSelect={handleImport} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/15">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Produção Total Hoje</p>
              <p className="text-2xl font-bold text-foreground">{totalProd}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/15">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Destaque do Dia</p>
              <p className="text-2xl font-bold text-foreground">{melhor.nome.split(" ")[0]}</p>
              <p className="text-xs text-success">{melhor.eficiencia}% eficiência</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/15">
              <Clock className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Tempo Médio</p>
              <p className="text-2xl font-bold text-foreground">{tempoMedioGeral} min</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EmployeeBarChart data={funcionarios} />
        <EmployeeRanking data={funcionarios} />
      </div>
    </Layout>
  );
};

export default Funcionarios;
