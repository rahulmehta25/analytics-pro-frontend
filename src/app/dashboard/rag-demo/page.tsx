"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Search,
  MessageSquare,
  Zap,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

/* ── Marketing data chunks (realistic) ────────────────────────────── */

const marketingChunks = [
  {
    id: "chunk-1",
    source: "Google Ads Campaign Report",
    content:
      'Summer Sale 2025 campaign generated 4,520 conversions at $2.65 CPA. ROAS was 3.8x with $12,000 total spend across Search and Display networks. Top performing ad group: "Summer Deals - Exact Match" with 18.2% conversion rate.',
    embedding: [0.82, 0.14, 0.67, 0.91, 0.33],
    relevance: 0.94,
  },
  {
    id: "chunk-2",
    source: "Meta Ads Performance",
    content:
      "Instagram Reels campaign reached 1.2M impressions with 3.4% engagement rate. Lookalike audience (1% US) outperformed interest-based targeting by 42%. Creative A/B test: UGC video beat studio content with 2.1x higher CTR.",
    embedding: [0.45, 0.78, 0.23, 0.56, 0.89],
    relevance: 0.71,
  },
  {
    id: "chunk-3",
    source: "Email Marketing Analytics",
    content:
      "Q3 drip sequence: 28.4% open rate, 4.7% CTR. Segment: high-intent abandoned cart. Revenue attributed: $34,200 from 890 conversions. Best subject line: personalized with first name + discount amount.",
    embedding: [0.61, 0.39, 0.85, 0.22, 0.73],
    relevance: 0.67,
  },
  {
    id: "chunk-4",
    source: "Attribution Model Output",
    content:
      "Multi-touch attribution (data-driven): Google Search gets 38% credit, Meta gets 27%, Email gets 22%, Direct gets 13%. First-touch vs last-touch shows 15% variance on branded terms. Time decay model suggests increasing mid-funnel spend.",
    embedding: [0.33, 0.92, 0.51, 0.78, 0.16],
    relevance: 0.88,
  },
  {
    id: "chunk-5",
    source: "Weekly Performance Summary",
    content:
      "Week of Mar 3: Total spend $8,420 across all channels. 312 conversions, blended CPA $27.00. Google CPA dropped 12% after negative keyword cleanup. Meta CPM up 8% due to auction pressure. Email revenue steady at $4,800/week.",
    embedding: [0.71, 0.55, 0.44, 0.63, 0.87],
    relevance: 0.82,
  },
];

const sampleQueries = [
  "Which campaign had the best ROAS last quarter?",
  "How does email compare to paid ads for conversions?",
  "What's our current blended CPA across channels?",
];

const scriptedResponses: Record<string, { answer: string; chunks: number[] }> = {
  "Which campaign had the best ROAS last quarter?": {
    answer:
      "Based on the campaign performance data, the **Summer Sale 2025** campaign had the best ROAS at **3.8x** with $12,000 in total spend generating 4,520 conversions at $2.65 CPA. The top performing ad group was \"Summer Deals - Exact Match\" with an 18.2% conversion rate. The multi-touch attribution model shows Google Search receiving 38% of conversion credit, suggesting the Search component of this campaign was particularly effective.",
    chunks: [0, 3],
  },
  "How does email compare to paid ads for conversions?": {
    answer:
      "Email marketing is performing strongly relative to paid channels. The Q3 drip sequence achieved **890 conversions** with a 28.4% open rate and 4.7% CTR, generating $34,200 in attributed revenue. By comparison, Google Ads generated 4,520 conversions but at higher spend ($12,000 for one campaign alone). The attribution model gives Email **22% of total conversion credit** vs Google's 38% and Meta's 27%, but email's cost efficiency is significantly better given the lower infrastructure cost.",
    chunks: [2, 3, 0],
  },
  "What's our current blended CPA across channels?": {
    answer:
      "The current blended CPA across all channels is **$27.00** based on the most recent weekly data (312 conversions on $8,420 spend). Breaking it down: Google CPA recently dropped 12% after a negative keyword cleanup, while Meta CPM increased 8% due to auction pressure. The best individual CPA is from the Summer Sale campaign at $2.65, and email continues to deliver steady revenue at roughly $4,800/week with minimal incremental cost.",
    chunks: [4, 0, 3],
  },
};

/* ── Pipeline stage types ─────────────────────────────────────────── */

type Stage = "idle" | "ingest" | "chunk" | "embed" | "retrieve" | "generate" | "done";

const stageLabels: Record<Stage, string> = {
  idle: "Ready",
  ingest: "Ingesting Sources",
  chunk: "Chunking Documents",
  embed: "Generating Embeddings",
  retrieve: "Retrieving Context",
  generate: "Generating Response",
  done: "Complete",
};

/* ── Animated dots for vector embedding ───────────────────────────── */

const embeddingOpacities = [0.72, 0.91, 0.56, 0.83, 0.64, 0.97, 0.48, 0.77, 0.88, 0.53, 0.95, 0.69];

