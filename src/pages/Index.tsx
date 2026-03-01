import { useState } from "react";
import Layout from "@/components/Layout";
import KPICards from "@/components/dashboard/KPICards";
import ProductionLineChart from "@/components/dashboard/ProductionLineChart";
import EmployeeBarChart from "@/components/dashboard/EmployeeBarChart";
import ConsumptionPieChart from "@/components/dashboard/ConsumptionPieChart";
import InventoryTable from "@/components/dashboard/InventoryTable";
import EmployeeRanking from "@/components/dashboard/EmployeeRanking";
import EquipmentStatus from "@/components/dashboard/EquipmentStatus";
import AddInsumoForm from "@/components/forms/AddInsumoForm";
import AddFuncionarioForm from "@/components/forms/AddFuncionarioForm";
import AddEquipamentoForm from "@/components/forms/AddEquipamentoForm";
import { Button } from "@/components/ui/button";
import { Download, CalendarDays } from "lucide-react";
import { exportMultiSheetReport } from "@/lib/exportExcel";
import { toast } from "sonner";
import {
  Insumo,
  Funcionario,
  Equipamento,
  insumos as defaultInsumos,
  funcionarios as defaultFuncionarios,
  equipamentos as defaultEquipamentos,
} from "@/data/mockData";

const Index = () => {
  const [insumos, setInsumos] = useState<Insumo[]>(defaultInsumos);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(defaultFuncionarios);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(defaultEquipamentos);

  // Insumos CRUD
  const addInsumo = (item: Insumo) => setInsumos((prev) => [...prev, item]);
  const deleteInsumo = (id: string) => {
    setInsumos((prev) => prev.filter((i) => i.id !== id));
    toast.success("Insumo removido.");
  };
  const updateInsumoQtd = (id: string, delta: number) => {
    setInsumos((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qtdAtual: Math.max(0, i.qtdAtual + delta) } : i
      )
    );
  };

  // Funcionarios CRUD
  const addFuncionario = (item: Funcionario) => setFuncionarios((prev) => [...prev, item]);
  const deleteFuncionario = (id: string) => {
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    toast.success("Funcionário removido.");
  };

  // Equipamentos CRUD
  const addEquipamento = (item: Equipamento) => setEquipamentos((prev) => [...prev, item]);
  const deleteEquipamento = (id: string) => {
    setEquipamentos((prev) => prev.filter((e) => e.id !== id));
    toast.success("Equipamento removido.");
  };

  const handleExportReport = () => {
    const now = new Date().toLocaleDateString("pt-BR");

    // Resumo
    const estoqueCritico = insumos.filter((i) => i.qtdAtual < i.estoqueMinimo).length;
    const emProducao = equipamentos.filter((e) => e.status === "Em Produção").length;
    const melhorFunc = [...funcionarios].sort((a, b) => b.eficiencia - a.eficiencia)[0];
    const resumo = [
      { Indicador: "Data do Relatório", Valor: now },
      { Indicador: "Total de Insumos", Valor: insumos.length },
      { Indicador: "Itens em Estoque Crítico", Valor: estoqueCritico },
      { Indicador: "Total de Funcionários", Valor: funcionarios.length },
      { Indicador: "Melhor Eficiência", Valor: melhorFunc ? `${melhorFunc.nome} (${melhorFunc.eficiencia}%)` : "-" },
      { Indicador: "Total de Equipamentos", Valor: equipamentos.length },
      { Indicador: "Em Produção", Valor: emProducao },
      { Indicador: "Finalizados", Valor: equipamentos.length - emProducao },
    ];

    const insumoData = insumos.map((i) => ({
      Nome: i.nome,
      Código: i.codigo,
      Categoria: i.categoria,
      "Qtd Atual": i.qtdAtual,
      Unidade: i.unidade,
      "Estoque Mínimo": i.estoqueMinimo,
      Fornecedor: i.fornecedor,
      "Data Entrada": i.dataEntrada,
      Status: i.qtdAtual < i.estoqueMinimo ? "Crítico" : "OK",
    }));

    const funcData = funcionarios.map((f) => ({
      Nome: f.nome,
      "Produção Hoje": f.producaoHoje,
      "Meta Diária": f.metaDiaria,
      "Eficiência (%)": f.eficiencia,
      "Tempo Médio (min)": f.tempoMedio,
    }));

    const eqData = equipamentos.map((e) => ({
      Nome: e.nome,
      Código: e.codigo,
      Tipo: e.tipo,
      "Capacidade (un/dia)": e.capacidade,
      Status: e.status,
    }));

    exportMultiSheetReport(
      [
        { name: "Resumo", data: resumo as Record<string, unknown>[] },
        { name: "Estoque", data: insumoData as Record<string, unknown>[] },
        { name: "Funcionários", data: funcData as Record<string, unknown>[] },
        { name: "Equipamentos", data: eqData as Record<string, unknown>[] },
      ],
      `relatorio-completo-${new Date().toISOString().slice(0, 10)}`
    );
    toast.success("Relatório completo exportado com sucesso!");
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard de Produção</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie estoque, funcionários e equipamentos em um só lugar
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AddInsumoForm nextId={insumos.length + 1} onAdd={addInsumo} />
          <AddFuncionarioForm nextId={funcionarios.length + 1} onAdd={addFuncionario} />
          <AddEquipamentoForm nextId={equipamentos.length + 1} onAdd={addEquipamento} />
          <Button variant="outline" size="sm" onClick={handleExportReport} className="gap-2">
            <Download className="w-4 h-4" /> Relatório
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards insumos={insumos} funcionarios={funcionarios} equipamentos={equipamentos} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProductionLineChart />
        <EmployeeBarChart data={funcionarios} />
      </div>

      {/* Funcionários & Equipamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConsumptionPieChart />
        <EmployeeRanking data={funcionarios} onDelete={deleteFuncionario} />
        <EquipmentStatus data={equipamentos} onDelete={deleteEquipamento} />
      </div>

      {/* Inventory Table with quantity controls and delete */}
      <InventoryTable data={insumos} onDelete={deleteInsumo} onUpdateQtd={updateInsumoQtd} />
    </Layout>
  );
};

export default Index;
