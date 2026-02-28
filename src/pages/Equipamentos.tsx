import Layout from "@/components/Layout";
import EquipmentStatus from "@/components/dashboard/EquipmentStatus";
import { equipamentos } from "@/data/mockData";
import { Settings, CheckCircle, Wrench, AlertCircle } from "lucide-react";

const Equipamentos = () => {
  const ativos = equipamentos.filter((e) => e.status === "Ativo").length;
  const manutencao = equipamentos.filter((e) => e.status === "Manutenção").length;
  const inativos = equipamentos.filter((e) => e.status === "Inativo").length;

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Equipamentos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cadastro, status e manutenções
        </p>
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

      <EquipmentStatus />
    </Layout>
  );
};

export default Equipamentos;
