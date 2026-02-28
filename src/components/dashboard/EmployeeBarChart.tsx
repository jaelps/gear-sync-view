import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { funcionarios } from "@/data/mockData";

export default function EmployeeBarChart() {
  const data = funcionarios.map((f) => ({
    nome: f.nome.split(" ")[0],
    producao: f.producaoHoje,
    meta: f.metaDiaria,
  }));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Produção por Funcionário
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 20%)" />
          <XAxis dataKey="nome" stroke="hsl(215 15% 55%)" fontSize={12} />
          <YAxis stroke="hsl(215 15% 55%)" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220 18% 13%)",
              border: "1px solid hsl(220 13% 20%)",
              borderRadius: "8px",
              color: "hsl(210 20% 92%)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="producao" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.producao >= entry.meta
                    ? "hsl(152 60% 42%)"
                    : "hsl(210 70% 50%)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
