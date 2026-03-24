"use client";

import { Badge } from "@/components/ui/badge";
import type { InsightSeverity } from "@/lib/mock-data";

interface InsightCardProps {
  severity: InsightSeverity;
  title: string;
  description: string;
  timestamp: string;
  compact?: boolean;
}

const severityConfig: Record<InsightSeverity, { label: string; className: string; dotColor: string }> = {
  critical: {
    label: "Critical",
    className: "bg-red-50 text-red-600 border-red-200",
    dotColor: "bg-red-500"
  },
  warning: {
    label: "Warning",
    className: "bg-amber-50 text-amber-600 border-amber-200",
    dotColor: "bg-amber-500"
  },
  info: {
    label: "Info",
    className: "bg-blue-50 text-blue-600 border-blue-200",
    dotColor: "bg-blue-500"
  },
  positive: {
    label: "Positive",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    dotColor: "bg-emerald-500"
  },
};

export function InsightCard({ severity, title, description, timestamp, compact }: InsightCardProps) {
  const config = severityConfig[severity];

  if (compact) {
    return (
      <div className="group rounded-lg border border-zinc-200 bg-white p-3 transition-all hover:border-zinc-300 hover:shadow-sm">
        <div className="flex items-start gap-2">
          <div className={`mt-1.5 size-1.5 rounded-full flex-shrink-0 ${config.dotColor}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-900 leading-snug line-clamp-1">
              {title}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500 line-clamp-1">
              {description}
            </p>
          </div>
          <span className="text-[10px] text-zinc-400 whitespace-nowrap flex-shrink-0">
            {timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover-lift">
      <div className="flex items-start justify-between gap-2">
        <Badge variant="outline" className={`text-[10px] ${config.className}`}>
          {config.label}
        </Badge>
        <span className="text-[10px] text-zinc-400 whitespace-nowrap">{timestamp}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-zinc-900 leading-snug">{title}</p>
      <p className="mt-1 text-xs text-zinc-500 leading-relaxed line-clamp-2">{description}</p>
    </div>
  );
}
