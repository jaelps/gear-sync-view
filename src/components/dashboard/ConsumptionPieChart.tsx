import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { consumoInsumos } from "@/data/mockData";

const COLORS = [
  "hsl(210 70% 50%)",
  "hsl(152 60% 42%)",
  "hsl(38 92% 50%)",
  "hsl(280 60% 55%)",
  "hsl(0 72% 51%)",
];

export default function ConsumptionPieChart() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Consumo de Insumos
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={consumoInsumos}
            dataKey="valor"
            nameKey="nome"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            strokeWidth={0}
          >
            {consumoInsumos.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220 18% 13%)",
              border: "1px solid hsl(220 13% 20%)",
              borderRadius: "8px",
              color: "hsl(210 20% 92%)",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "hsl(215 15% 55%)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
