"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChannelChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function ChannelChart({ data }: ChannelChartProps) {
  return (
    <Card className="border-zinc-200 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">
          Channel Attribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
                formatter={(value) => [`${value}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm text-zinc-600">{entry.name}</span>
                <span className="ml-auto text-sm font-medium text-zinc-900">
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
