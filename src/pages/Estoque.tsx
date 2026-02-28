import Layout from "@/components/Layout";
import InventoryTable from "@/components/dashboard/InventoryTable";
import ConsumptionPieChart from "@/components/dashboard/ConsumptionPieChart";
import { insumos } from "@/data/mockData";
import { AlertTriangle, Package, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportExcel";
import { Button } from "@/components/ui/button";

const Estoque = () => {
  const criticos = insumos.filter((i) => i.qtdAtual < i.estoqueMinimo);
  const totalItens = insumos.length;
  const custoTotal = insumos.reduce((acc, i) => acc + i.qtdAtual * i.custoUnitario, 0);

  const handleExport = () => {
    const data = insumos.map((i) => ({
      Nome: i.nome,
      Código: i.codigo,
      Categoria: i.categoria,
      Unidade: i.unidade,
      "Qtd Atual": i.qtdAtual,
      "Estoque Mínimo": i.estoqueMinimo,
      Fornecedor: i.fornecedor,
      "Custo Unitário": i.custoUnitario,
      "Data Entrada": i.dataEntrada,
      "Data Validade": i.dataValidade || "",
      Status: i.qtdAtual < i.estoqueMinimo ? "Crítico" : "OK",
    }));
    exportToExcel(data, "estoque-insumos", "Estoque");
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Controle de Estoque</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão de insumos, alertas e movimentação
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" /> Exportar Excel
        </Button>
      </div>

      {/* KPIs de estoque */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/15">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total de Insumos</p>
              <p className="text-2xl font-bold text-foreground">{totalItens}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-destructive/15">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Itens Críticos</p>
              <p className="text-2xl font-bold text-destructive">{criticos.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/15">
              <Package className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Custo em Estoque</p>
              <p className="text-2xl font-bold text-foreground">R$ {custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <InventoryTable />
        </div>
        <ConsumptionPieChart />
      </div>
    </Layout>
  );
};

export default Estoque;
