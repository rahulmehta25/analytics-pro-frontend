"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkline } from "@/components/charts/sparkline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ArrowUpDown, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { insightsData } from "@/lib/mock-data";
import type { Insight, InsightSeverity } from "@/lib/mock-data";

const severityConfig: Record<
  InsightSeverity,
  { label: string; className: string; sparkColor: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-50 text-red-600 border-red-200",
    sparkColor: "#ef4444",
  },
  warning: {
    label: "Warning",
    className: "bg-amber-50 text-amber-600 border-amber-200",
    sparkColor: "#f59e0b",
  },
  info: {
    label: "Info",
    className: "bg-blue-50 text-blue-600 border-blue-200",
    sparkColor: "#2563eb",
  },
  positive: {
    label: "Positive",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    sparkColor: "#10b981",
  },
};

const filterOptions: { value: InsightSeverity | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
  { value: "positive", label: "Positive" },
];

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>(insightsData);
  const [filter, setFilter] = useState<InsightSeverity | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "severity">("newest");

  useEffect(() => {
    async function fetchData() {
      try {
        const { getInsights } = await import("@/lib/api");
        const data = await getInsights();
        setInsights(data as Insight[]);
      } catch {
        // fallback to mock
      }
    }
    fetchData();
  }, []);

  const filteredInsights = useMemo(() => {
    let result = insights;

    if (filter !== "all") {
      result = result.filter((i) => i.severity === filter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(searchLower) ||
          i.description.toLowerCase().includes(searchLower)
      );
    }

    if (sort === "severity") {
      const order: Record<InsightSeverity, number> = {
        critical: 0,
        warning: 1,
        info: 2,
        positive: 3,
      };
      result = [...result].sort(
        (a, b) => order[a.severity] - order[b.severity]
      );
    }

    return result;
  }, [insights, filter, search, sort]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">AI Insights</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Automated insights and recommendations from your marketing data
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-zinc-200 bg-white p-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === option.value
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-50"
              }`}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search insights..."
            className="h-8 pl-9 text-xs border-zinc-200"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" className="gap-1.5 text-xs" />}
          >
            <ArrowUpDown className="size-3" />
            {sort === "newest" ? "Newest" : "Severity"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSort("newest")}>
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("severity")}>
              By severity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredInsights.map((insight) => {
          const config = severityConfig[insight.severity];

          return (
            <Card
              key={insight.id}
              className="border-zinc-200 shadow-sm rounded-xl transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={config.className}>
                        {config.label}
                      </Badge>
                      <span className="text-xs text-zinc-400">
                        {insight.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 leading-snug">
                      {insight.title}
                    </p>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                  {insight.sparkline && (
                    <div className="w-20 pt-6">
                      <Sparkline
                        data={insight.sparkline}
                        color={config.sparkColor}
                        height={32}
                      />
                    </div>
                  )}
                </div>

                {/* Metric */}
                {insight.metric && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-zinc-500">{insight.metric}:</span>
                    <div className="flex items-center gap-1">
                      {insight.metricTrend === "up" ? (
                        <TrendingUp className="size-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="size-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          insight.metricTrend === "up"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {insight.metricChange}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action */}
                {insight.action && (
                  <div className="mt-3 rounded-lg bg-zinc-50 p-3">
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      <span className="font-medium">Recommended:</span>{" "}
                      {insight.action}
                    </p>
                  </div>
                )}

                <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View Details
                  <ArrowRight className="size-3" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInsights.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-zinc-400">
            No insights match your filters.
          </p>
        </div>
      )}
    </div>
  );
}
