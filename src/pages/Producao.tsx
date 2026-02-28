import { useState } from "react";
import Layout from "@/components/Layout";
import ProductionLineChart from "@/components/dashboard/ProductionLineChart";
import { producaoDiaria as defaultProducao } from "@/data/mockData";
import { Factory, TrendingUp, Target, Download } from "lucide-react";
import { exportToExcel, importFromExcel } from "@/lib/exportExcel";
import { Button } from "@/components/ui/button";
import ExcelImportButton from "@/components/ExcelImportButton";

const Producao = () => {
  const [producaoDiaria, setProducaoDiaria] = useState(defaultProducao);

  const totalSemana = producaoDiaria.reduce((acc, d) => acc + d.producao, 0);
  const totalMeta = producaoDiaria.reduce((acc, d) => acc + d.meta, 0);
  const eficiencia = ((totalSemana / totalMeta) * 100).toFixed(1);

  const handleExport = () => {
    const data = producaoDiaria.map((d) => ({
      Dia: d.dia,
      Produção: d.producao,
      Meta: d.meta,
      "Eficiência (%)": ((d.producao / d.meta) * 100).toFixed(1),
    }));
    exportToExcel(data, "producao-diaria", "Produção");
  };

  const handleImport = async (file: File) => {
    const imported = await importFromExcel(file, (row) => ({
      dia: String(row["Dia"] ?? ""),
      producao: Number(row["Produção"] ?? row["Producao"] ?? 0),
      meta: Number(row["Meta"] ?? 0),
    }));
    if (imported.length > 0) {
      setProducaoDiaria((prev) => [...prev, ...imported]);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Módulo de Produção</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro diário, indicadores e acompanhamento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExcelImportButton onFileSelect={handleImport} />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Exportar Excel
          </Button>
        </div>
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
