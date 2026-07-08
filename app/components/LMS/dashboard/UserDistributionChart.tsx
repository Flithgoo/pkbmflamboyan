"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserDistributionSlice } from "@/lib/types/dashboard";

interface UserDistributionChartProps {
  data: UserDistributionSlice[];
}

// emerald-600, amber-500, slate-400 — konsisten dengan palet utama aplikasi
const COLORS = ["#059669", "#f59e0b", "#94a3b8"];

export function UserDistributionChart({ data }: UserDistributionChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">
          Distribusi User
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="role"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, "Kehadiran"]}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#e2e8f0",
                fontSize: 13,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              iconType="circle"
              wrapperStyle={{ fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
