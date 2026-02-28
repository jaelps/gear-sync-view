import { funcionarios } from "@/data/mockData";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

export default function EmployeeRanking() {
  const sorted = [...funcionarios].sort((a, b) => b.eficiencia - a.eficiencia);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Ranking de Produtividade
      </h3>
      <div className="space-y-3">
        {sorted.map((f, i) => {
          const aboveMeta = f.eficiencia >= 100;
          return (
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                  i === 0
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}º
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{f.nome}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>{f.producaoHoje}/{f.metaDiaria} un</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {f.tempoMedio} min
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {aboveMeta ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    aboveMeta ? "text-success" : "text-destructive"
                  }`}
                >
                  {f.eficiencia.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
