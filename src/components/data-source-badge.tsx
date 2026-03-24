"use client";

import { Circle } from "lucide-react";

export function DataSourceBadge({ source }: { source: "live" | "demo" }) {
  if (source === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-200">
        <Circle className="size-1.5 fill-emerald-500 text-emerald-500 animate-pulse" />
        Live
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600 border border-amber-200">
      <Circle className="size-1.5 fill-amber-500 text-amber-500" />
      Demo
    </span>
  );
}
