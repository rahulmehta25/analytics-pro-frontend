"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "@/components/charts/sparkline";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  subtitle: string;
  sparkline: number[];
}

function parseFormattedValue(value: string) {
  const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: "", decimals: 0 };
  const prefix = match[1];
  const numStr = match[2].replace(/,/g, "");
  const number = parseFloat(numStr);
  const suffix = match[3];
  const decimalPart = numStr.split(".")[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  return { prefix, number, suffix, decimals };
}

function formatAnimatedNumber(num: number, decimals: number) {
  const fixed = num.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

function useCountUp(end: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || end === 0) return;
    hasRun.current = true;

    const startTime = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(end);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return value;
}

export function KPICard({ title, value, change, trend, subtitle, sparkline }: KPICardProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";
  const isNeutral = trend === "neutral";

  const trendColor = isPositive
    ? "text-emerald-600"
    : isNegative
    ? "text-red-600"
    : "text-zinc-500";

  const sparkColor = isPositive ? "#059669" : isNegative ? "#dc2626" : "#71717a";

  const parsed = parseFormattedValue(value);
  const animatedNumber = useCountUp(parsed.number, 1000);
  const displayValue = `${parsed.prefix}${formatAnimatedNumber(animatedNumber, parsed.decimals)}${parsed.suffix}`;

  return (
    <Card className="border-zinc-200 shadow-sm rounded-xl overflow-hidden hover-lift">
      <CardContent className="p-0">
        <div className="p-4 pb-3">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-zinc-900 tabular-nums">
              {displayValue}
            </p>
            <div className={`flex items-center gap-0.5 ${trendColor}`}>
              {isPositive && <TrendingUp className="size-3.5" />}
              {isNegative && <TrendingDown className="size-3.5" />}
              {isNeutral && <Minus className="size-3.5" />}
              <span className="text-xs font-medium">{change}</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>
        </div>
        <div className="h-10 w-full px-1">
          <Sparkline data={sparkline} color={sparkColor} height={40} />
        </div>
      </CardContent>
    </Card>
  );
}
