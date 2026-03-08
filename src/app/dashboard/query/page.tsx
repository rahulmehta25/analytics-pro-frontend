"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Search, Sparkles, Table2 } from "lucide-react";
import { querySuggestions, queryResponses } from "@/lib/mock-data";

export default function QueryPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    text: string;
    chartType: string;
    chartData: Record<string, unknown>[];
    sources: { title: string; rows: number; date: string }[];
  } | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [showChart, setShowChart] = useState(false);
  const textRef = useRef<string>("");
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  }, []);

  const animateText = useCallback((fullText: string) => {
    stopAnimation();
    textRef.current = fullText;
    const words = fullText.split(" ");
    let currentIndex = 0;

    animationIntervalRef.current = setInterval(() => {
      currentIndex += 2;
      if (currentIndex >= words.length) {
        setDisplayedText(fullText);
        setShowChart(true);
        stopAnimation();
      } else {
        setDisplayedText(words.slice(0, currentIndex).join(" "));
      }
    }, 30);
  }, [stopAnimation]);

  useEffect(() => () => stopAnimation(), [stopAnimation]);

  const handleSubmit = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      stopAnimation();
      setIsLoading(true);
      setResponse(null);
      setDisplayedText("");
      setShowChart(false);

      try {
        const { queryAI } = await import("@/lib/api");
        const result = await queryAI(q);
        setResponse(result);
        setIsLoading(false);
        animateText(result.text);
      } catch {
        const fallback = queryResponses[q] || queryResponses["Best performing campaign?"];
        setResponse(fallback);
        setIsLoading(false);
        animateText(fallback.text);
      }
    },
    [animateText, stopAnimation]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(query);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
          <Sparkles className="size-3.5" />
          AI-Powered Analytics
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Ask anything about your marketing data
        </h1>
        <p className="text-sm text-zinc-500">
          Get instant insights powered by your connected data sources
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your marketing data..."
          className="h-12 pl-11 pr-4 rounded-xl border-zinc-200 text-sm shadow-sm focus-visible:ring-blue-500"
        />
      </div>

      {/* Suggestion chips */}
      {!response && !isLoading && (
        <div className="flex flex-wrap justify-center gap-2">
          {querySuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="rounded-full text-xs text-zinc-600 border-zinc-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              onClick={() => {
                setQuery(suggestion);
                handleSubmit(suggestion);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card className="border-zinc-200 shadow-sm rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-5/6 rounded skeleton-shimmer" />
            </div>
            <div className="h-48 w-full rounded-lg skeleton-shimmer" />
          </CardContent>
        </Card>
      )}

      {/* Response */}
      {response && !isLoading && (
        <div className="space-y-4 animate-fade-in">
          <Card className="border-zinc-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="prose prose-sm prose-zinc max-w-none">
                {displayedText.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-sm text-zinc-700 leading-relaxed mb-3">
                    {paragraph.split(/(\*\*.*?\*\*)/).map((part, j) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={j} className="font-semibold text-zinc-900">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          {showChart && response.chartData && (
            <Card className="border-zinc-200 shadow-sm rounded-xl animate-fade-in">
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  {response.chartType === "bar" ? (
                    <BarChart data={response.chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e4e4e7",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                          fontSize: "13px",
                        }}
                      />
                      {Object.keys(response.chartData[0] || {})
                        .filter((k) => k !== "name" && k !== "status")
                        .map((key, idx) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"][idx % 4]}
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                          />
                        ))}
                    </BarChart>
                  ) : response.chartType === "area" ? (
                    <AreaChart data={response.chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <defs>
                        <linearGradient id="queryAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="queryPredictedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#71717a", fontSize: 12 }}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e4e4e7",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                          fontSize: "13px",
                        }}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                      />
                      <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} fill="url(#queryAreaGradient)" dot={false} />
                      <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" fill="url(#queryPredictedGradient)" dot={false} />
                    </AreaChart>
                  ) : (
                    <LineChart data={response.chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e4e4e7",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                          fontSize: "13px",
                        }}
                      />
                      <Line type="monotone" dataKey="openRate" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 3 }} />
                      <Line type="monotone" dataKey="clickRate" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Sources */}
          {showChart && response.sources && (
            <Accordion className="animate-fade-in">
              <AccordionItem value="sources" className="border-zinc-200 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-medium text-zinc-600 hover:no-underline hover:bg-zinc-50">
                  <div className="flex items-center gap-2">
                    <Table2 className="size-4" />
                    Sources ({response.sources.length} datasets)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {response.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-700">
                            {source.title}
                          </p>
                          <p className="text-xs text-zinc-400">{source.date}</p>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {source.rows.toLocaleString()} rows
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
    </div>
  );
}
