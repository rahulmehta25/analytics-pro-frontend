"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InsightSeverity } from "@/lib/mock-data";

interface InsightCardProps {
  severity: InsightSeverity;
  title: string;
  description: string;
  timestamp: string;
}

const severityConfig: Record<InsightSeverity, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-red-50 text-red-600 border-red-200" },
  warning: { label: "Warning", className: "bg-amber-50 text-amber-600 border-amber-200" },
  info: { label: "Info", className: "bg-blue-50 text-blue-600 border-blue-200" },
  positive: { label: "Positive", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
};

export function InsightCard({ severity, title, description, timestamp }: InsightCardProps) {
  const config = severityConfig[severity];

  return (
    <Card className="border-zinc-200 shadow-sm rounded-xl transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
          <span className="text-xs text-zinc-400 whitespace-nowrap">{timestamp}</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-zinc-900 leading-snug">{title}</p>
        <p className="mt-1 text-xs text-zinc-500 leading-relaxed line-clamp-2">{description}</p>
      </CardContent>
    </Card>
  );
}
