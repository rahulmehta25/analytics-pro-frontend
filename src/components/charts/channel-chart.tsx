"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChannelChartProps {
  data: { name: string; value: number; fill: string }[];
}

// Muted professional color palette
const MUTED_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
];

export function ChannelChart({ data }: ChannelChartProps) {
  // Override fills with muted palette
  const chartData = data.map((item, index) => ({
    ...item,
    fill: MUTED_COLORS[index % MUTED_COLORS.length],
  }));

  return (
    <Card className="border-zinc-200 shadow-sm rounded-xl h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">
          Channel Attribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold text-zinc-900">100%</p>
                <p className="text-[10px] text-zinc-400">Total</p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="flex-1 text-xs text-zinc-600 truncate">
                  {entry.name}
                </span>
                <span className="text-xs font-medium text-zinc-900 tabular-nums">
                  {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
