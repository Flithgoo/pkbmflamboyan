"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ColorType = "emerald" | "green" | "amber" | "red";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: ColorType;
}

const colorClasses: Record<ColorType, string> = {
  emerald: "text-emerald-600",
  green: "text-green-600",
  amber: "text-amber-600",
  red: "text-red-600",
};

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={colorClasses[color]}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}
