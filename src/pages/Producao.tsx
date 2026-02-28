import Layout from "@/components/Layout";
import ProductionLineChart from "@/components/dashboard/ProductionLineChart";
import KPICards from "@/components/dashboard/KPICards";
import { producaoDiaria } from "@/data/mockData";
import { Factory, TrendingUp, Target } from "lucide-react";

const Producao = () => {
  const totalSemana = producaoDiaria.reduce((acc, d) => acc + d.producao, 0);
  const totalMeta = producaoDiaria.reduce((acc, d) => acc + d.meta, 0);
  const eficiencia = ((totalSemana / totalMeta) * 100).toFixed(1);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Módulo de Produção</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registro diário, indicadores e acompanhamento
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/15">
              <Factory className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Produção Semanal</p>
              <p className="text-2xl font-bold text-foreground">{totalSemana.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/15">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Meta Semanal</p>
              <p className="text-2xl font-bold text-foreground">{totalMeta.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/15">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Eficiência Geral</p>
              <p className="text-2xl font-bold text-foreground">{eficiencia}%</p>
            </div>
          </div>
        </div>
      </div>

      <ProductionLineChart />
    </Layout>
  );
};

export default Producao;
