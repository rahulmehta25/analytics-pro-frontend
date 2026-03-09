"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/kpi-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { CampaignChart } from "@/components/charts/campaign-chart";
import { ChannelChart } from "@/components/charts/channel-chart";
import { InsightCard } from "@/components/insight-card";
import { Button } from "@/components/ui/button";
import {
  kpiData,
  revenueData,
  campaignData,
  channelData,
  recentInsights,
} from "@/lib/mock-data";
import type { Insight } from "@/lib/mock-data";

const periods = ["7d", "30d", "90d"] as const;

export default function DashboardPage() {
  const [kpis, setKpis] = useState(kpiData);
  const [revenue, setRevenue] = useState(revenueData);
  const [campaigns, setCampaigns] = useState(campaignData);
  const [channels, setChannels] = useState(channelData);
  const [insights, setInsights] = useState<Insight[]>(recentInsights);
  const [loaded, setLoaded] = useState(false);
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("30d");

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
        setKpis(k);
        setRevenue(r);
        setCampaigns(ca);
        setChannels(ch);
        setInsights((i as Insight[]).slice(0, 5));
      } catch {
        // fallback to mock data already set
      }
      setLoaded(true);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header row with time period selector */}
      <div
        className={`flex items-center justify-between transition-all duration-500 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Overview</h1>
          <p className="text-sm text-zinc-500">Track your marketing performance</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
          {periods.map((period) => (
            <Button
              key={period}
              variant="ghost"
              size="sm"
              onClick={() => setActivePeriod(period)}
              className={`h-7 px-3 text-xs font-medium rounded-md transition-colors ${
                activePeriod === period
                  ? "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.title}
            className={`transition-all duration-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${i * 75}ms` }}
          >
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div
          className={`lg:col-span-2 transition-all duration-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <RevenueChart data={revenue} />
        </div>
        <div
          className={`transition-all duration-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "375ms" }}
        >
          <ChannelChart data={channels} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div
          className={`lg:col-span-2 transition-all duration-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          <CampaignChart data={campaigns} />
        </div>
        <div
          className={`transition-all duration-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "525ms" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-500">Recent Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={insight.id}
                className={`transition-all duration-500 ${
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: `${600 + i * 60}ms` }}
              >
                <InsightCard
                  severity={insight.severity}
                  title={insight.title}
                  description={insight.description}
                  timestamp={insight.timestamp}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
