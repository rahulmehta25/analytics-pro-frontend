const API_BASE = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) {
    return `${fromEnv.replace(/\/$/, "")}/api`;
  }
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "/api";
})();

export type DataResult<T> = { data: T; source: "live" | "demo" };

let _cachedToken: string | null = null;
let _tokenExpiry = 0;

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (typeof window === "undefined") return headers;

  // Use cached token if still fresh (within 50s of expiry, refresh)
  const now = Date.now();
  if (_cachedToken && _tokenExpiry > now + 50_000) {
    headers["Authorization"] = `Bearer ${_cachedToken}`;
    return headers;
  }

  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      _cachedToken = session.access_token;
      _tokenExpiry = (session.expires_at ?? 0) * 1000;
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  } catch {
    // Fall back to localStorage for legacy compat
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
    headers,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function getKPIs(period = "30d") {
  try {
    const data = await fetchAPI<typeof import("./mock-data").kpiData>(`/kpis?period=${period}`);
    return { data, source: "live" as const };
  } catch {
    const { kpiData } = await import("./mock-data");
    return { data: kpiData, source: "demo" as const };
  }
}

export async function getRevenue(period = "30d") {
  try {
    const data = await fetchAPI<typeof import("./mock-data").revenueData>(`/revenue?period=${period}`);
    return { data, source: "live" as const };
  } catch {
    const { revenueData } = await import("./mock-data");
    return { data: revenueData, source: "demo" as const };
  }
}

export async function getCampaigns(period = "30d") {
  try {
    const data = await fetchAPI<typeof import("./mock-data").campaignData>(`/campaigns?period=${period}`);
    return { data, source: "live" as const };
  } catch {
    const { campaignData } = await import("./mock-data");
    return { data: campaignData, source: "demo" as const };
  }
}

export async function getChannels(period = "30d") {
  try {
    const data = await fetchAPI<typeof import("./mock-data").channelData>(`/channels?period=${period}`);
    return { data, source: "live" as const };
  } catch {
    const { channelData } = await import("./mock-data");
    return { data: channelData, source: "demo" as const };
  }
}

export async function getInsights(period = "30d") {
  try {
    const data = await fetchAPI<typeof import("./mock-data").insightsData>(`/insights?period=${period}`);
    return { data, source: "live" as const };
  } catch {
    const { insightsData } = await import("./mock-data");
    return { data: insightsData, source: "demo" as const };
  }
}

export async function getConnectors() {
  try {
    const resp = await fetchAPI<{
      connectors: typeof import("./mock-data").connectorData;
      available_types: string[];
    }>("/connectors");
    return { data: resp.connectors, source: "live" as const };
  } catch {
    const { connectorData } = await import("./mock-data");
    return { data: connectorData, source: "demo" as const };
  }
}

type AIQueryResult = {
  text: string;
  chartType: string;
  chartData: Record<string, unknown>[];
  sources: { title: string; rows: number; date: string }[];
  dataSourceMode?: string;
};

export async function queryAI(question: string): Promise<DataResult<AIQueryResult>> {
  try {
    const res = await fetch(`${API_BASE}/ai-query`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ query: question }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Map backend response shape to frontend shape
    return {
      data: {
        text: data.response || data.text || `Analysis for: ${question}`,
        chartType: data.chart_type || data.chartType || "bar",
        chartData: data.charts || data.chartData || [],
        sources: data.sources || [
          {
            title: "Marketing Data",
            rows: data.marketing_summary?.total_sessions || 0,
            date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          },
        ],
        dataSourceMode: data.data_source_mode,
      },
      source: "live",
    };
  } catch {
    const { queryResponses } = await import("./mock-data");
    return {
      data: queryResponses[question] || queryResponses["Best performing campaign?"],
      source: "demo",
    };
  }
}

export async function queryAIStream(
  question: string,
  sessionId: string | null,
  onChunk: (text: string) => void,
  onComplete: (data: {
    text: string;
    chartType: string;
    chartData: Record<string, unknown>[];
    sources: { title: string; rows: number; date: string }[];
    sessionId: string;
    dataSourceMode?: string;
  }) => void,
  onError: (error: Error) => void,
) {
  try {
    const res = await fetch(`${API_BASE}/ai-query-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ query: question, session_id: sessionId }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (!payload || payload === "[DONE]") continue;

        try {
          const event = JSON.parse(payload);
          if (event.type === "text_chunk") {
            fullText += event.content;
            onChunk(fullText);
          } else if (event.type === "complete") {
            onComplete({
              text: fullText || event.data?.response || "",
              chartType: event.data?.chart_type || "bar",
              chartData: event.data?.charts || [],
              sources: event.data?.sources || [],
              sessionId: event.data?.session_id || "",
              dataSourceMode: event.data?.data_source_mode,
            });
          }
        } catch {
          // skip malformed SSE events
        }
      }
    }
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
