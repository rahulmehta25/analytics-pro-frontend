const API_BASE = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) {
    return `${fromEnv.replace(/\/$/, "")}/api`;
  }
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "/api";
})();

async function fetchAPI<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function getKPIs() {
  const { kpiData } = await import("./mock-data");
  return fetchAPI("/kpis", kpiData);
}

export async function getRevenue() {
  const { revenueData } = await import("./mock-data");
  return fetchAPI("/revenue", revenueData);
}

export async function getCampaigns() {
  const { campaignData } = await import("./mock-data");
  return fetchAPI("/campaigns", campaignData);
}

export async function getChannels() {
  const { channelData } = await import("./mock-data");
  return fetchAPI("/channels", channelData);
}

export async function getInsights() {
  const { insightsData } = await import("./mock-data");
  return fetchAPI("/insights", insightsData);
}

export async function getConnectors() {
  const { connectorData } = await import("./mock-data");
  return fetchAPI("/connectors", connectorData);
}

export async function queryAI(question: string) {
  const { queryResponses } = await import("./mock-data");
  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return queryResponses[question] || queryResponses["Best performing campaign?"];
  }
}
