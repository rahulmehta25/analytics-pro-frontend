"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Database, Search, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Data Ingestion",
    description:
      "Marketing data from connected sources is chunked, embedded, and stored in a vector database for semantic retrieval.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Natural language queries are converted to embeddings and matched against the vector index to find the most relevant data chunks.",
  },
  {
    icon: MessageSquare,
    title: "AI Generation",
    description:
      "Retrieved context is passed to the LLM alongside the user's question to generate accurate, data-grounded responses.",
  },
];

export default function RAGDemoPage() {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timers = steps.map((_, index) =>
      setTimeout(() => setVisibleSteps(index + 1), 250 + index * 320)
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8 pt-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-600">
          <FlaskConical className="size-3.5" />
          RAG Pipeline Demo
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Retrieval-Augmented Generation
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          See how Analytics Pro uses RAG to deliver accurate, context-aware
          answers from your marketing data.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <Card
            key={step.title}
            className={`border-zinc-200 shadow-sm rounded-xl transition-all duration-300 hover:shadow-md ${
              visibleSteps > i
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                <step.icon className="size-5 text-zinc-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Step {i + 1}
                  </Badge>
                  <p className="text-sm font-semibold text-zinc-900">
                    {step.title}
                  </p>
                </div>
                <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200 shadow-sm rounded-xl bg-zinc-50">
        <CardContent className="p-5 text-center">
          <p className="text-sm text-zinc-500">
            Try it live on the{" "}
            <a href="/dashboard/query" className="font-medium text-blue-600 hover:text-blue-700">
              Query page
            </a>{" "}
            to see RAG in action with your marketing data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
