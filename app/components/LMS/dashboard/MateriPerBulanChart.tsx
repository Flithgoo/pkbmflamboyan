"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MateriPerBulan } from "@/lib/types/dashboard";

interface MateriPerBulanChartProps {
  data: MateriPerBulan[];
}

export function MateriPerBulanChart({ data }: MateriPerBulanChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">
          Materi Dibuat per Bulan
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#64748b"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#64748b"
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Kehadiran"]}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#e2e8f0",
                fontSize: 13,
              }}
            />
            <Bar
              dataKey="total"
              fill="#d97706"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
