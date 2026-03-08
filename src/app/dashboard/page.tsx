"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/kpi-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { CampaignChart } from "@/components/charts/campaign-chart";
import { ChannelChart } from "@/components/charts/channel-chart";
import { InsightCard } from "@/components/insight-card";
import {
  kpiData,
  revenueData,
  campaignData,
  channelData,
  recentInsights,
} from "@/lib/mock-data";
import type { Insight } from "@/lib/mock-data";

export default function DashboardPage() {
  const [kpis, setKpis] = useState(kpiData);
  const [revenue, setRevenue] = useState(revenueData);
  const [campaigns, setCampaigns] = useState(campaignData);
  const [channels, setChannels] = useState(channelData);
  const [insights, setInsights] = useState<Insight[]>(recentInsights);
  const [loaded, setLoaded] = useState(false);

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
    <div className={`space-y-6 ${loaded ? "animate-fade-in" : ""}`}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <div>
          <ChannelChart data={channels} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CampaignChart data={campaigns} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-500">Recent Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                severity={insight.severity}
                title={insight.title}
                description={insight.description}
                timestamp={insight.timestamp}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
