"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Database,
  Globe,
  Layers,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */
function useCountUp(end: number, duration = 2000, start = 0) {
  const [value, setValue] = useState(start);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let raf: number;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (end - start) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Stat item component                                                */
/* ------------------------------------------------------------------ */
function StatItem({
  stat,
  index,
}: {
  stat: { label: string; value: number; suffix: string; format: string };
  index: number;
}) {
  const counter = useCountUp(
    stat.format === "abbr" ? 2.4 : stat.value,
    2000,
    0,
  );

  let display: string;
  if (stat.format === "abbr") {
    display = `${counter === 2 ? "2.4" : counter > 2 ? "2.4" : counter}M`;
  } else if (stat.format === "decimal") {
    display = counter <= 1 ? `${(counter * 1.2).toFixed(1)}` : "1.2";
  } else {
    display = String(counter);
  }

  return (
    <div
      className={`text-center animate-fade-in-up stagger-${index + 1}`}
    >
      <p className="text-3xl font-bold text-zinc-900 sm:text-4xl">
        {display}
        {stat.suffix}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats data                                                         */
/* ------------------------------------------------------------------ */
const stats = [
  { label: "Data Points Processed", value: 2400000, suffix: "+", format: "abbr" },
  { label: "Avg. Query Response", value: 1.2, suffix: "s", format: "decimal" },
  { label: "Active Connectors", value: 12, suffix: "+", format: "number" },
  { label: "ROI Improvement", value: 34, suffix: "%", format: "number" },
];

/* ------------------------------------------------------------------ */
/*  Features data                                                      */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Brain,
    title: "RAG-Powered Insights",
    description:
      "Ask questions in plain English. Our retrieval-augmented generation engine queries your data and returns actionable answers with citations.",
  },
  {
    icon: Database,
    title: "Universal Connectors",
    description:
      "Connect Google Analytics, BigQuery, Salesforce, CSV uploads, and more. All your marketing data in one unified view.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description:
      "Forecast revenue, identify at-risk campaigns, and get AI recommendations to optimize spend allocation.",
  },
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description:
      "Live KPI dashboards with sparkline trends, anomaly detection, and automated alerts when metrics deviate.",
  },
  {
    icon: Layers,
    title: "Multi-Channel Attribution",
    description:
      "Understand how each channel contributes to conversions with AI-driven attribution modeling across touchpoints.",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Queries",
    description:
      "Skip the SQL. Ask questions like 'Which campaigns should I pause?' and get detailed, data-backed responses.",
  },
];

