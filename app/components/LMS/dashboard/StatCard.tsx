"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  ClipboardList,
  UserCheck,
  Star,
  Users,
  GraduationCap,
  Layers,
  TrendingUp,
  Megaphone,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { StatCardData } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

// Peta key string -> komponen ikon Lucide.
// Disimpan terpisah dari data supaya data (StatCardData) tetap berupa
// plain object yang aman untuk hasil query Supabase / JSON API.
const ICON_MAP: Record<StatCardData["icon"], LucideIcon> = {
  "book-open": BookOpen,
  "clipboard-list": ClipboardList,
  "user-check": UserCheck,
  star: Star,
  users: Users,
  "graduation-cap": GraduationCap,
  layers: Layers,
  "trending-up": TrendingUp,
  megaphone: Megaphone,
  "user-cog": UserCog,
};

interface StatCardProps {
  data: StatCardData;
}

export function StatCard({ data }: StatCardProps) {
  const Icon = ICON_MAP[data.icon] ?? TrendingUp;
  const accent = data.accent ?? "emerald";

  const accentStyles =
    accent === "emerald"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-600";

  return (
    <Card className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-500">
            {data.label}
          </span>
          <span className="text-2xl font-semibold text-slate-900">
            {data.value}
          </span>
          {data.helperText && (
            <span className="text-xs text-slate-400">{data.helperText}</span>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accentStyles,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardGridProps {
  stats: StatCardData[];
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} data={stat} />
      ))}
    </div>
  );
}
