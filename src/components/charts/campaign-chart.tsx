"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CampaignChartProps {
  data: { name: string; conversions: number; spend: number; roi: number }[];
}

export function CampaignChart({ data }: CampaignChartProps) {
  return (
    <Card className="border-zinc-200 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-zinc-500">
            Top Campaigns by Conversions
          </CardTitle>
          <span className="text-xs text-zinc-400">Last 30 days</span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
              width={110}
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
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload;
                return (
                  <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
                    <p className="mb-2 font-medium text-zinc-900">{item.name}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500">Conversions</span>
                        <span className="font-medium tabular-nums">{item.conversions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500">Spend</span>
                        <span className="font-medium tabular-nums">${item.spend.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500">ROI</span>
                        <span className="font-medium text-emerald-600">{item.roi}x</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="conversions"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              barSize={18}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
