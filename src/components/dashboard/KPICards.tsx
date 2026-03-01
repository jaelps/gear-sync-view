import { Package, DollarSign, AlertTriangle, Trophy, Users, Settings } from "lucide-react";
import { Insumo, Funcionario, Equipamento } from "@/data/mockData";

interface Props {
  insumos: Insumo[];
  funcionarios: Funcionario[];
  equipamentos: Equipamento[];
}

export default function KPICards({ insumos, funcionarios, equipamentos }: Props) {
  const estoqueCritico = insumos.filter((i) => i.qtdAtual < i.estoqueMinimo).length;
  const totalItens = insumos.reduce((s, i) => s + i.qtdAtual, 0);
  const custoTotal = insumos.reduce((s, i) => s + i.qtdAtual * i.custoUnitario, 0);
  const melhor = [...funcionarios].sort((a, b) => b.eficiencia - a.eficiencia)[0];
  const ativos = equipamentos.filter((e) => e.status === "Ativo").length;

  const kpis = [
    {
      title: "Itens em Estoque",
      value: totalItens.toLocaleString("pt-BR"),
      unit: `${insumos.length} produtos`,
      change: `${estoqueCritico} crítico(s)`,
      positive: estoqueCritico === 0,
      icon: Package,
      glowClass: "glow-primary",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
    {
      title: "Valor em Estoque",
      value: `R$ ${custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      unit: "",
      change: "",
      positive: true,
      icon: DollarSign,
      glowClass: "glow-success",
      iconBg: "bg-success/15",
      iconColor: "text-success",
    },
    {
      title: "Funcionários",
      value: String(funcionarios.length),
      unit: melhor ? `Destaque: ${melhor.nome.split(" ")[0]}` : "",
      change: melhor ? `${melhor.eficiencia.toFixed(1)}% eficiência` : "",
      positive: true,
      icon: Users,
      glowClass: "glow-accent",
      iconBg: "bg-accent/15",
      iconColor: "text-accent",
    },
    {
      title: "Equipamentos",
      value: String(equipamentos.length),
      unit: `${ativos} ativo(s)`,
      change: "",
      positive: true,
      icon: Settings,
      glowClass: "glow-primary",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.title} className={`glass-card p-5 ${kpi.glowClass}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {kpi.title}
              </p>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              {kpi.unit && (
                <p className="text-xs text-muted-foreground">{kpi.unit}</p>
              )}
            </div>
            <div className={`p-2.5 rounded-lg ${kpi.iconBg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
            </div>
          </div>
          {kpi.change && (
            <p
              className={`text-xs mt-3 font-medium ${
                kpi.positive ? "text-success" : "text-destructive"
              }`}
            >
              {kpi.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
