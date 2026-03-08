"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "@/components/charts/sparkline";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  subtitle: string;
  sparkline: number[];
}

export function KPICard({ title, value, change, trend, subtitle, sparkline }: KPICardProps) {
  const isPositive = trend === "up";

  return (
    <Card className="border-zinc-200 shadow-sm rounded-xl transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-zinc-900">{value}</p>
            <div className="mt-1 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="size-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="size-3.5 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-zinc-400">{subtitle}</span>
            </div>
          </div>
          <div className="w-20">
            <Sparkline
              data={sparkline}
              color={isPositive ? "#10b981" : "#ef4444"}
              height={28}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