/* ------------------------------------------------------------------ */
/*  Platforms                                                          */
/* ------------------------------------------------------------------ */
const platforms = [
  { name: "Google Ads", icon: Globe },
  { name: "Meta Ads", icon: Globe },
  { name: "Salesforce", icon: Database },
  { name: "HubSpot", icon: BarChart3 },
  { name: "BigQuery", icon: Database },
  { name: "Google Analytics", icon: Search },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---- Nav ---- */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-blue-600" />
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              Analytics Pro
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-sm text-zinc-600">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="text-sm">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 sm:pb-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <Badge
              variant="secondary"
              className="mb-6 bg-blue-50 text-blue-600 px-3 py-1 text-xs font-medium"
            >
              <Sparkles className="mr-1.5 size-3" />
              Enterprise Marketing Analytics + RAG
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl gradient-text">
              Your marketing data,
              <br />
              answered instantly
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-500 leading-relaxed">
              Connect your data sources, ask questions in plain English, and get
              AI-powered insights with full source attribution. No SQL required.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/dashboard">
                  <Button size="lg" className="h-11 px-6 text-sm font-medium">
                    Try Demo
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="https://github.com/rahulmehta25/analytics-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 px-6 text-sm font-medium border-zinc-200 text-zinc-700"
                  >
                    View on GitHub
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Animated stats ---- */}
      <section className="border-y border-zinc-100 bg-zinc-50/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              Everything you need to understand your marketing
            </h2>
            <p className="mt-4 text-zinc-500">
              From data ingestion to AI-powered recommendations, Analytics Pro
              covers the full analytics lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`animate-fade-in-up hover-lift stagger-${i + 1}`}
                whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card className="border-zinc-200 shadow-sm rounded-xl h-full">
                  <CardContent className="p-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
                      <feature.icon className="size-5 text-blue-600" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Dashboard preview ---- */}
      <section className="bg-zinc-50/50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
              A dashboard that works for you
            </h2>
            <p className="mt-4 text-zinc-500">
              Real-time KPIs, interactive charts, and AI-generated insights, all in
              one clean interface.
            </p>
          </div>

          <div className="animate-fade-in-scale stagger-3">
            <Card className="border-zinc-200 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Mock dashboard preview */}
                <div className="bg-white p-6 sm:p-8">
                  {/* Mock topbar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
                        <BarChart3 className="size-4 text-white" />
                      </div>
                      <span className="font-semibold text-zinc-900">Analytics Pro</span>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-xs">
                        Demo
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 rounded-lg bg-zinc-100" />
                      <div className="size-8 rounded-full bg-blue-100" />
                    </div>
                  </div>

                  {/* Mock KPI row */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
                    {[
                      { label: "Total Spend", value: "$125K", change: "+12%" },
                      { label: "Impressions", value: "2.4M", change: "+8%" },
                      { label: "Clicks", value: "120K", change: "+15%" },
                      { label: "ROI", value: "3.2x", change: "+0.4" },
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        className="rounded-xl border border-zinc-200 bg-white p-4"
                      >
                        <p className="text-xs text-zinc-500">{kpi.label}</p>
                        <p className="mt-1 text-xl font-bold text-zinc-900">{kpi.value}</p>
                        <p className="text-xs text-emerald-500 font-medium">{kpi.change}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mock chart area */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2 rounded-xl border border-zinc-200 bg-white p-4">
                      <p className="text-xs text-zinc-500 mb-3">Revenue vs Spend</p>
                      <div className="flex items-end gap-1 h-32">
                        {[40, 55, 45, 60, 50, 65, 70, 75, 80, 85, 90, 95].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col gap-0.5 justify-end">
                            <div
                              className="bg-blue-500 rounded-sm w-full"
                              style={{ height: `${h}%` }}
                            />
                            <div
                              className="bg-emerald-400 rounded-sm w-full"
                              style={{ height: `${h * 0.55}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-4">
                      <p className="text-xs text-zinc-500 mb-3">Channel Attribution</p>
                      <div className="flex items-center justify-center h-32">
                        <div className="relative size-24">
                          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="12" strokeDasharray="88 163" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#7c3aed" strokeWidth="12" strokeDasharray="63 188" strokeDashoffset="-88" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#0891b2" strokeWidth="12" strokeDasharray="50 201" strokeDashoffset="-151" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#059669" strokeWidth="12" strokeDasharray="30 221" strokeDashoffset="-201" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ---- Query preview ---- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-blue-50 text-blue-600 text-xs font-medium"
              >
                AI-Powered
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                Ask questions, get answers
              </h2>
              <p className="mt-4 text-zinc-500 leading-relaxed">
                Our RAG engine connects to your data sources, retrieves relevant
                information, and generates comprehensive answers with interactive
                charts and full source citations.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Natural language queries across all data sources",
                  "Auto-generated charts and visualizations",
                  "Source attribution with row-level citations",
                  "Predictive forecasting and recommendations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-zinc-600">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Link href="/dashboard/query">
                    <Button size="lg" className="h-11 px-6 text-sm font-medium">
                      Try AI Query
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>

            <Card className="border-zinc-200 shadow-md rounded-2xl hover-lift">
              <CardContent className="p-6">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Search className="size-4" />
                    <span className="italic">Best performing campaign?</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 flex-shrink-0 mt-0.5">
                      <Sparkles className="size-3 text-blue-600" />
                    </div>
                    <div className="text-sm text-zinc-700 leading-relaxed">
                      <p>
                        Based on analysis of all active campaigns,{" "}
                        <strong className="text-zinc-900">Summer Sale 2025</strong> is
                        your best performing campaign with{" "}
                        <strong className="text-zinc-900">4,520 conversions</strong> and
                        a <strong className="text-zinc-900">3.8x ROI</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="ml-9 flex gap-1.5">
                    {["Summer Sale", "Product Launch", "Brand", "Holiday", "Retarget"].map(
                      (name, i) => (
                        <div key={name} className="flex-1">
                          <div
                            className="bg-blue-500 rounded-sm"
                            style={{
                              height: `${[56, 48, 40, 35, 30][i]}px`,
                              opacity: i === 0 ? 1 : 0.6,
                            }}
                          />
                          <p className="text-[9px] text-zinc-400 mt-1 truncate">{name}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ---- Compatible platforms ---- */}
      <section className="border-t border-zinc-100 bg-zinc-50/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-medium text-zinc-400 mb-8">
            Works with your existing marketing stack
          </p>
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
            {platforms.map((platform, i) => (
              <div
                key={platform.name}
                className={`flex flex-col items-center gap-2 animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="flex size-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm hover-lift">
                  <platform.icon className="size-5 text-zinc-400" />
                </div>
                <span className="text-xs text-zinc-500 font-medium">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Card className="border-zinc-200 shadow-sm rounded-2xl">
            <CardContent className="p-10 sm:p-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
                Ready to try it?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-zinc-500">
                Explore the demo dashboard with sample marketing data. No signup
                required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/dashboard">
                    <Button size="lg" className="h-11 px-8 text-sm font-medium">
                      Open Dashboard
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <a
                    href="https://github.com/rahulmehta25/analytics-pro"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-11 px-8 text-sm font-medium border-zinc-200 text-zinc-700"
                    >
                      GitHub
                    </Button>
                  </a>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-500">Analytics Pro</span>
            </div>
            <p className="text-xs text-zinc-400">
              Built with Next.js, shadcn/ui, and Recharts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