function EmbeddingViz({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1 h-6">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-300 ${
            active ? "bg-blue-500" : "bg-zinc-200"
          }`}
          style={{
            height: active ? `${12 + Math.sin(i * 0.8) * 10}px` : "4px",
            transitionDelay: active ? `${i * 50}ms` : "0ms",
            opacity: active ? embeddingOpacities[i] : 0.3,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main RAG Demo Page ───────────────────────────────────────────── */

export default function RAGDemoPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [activeQuery, setActiveQuery] = useState("");
  const [typedQuery, setTypedQuery] = useState("");
  const [ingestedCount, setIngestedCount] = useState(0);
  const [chunkedCount, setChunkedCount] = useState(0);
  const [retrievedChunks, setRetrievedChunks] = useState<number[]>([]);
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(null);
  const [, setIsAutoPlaying] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  function reset() {
    setStage("idle");
    setActiveQuery("");
    setTypedQuery("");
    setIngestedCount(0);
    setChunkedCount(0);
    setRetrievedChunks([]);
    setStreamedAnswer("");
    setSelectedChunkIndex(null);
  }

  async function runDemo(query: string) {
    reset();
    setIsAutoPlaying(true);
    setActiveQuery(query);

    // Type the query character by character
    for (let i = 0; i <= query.length; i++) {
      setTypedQuery(query.slice(0, i));
      await sleep(25);
    }
    await sleep(400);

    // Stage 1: Ingest
    setStage("ingest");
    for (let i = 1; i <= 5; i++) {
      setIngestedCount(i);
      await sleep(300);
    }
    await sleep(200);

    // Stage 2: Chunk
    setStage("chunk");
    for (let i = 1; i <= marketingChunks.length; i++) {
      setChunkedCount(i);
      await sleep(250);
    }
    await sleep(200);

    // Stage 3: Embed
    setStage("embed");
    await sleep(1200);

    // Stage 4: Retrieve
    setStage("retrieve");
    const response = scriptedResponses[query] || scriptedResponses[sampleQueries[0]];
    for (const idx of response.chunks) {
      setRetrievedChunks((prev) => [...prev, idx]);
      await sleep(500);
    }
    await sleep(300);

    // Stage 5: Generate
    setStage("generate");
    const answer = response.answer;
    for (let i = 0; i <= answer.length; i++) {
      setStreamedAnswer(answer.slice(0, i));
      await sleep(12);
    }
    await sleep(300);

    setStage("done");
    setIsAutoPlaying(false);
  }

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight;
    }
  }, [streamedAnswer]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
              Interactive Demo
            </span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">
            RAG Pipeline Explorer
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Watch how Analytics Pro retrieves and reasons over your marketing data in real time.
          </p>
        </div>
        {stage !== "idle" && (
          <button
            onClick={reset}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Pipeline Progress Bar */}
      <div className="flex items-center gap-1">
        {(["ingest", "chunk", "embed", "retrieve", "generate"] as Stage[]).map(
          (s, i) => {
            const order = ["ingest", "chunk", "embed", "retrieve", "generate"];
            const currentIdx = order.indexOf(stage);
            const thisIdx = order.indexOf(s);
            const isActive = stage !== "idle" && thisIdx <= currentIdx;
            const isCurrent = stage === s;

            return (
              <div key={s} className="flex items-center flex-1 gap-1">
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                      isActive
                        ? isCurrent
                          ? "bg-blue-500 animate-pulse"
                          : "bg-blue-500"
                        : "bg-zinc-100"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      isCurrent
                        ? "text-blue-600"
                        : isActive
                        ? "text-zinc-700"
                        : "text-zinc-400"
                    }`}
                  >
                    {stageLabels[s]}
                  </span>
                </div>
                {i < 4 && (
                  <ArrowRight
                    className={`size-3 shrink-0 mt-[-14px] ${
                      isActive ? "text-blue-400" : "text-zinc-200"
                    }`}
                  />
                )}
              </div>
            );
          }
        )}
      </div>

      {/* Query Selection */}
      {stage === "idle" && (
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-zinc-700 mb-3">
              Select a marketing question to see the full RAG pipeline:
            </p>
            <div className="space-y-2">
              {sampleQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => runDemo(q)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-zinc-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <Search className="size-4 text-zinc-400 group-hover:text-blue-500 shrink-0" />
                  <span className="text-sm text-zinc-700 group-hover:text-zinc-900">
                    {q}
                  </span>
                  <ArrowRight className="size-3.5 ml-auto text-zinc-300 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Demo Area */}
      {stage !== "idle" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left: Data Sources + Chunks */}
          <div className="lg:col-span-2 space-y-4">
            {/* Query */}
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="size-3.5 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Query
                  </span>
                </div>
                <div className="bg-zinc-50 rounded-lg px-3 py-2 text-sm text-zinc-800 font-medium min-h-[40px] flex items-center">
                  {typedQuery}
                  {typedQuery.length < activeQuery.length && (
                    <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="size-3.5 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Data Sources
                    </span>
                  </div>
                  {ingestedCount > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      {ingestedCount}/5 loaded
                    </Badge>
                  )}
                </div>
                <div className="space-y-1.5">
                  {[
                    { icon: BarChart3, label: "Google Ads Export", size: "2.4 MB" },
                    { icon: TrendingUp, label: "Meta Ads Report", size: "1.8 MB" },
                    { icon: FileSpreadsheet, label: "Email Analytics CSV", size: "890 KB" },
                    { icon: Zap, label: "Attribution Model", size: "1.2 MB" },
                    { icon: BarChart3, label: "Weekly Summary", size: "340 KB" },
                  ].map((src, i) => (
                    <div
                      key={src.label}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-300 ${
                        i < ingestedCount
                          ? "bg-green-50 text-green-800"
                          : stage === "ingest" && i === ingestedCount
                          ? "bg-blue-50 text-blue-700 animate-pulse"
                          : "text-zinc-400"
                      }`}
                    >
                      <src.icon className="size-3.5 shrink-0" />
                      <span className="flex-1 text-xs font-medium">{src.label}</span>
                      <span className="text-[10px] opacity-60">{src.size}</span>
                      {i < ingestedCount && (
                        <CheckCircle2 className="size-3.5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chunks */}
            <Card className="border-zinc-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="size-3.5 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Chunks
                    </span>
                  </div>
                  <EmbeddingViz
                    active={stage === "embed" || stage === "retrieve" || stage === "generate" || stage === "done"}
                  />
                </div>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                  {marketingChunks.map((chunk, i) => {
                    const isRetrieved = retrievedChunks.includes(i);
                    const isChunked = i < chunkedCount;

                    return (
                      <button
                        key={chunk.id}
                        onClick={() =>
                          setSelectedChunkIndex(selectedChunkIndex === i ? null : i)
                        }
                        className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all duration-300 border ${
                          isRetrieved
                            ? "border-blue-300 bg-blue-50 shadow-sm"
                            : isChunked
                            ? "border-zinc-200 bg-white hover:bg-zinc-50"
                            : "border-transparent bg-zinc-50 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium truncate flex-1">
                            {chunk.source}
                          </span>
                          {isRetrieved && (
                            <Badge className="text-[9px] bg-blue-100 text-blue-700 border-0 ml-2">
                              {(chunk.relevance * 100).toFixed(0)}% match
                            </Badge>
                          )}
                        </div>
                        {selectedChunkIndex === i && (
                          <p className="text-zinc-600 leading-relaxed mt-1">
                            {chunk.content}
                          </p>
                        )}
                        {selectedChunkIndex !== i && isChunked && (
                          <p className="text-zinc-400 truncate">{chunk.content}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Generated Response */}
          <div className="lg:col-span-3">
            <Card className="border-zinc-200 shadow-sm h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-3.5 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      AI Response
                    </span>
                  </div>
                  {stage === "generate" && (
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Loader2 className="size-3 animate-spin" />
                      <span className="text-[10px] font-medium">Generating...</span>
                    </div>
                  )}
                  {stage === "done" && (
                    <div className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle2 className="size-3" />
                      <span className="text-[10px] font-medium">Complete</span>
                    </div>
                  )}
                </div>

                {/* Status messages for early stages */}
                {(stage === "ingest" || stage === "chunk" || stage === "embed") && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Loader2 className="size-8 text-blue-500 animate-spin mx-auto" />
                      <div>
                        <p className="text-sm font-medium text-zinc-700">
                          {stageLabels[stage]}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {stage === "ingest" &&
                            `Loading ${ingestedCount}/5 marketing data sources...`}
                          {stage === "chunk" &&
                            `Splitting into ${chunkedCount} semantic chunks...`}
                          {stage === "embed" &&
                            "Converting chunks to vector embeddings..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Retrieval view */}
                {stage === "retrieve" && (
                  <div className="flex-1 space-y-3">
                    <p className="text-xs text-zinc-500">
                      Finding the most relevant chunks for your query...
                    </p>
                    {retrievedChunks.map((idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 animate-fade-in"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-blue-800">
                            {marketingChunks[idx].source}
                          </span>
                          <span className="text-[10px] font-mono text-blue-600">
                            cosine: {marketingChunks[idx].relevance.toFixed(3)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {marketingChunks[idx].content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Streamed answer */}
                {(stage === "generate" || stage === "done") && (
                  <div className="flex-1 flex flex-col">
                    {/* Retrieved sources (collapsed) */}
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-100">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                        Sources used:
                      </span>
                      <div className="flex gap-1">
                        {retrievedChunks.map((idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-[10px] text-zinc-600"
                          >
                            {marketingChunks[idx].source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div
                      ref={answerRef}
                      className="flex-1 overflow-y-auto text-sm text-zinc-700 leading-relaxed"
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: streamedAnswer
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="text-zinc-900">$1</strong>'
                            )
                            .replace(
                              /"(.*?)"/g,
                              '<span class="text-blue-700">"$1"</span>'
                            ),
                        }}
                      />
                      {stage === "generate" && (
                        <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
                      )}
                    </div>

                    {stage === "done" && (
                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">
                          Grounded in {retrievedChunks.length} data chunks with
                          Vertex AI
                        </span>
                        <button
                          onClick={() => {
                            reset();
                          }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Try another query →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
