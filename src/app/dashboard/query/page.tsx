"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { motion } from "framer-motion";
import { Search, Sparkles, Database, Send, MessageSquare, RotateCcw } from "lucide-react";
import { querySuggestions, queryResponses } from "@/lib/mock-data";

const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  tertiary: "#f59e0b",
  quaternary: "#8b5cf6",
};

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stopAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  }, []);

  const animateText = useCallback(
    (fullText: string) => {
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
    },
    [stopAnimation]
  );

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
        setResponse(result.data);
        setIsLoading(false);
        animateText(result.data.text);
      } catch {
        const fallback =
          queryResponses[q] || queryResponses["Best performing campaign?"];
        setResponse(fallback);
        setIsLoading(false);
        animateText(fallback.text);
      }
    },
    [animateText, stopAnimation]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(query);
    }
  };

  const handleReset = () => {
    stopAnimation();
    setQuery("");
    setResponse(null);
    setDisplayedText("");
    setShowChart(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <motion.div className="mx-auto max-w-3xl space-y-6 py-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
          <Sparkles className="size-3 text-zinc-500" />
          AI-Powered Analytics
        </div>
        <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
          Ask anything about your data
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Get instant insights powered by your connected data sources
        </p>
      </div>

      {/* Search input */}
      <div>
        <Card className="border-zinc-200 shadow-sm rounded-xl">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 flex-shrink-0 mt-0.5">
                <MessageSquare className="size-4 text-zinc-500" />
              </div>
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your marketing data..."
                  rows={1}
                  className="w-full resize-none rounded-lg border-0 bg-transparent py-1.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-0 min-h-[32px]"
                />
              </div>
              <button
                onClick={() => handleSubmit(query)}
                disabled={!query.trim() || isLoading}
                className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestion chips */}
      {!response && !isLoading && (
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 text-center">
            Try asking
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {querySuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="rounded-full text-xs text-zinc-600 border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-all"
                onClick={() => {
                  setQuery(suggestion);
                  handleSubmit(suggestion);
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card className="border-zinc-200 shadow-sm rounded-xl animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                <Sparkles className="size-4 text-blue-600" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2 py-1">
                  <div className="flex gap-1">
                    <span className="typing-dot size-1.5 rounded-full bg-zinc-400" />
                    <span className="typing-dot size-1.5 rounded-full bg-zinc-400" style={{ animationDelay: "0.15s" }} />
                    <span className="typing-dot size-1.5 rounded-full bg-zinc-400" style={{ animationDelay: "0.3s" }} />
                  </div>
                  <span className="text-xs text-zinc-500">Analyzing your data...</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded skeleton-shimmer" />
                  <div className="h-3 w-full rounded skeleton-shimmer" />
                  <div className="h-3 w-5/6 rounded skeleton-shimmer" />
                </div>
                <div className="h-44 w-full rounded-lg skeleton-shimmer" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response */}
      {response && !isLoading && (
        <div className="space-y-4 animate-fade-in">
          {/* Reset button */}
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <RotateCcw className="size-3" />
              New query
            </button>
          </div>

          {/* Answer */}
          <Card className="border-zinc-200 shadow-sm rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                  <Sparkles className="size-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  {displayedText.split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-sm text-zinc-700 leading-relaxed mb-3 last:mb-0"
                    >
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
                  {!showChart && (
                    <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          {showChart && response.chartData && (
            <Card className="border-zinc-200 shadow-sm rounded-xl animate-fade-in">
              <CardContent className="p-5">
                <ResponsiveContainer width="100%" height={260}>
                  {response.chartType === "bar" ? (
                    <BarChart data={response.chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#a1a1aa", fontSize: 10 }}
                        angle={-15}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e4e4e7",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontSize: "12px",
                          padding: "8px 12px",
                        }}
                      />
                      {Object.keys(response.chartData[0] || {})
                        .filter((k) => k !== "name" && k !== "status")
                        .map((key, idx) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary][idx % 4]}
                            radius={[4, 4, 0, 0]}
                            barSize={22}
                          />
                        ))}
                    </BarChart>
                  ) : response.chartType === "area" ? (
                    <AreaChart data={response.chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="queryAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.12} />
                          <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="queryPredictedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_COLORS.quaternary} stopOpacity={0.12} />
                          <stop offset="100%" stopColor={CHART_COLORS.quaternary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e4e4e7",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontSize: "12px",
                          padding: "8px 12px",
                        }}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                      />
                      <Area type="monotone" dataKey="actual" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#queryAreaGradient)" dot={false} />
                      <Area type="monotone" dataKey="predicted" stroke={CHART_COLORS.quaternary} strokeWidth={2} strokeDasharray="6 3" fill="url(#queryPredictedGradient)" dot={false} />
                    </AreaChart>
                  ) : (
                    <LineChart data={response.chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e4e4e7",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontSize: "12px",
                          padding: "8px 12px",
                        }}
                      />
                      <Line type="monotone" dataKey="openRate" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 3 }} />
                      <Line type="monotone" dataKey="clickRate" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={{ fill: CHART_COLORS.secondary, r: 3 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Sources */}
          {showChart && response.sources && (
            <Accordion className="animate-fade-in">
              <AccordionItem value="sources" className="border-zinc-200 rounded-xl overflow-hidden bg-white">
                <AccordionTrigger className="px-4 py-3 text-sm font-medium text-zinc-600 hover:no-underline hover:bg-zinc-50">
                  <div className="flex items-center gap-2">
                    <Database className="size-3.5" />
                    <span>Sources ({response.sources.length} datasets)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {response.sources.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
                        <div>
                          <p className="text-sm font-medium text-zinc-700">{source.title}</p>
                          <p className="text-xs text-zinc-400">{source.date}</p>
                        </div>
                        <span className="text-xs text-zinc-500 tabular-nums">{source.rows.toLocaleString()} rows</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      )}
    </motion.div>
  );
}
