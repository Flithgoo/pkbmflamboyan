import { BookOpen, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MateriItem } from "@/lib/types/dashboard";

interface RecentMateriListProps {
  items: MateriItem[];
  title?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RecentMateriList({
  items,
  title = "Materi Terbaru",
}: RecentMateriListProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-slate-100">
        {items.map((item) => {
          const Icon = item.type === "Tugas" ? ClipboardList : BookOpen;
          return (
            <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-slate-800">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400">
                  {item.subject} &middot; {formatDate(item.createdAt)}
                </span>
              </div>
              <Badge
                variant="secondary"
                className={
                  item.type === "Tugas"
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-50"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                }
              >
                {item.type}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
