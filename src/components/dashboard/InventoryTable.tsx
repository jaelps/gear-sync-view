import { Insumo, insumos as defaultInsumos } from "@/data/mockData";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface Props { data?: Insumo[]; }

export default function InventoryTable({ data }: Props) {
  const insumos = data ?? defaultInsumos;
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Estoque de Insumos
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Insumo</th>
              <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Código</th>
              <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoria</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Qtd</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Mínimo</th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Custo</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((item) => {
              const critical = item.qtdAtual < item.estoqueMinimo;
              return (
                <tr
                  key={item.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-foreground">{item.nome}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{item.codigo}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                      {item.categoria}
                    </span>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-medium ${critical ? "text-destructive" : "text-foreground"}`}>
                    {item.qtdAtual} {item.unidade}
                  </td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">
                    {item.estoqueMinimo} {item.unidade}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {critical ? (
                      <span className="inline-flex items-center gap-1 text-xs text-destructive">
                        <AlertTriangle className="w-3.5 h-3.5" /> Crítico
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <CheckCircle className="w-3.5 h-3.5" /> OK
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">
                    R$ {item.custoUnitario.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
