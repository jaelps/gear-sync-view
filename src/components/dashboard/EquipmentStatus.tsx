import { Equipamento, equipamentos as defaultEquipamentos } from "@/data/mockData";
import { Wrench, Power, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusConfig = {
  Ativo: { icon: Power, colorClass: "text-success", bgClass: "bg-success/15" },
  Manutenção: { icon: Wrench, colorClass: "text-accent", bgClass: "bg-accent/15" },
  Inativo: { icon: AlertCircle, colorClass: "text-destructive", bgClass: "bg-destructive/15" },
};

interface Props {
  data?: Equipamento[];
  onDelete?: (id: string) => void;
}

export default function EquipmentStatus({ data, onDelete }: Props) {
  const equipamentos = data ?? defaultEquipamentos;
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Equipamentos
      </h3>
      <div className="space-y-2.5">
        {equipamentos.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum equipamento cadastrado.</p>
        )}
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
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className={`text-xs font-medium ${config.colorClass}`}>
                    {eq.status}
                  </span>
                  <p className="text-xs text-muted-foreground">{eq.capacidade} un/dia</p>
                </div>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(eq.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
