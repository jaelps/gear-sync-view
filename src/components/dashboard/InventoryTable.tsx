import { Insumo, insumos as defaultInsumos } from "@/data/mockData";
import { AlertTriangle, CheckCircle, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  data?: Insumo[];
  onDelete?: (id: string) => void;
  onUpdateQtd?: (id: string, delta: number) => void;
}

export default function InventoryTable({ data, onDelete, onUpdateQtd }: Props) {
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
              <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantidade</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Mínimo</th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              {onDelete && <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {insumos.length === 0 && (
              <tr><td colSpan={7} className="text-center py-6 text-muted-foreground">Nenhum insumo cadastrado.</td></tr>
            )}
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
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {onUpdateQtd && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQtd(item.id, -1)}
                          disabled={item.qtdAtual <= 0}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      )}
                      <span className={`font-medium ${critical ? "text-destructive" : "text-foreground"}`}>
                        {item.qtdAtual} {item.unidade}
                      </span>
                      {onUpdateQtd && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQtd(item.id, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
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
                  {onDelete && (
                    <td className="py-2.5 px-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
