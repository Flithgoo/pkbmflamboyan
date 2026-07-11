import { Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnnouncementItem } from "@/lib/types/dashboard";

interface AnnouncementListProps {
  items: AnnouncementItem[];
  title?: string;
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AnnouncementList({
  items,
  title = "Pengumuman Terbaru",
}: AnnouncementListProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-slate-800">
                  {item.title}
                </span>
                {item.priority === "penting" && (
                  <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                    Penting
                  </Badge>
                )}
              </div>
              <p className="line-clamp-2 text-xs text-slate-400">
                {stripHtml(item.content)}
              </p>
              <span className="text-xs text-slate-300">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
