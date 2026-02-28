import Layout from "@/components/Layout";
import InventoryTable from "@/components/dashboard/InventoryTable";
import ConsumptionPieChart from "@/components/dashboard/ConsumptionPieChart";
import { insumos } from "@/data/mockData";
import { AlertTriangle, Package } from "lucide-react";

const Estoque = () => {
  const criticos = insumos.filter((i) => i.qtdAtual < i.estoqueMinimo);
  const totalItens = insumos.length;
  const custoTotal = insumos.reduce((acc, i) => acc + i.qtdAtual * i.custoUnitario, 0);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Controle de Estoque</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestão de insumos, alertas e movimentação
        </p>
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
