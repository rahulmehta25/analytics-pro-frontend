"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/kpi-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { CampaignChart } from "@/components/charts/campaign-chart";
import { ChannelChart } from "@/components/charts/channel-chart";
import { InsightCard } from "@/components/insight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  kpiData,
  revenueData,
  campaignData,
  channelData,
  recentInsights,
} from "@/lib/mock-data";
import type { Insight } from "@/lib/mock-data";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const periods = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
] as const;

export default function DashboardPage() {
  const [kpis, setKpis] = useState(kpiData);
  const [revenue, setRevenue] = useState(revenueData);
  const [campaigns, setCampaigns] = useState(campaignData);
  const [channels, setChannels] = useState(channelData);
  const [insights, setInsights] = useState<Insight[]>(recentInsights);
  const [activePeriod, setActivePeriod] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    async function fetchData() {
      try {
        const { getKPIs, getRevenue, getCampaigns, getChannels, getInsights } =
          await import("@/lib/api");
        const [k, r, ca, ch, i] = await Promise.all([
          getKPIs(),
          getRevenue(),
          getCampaigns(),
          getChannels(),
          getInsights(),
        ]);
        setKpis(k.data);
        setRevenue(r.data);
        setCampaigns(ca.data);
        setChannels(ch.data);
        setInsights(i.data.slice(0, 5));
      } catch {
        // fallback to mock data already set
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold gradient-text">
            Overview
          </h1>
          <p className="text-sm text-zinc-500">
            Track your marketing performance across all channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="size-3.5" />
            <span>Period:</span>
          </div>
          <div className="flex rounded-lg border border-zinc-200 bg-white p-0.5">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setActivePeriod(period.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activePeriod === period.value
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.title} className={`animate-fade-in-up hover-lift stagger-${i + 1}`}>
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in-scale stagger-3">
          <RevenueChart data={revenue} />
        </div>
        <div className="animate-fade-in-scale stagger-4">
          <ChannelChart data={channels} />
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in-scale stagger-5">
          <CampaignChart data={campaigns} />
        </div>
        <div className="animate-fade-in-scale stagger-6">
          <Card className="border-zinc-200 shadow-sm rounded-xl h-full hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-500">
                  Recent Insights
                </CardTitle>
                <Link
                  href="/dashboard/insights"
                  className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  View all
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {insights.slice(0, 4).map((insight) => (
                  <InsightCard
                    key={insight.id}
                    severity={insight.severity}
                    title={insight.title}
                    description={insight.description}
                    timestamp={insight.timestamp}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
