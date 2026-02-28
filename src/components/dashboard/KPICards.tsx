import { Package, DollarSign, AlertTriangle, Trophy } from "lucide-react";

const kpis = [
  {
    title: "Produção Hoje",
    value: "713",
    unit: "unidades",
    change: "+5.2%",
    positive: true,
    icon: Package,
    glowClass: "glow-primary",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    title: "Custo do Dia",
    value: "R$ 4.280",
    unit: "",
    change: "-2.1%",
    positive: true,
    icon: DollarSign,
    glowClass: "glow-success",
    iconBg: "bg-success/15",
    iconColor: "text-success",
  },
  {
    title: "Estoque Crítico",
    value: "4",
    unit: "itens",
    change: "+2",
    positive: false,
    icon: AlertTriangle,
    glowClass: "glow-accent",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    title: "Destaque",
    value: "Ana Souza",
    unit: "112% eficiência",
    change: "",
    positive: true,
    icon: Trophy,
    glowClass: "glow-primary",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
];

export default function KPICards() {
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
              {kpi.change} vs ontem
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
