import Layout from "@/components/Layout";
import EmployeeBarChart from "@/components/dashboard/EmployeeBarChart";
import EmployeeRanking from "@/components/dashboard/EmployeeRanking";
import { funcionarios } from "@/data/mockData";
import { Users, Trophy, Clock } from "lucide-react";

const Funcionarios = () => {
  const totalProd = funcionarios.reduce((acc, f) => acc + f.producaoHoje, 0);
  const melhor = [...funcionarios].sort((a, b) => b.eficiencia - a.eficiencia)[0];
  const tempoMedioGeral = (funcionarios.reduce((acc, f) => acc + f.tempoMedio, 0) / funcionarios.length).toFixed(1);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhamento de produtividade e ranking
        </p>
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
        <EmployeeBarChart />
        <EmployeeRanking />
      </div>
    </Layout>
  );
};

export default Funcionarios;
