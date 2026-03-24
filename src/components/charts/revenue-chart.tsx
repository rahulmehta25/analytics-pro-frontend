"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueChartProps {
  data: { month: string; revenue: number; spend: number }[];
}

function formatCurrency(value: number) {
  return `$${(value / 1000).toFixed(0)}K`;
}

const COLORS = {
  revenue: "#3b82f6",
  spend: "#10b981",
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="border-zinc-200 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-zinc-500">
            Revenue vs Spend
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full" style={{ backgroundColor: COLORS.revenue }} />
              <span className="text-xs text-zinc-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full" style={{ backgroundColor: COLORS.spend }} />
              <span className="text-xs text-zinc-500">Spend</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.revenue} stopOpacity={0.12} />
                <stop offset="100%" stopColor={COLORS.revenue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.spend} stopOpacity={0.08} />
                <stop offset="100%" stopColor={COLORS.spend} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={formatCurrency}
              dx={-4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              formatter={(value, name) => [
                `$${Number(value).toLocaleString()}`,
                String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
              labelStyle={{ fontWeight: 500, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.revenue}
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.revenue, strokeWidth: 0 }}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke={COLORS.spend}
              strokeWidth={2}
              fill="url(#spendGradient)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.spend, strokeWidth: 0 }}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
