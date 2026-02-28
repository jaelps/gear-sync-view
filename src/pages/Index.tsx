import Layout from "@/components/Layout";
import KPICards from "@/components/dashboard/KPICards";
import ProductionLineChart from "@/components/dashboard/ProductionLineChart";
import EmployeeBarChart from "@/components/dashboard/EmployeeBarChart";
import ConsumptionPieChart from "@/components/dashboard/ConsumptionPieChart";
import InventoryTable from "@/components/dashboard/InventoryTable";
import EmployeeRanking from "@/components/dashboard/EmployeeRanking";
import EquipmentStatus from "@/components/dashboard/EquipmentStatus";
import { CalendarDays } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard de Produção</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Controle de estoque, produção e eficiência
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">
          <CalendarDays className="w-4 h-4" />
          28 Fev 2026
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProductionLineChart />
        <EmployeeBarChart />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConsumptionPieChart />
        <EmployeeRanking />
        <EquipmentStatus />
      </div>

      {/* Inventory Table */}
      <InventoryTable />
    </Layout>
  );
};

export default Index;
