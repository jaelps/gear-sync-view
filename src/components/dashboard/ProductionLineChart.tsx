import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { producaoDiaria } from "@/data/mockData";

export default function ProductionLineChart() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Produção Diária da Semana
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={producaoDiaria}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 20%)" />
          <XAxis dataKey="dia" stroke="hsl(215 15% 55%)" fontSize={12} />
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
          <ReferenceLine
            y={750}
            stroke="hsl(38 92% 50%)"
            strokeDasharray="5 5"
            label={{ value: "Meta", fill: "hsl(38 92% 50%)", fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="producao"
            stroke="hsl(210 70% 50%)"
            strokeWidth={2.5}
            dot={{ fill: "hsl(210 70% 50%)", r: 4 }}
            activeDot={{ r: 6, fill: "hsl(210 70% 60%)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
