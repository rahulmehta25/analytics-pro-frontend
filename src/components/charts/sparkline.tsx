"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = "#2563eb", height = 32 }: SparklineProps) {
  const chartData = useMemo(
    () => data.map((value, index) => ({ index, value })),
    [data]
  );

  // Create a unique gradient ID based on color to avoid conflicts
  const gradientId = `spark-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
