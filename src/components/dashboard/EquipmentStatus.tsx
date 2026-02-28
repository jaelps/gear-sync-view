import { Equipamento, equipamentos as defaultEquipamentos } from "@/data/mockData";
import { Wrench, Power, AlertCircle } from "lucide-react";

const statusConfig = {
  Ativo: { icon: Power, colorClass: "text-success", bgClass: "bg-success/15" },
  Manutenção: { icon: Wrench, colorClass: "text-accent", bgClass: "bg-accent/15" },
  Inativo: { icon: AlertCircle, colorClass: "text-destructive", bgClass: "bg-destructive/15" },
};

interface Props { data?: Equipamento[]; }

export default function EquipmentStatus({ data }: Props) {
  const equipamentos = data ?? defaultEquipamentos;
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Status dos Equipamentos
      </h3>
      <div className="space-y-2.5">
        {equipamentos.map((eq) => {
          const config = statusConfig[eq.status];
          const Icon = config.icon;
          return (
            <div
              key={eq.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${config.bgClass}`}>
                  <Icon className={`w-4 h-4 ${config.colorClass}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{eq.nome}</p>
                  <p className="text-xs text-muted-foreground">{eq.tipo} · {eq.codigo}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${config.colorClass}`}>
                  {eq.status}
                </span>
                <p className="text-xs text-muted-foreground">{eq.capacidade} un/dia</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
