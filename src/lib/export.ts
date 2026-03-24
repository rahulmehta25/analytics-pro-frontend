// Data Export Utilities

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle strings with commas or quotes
      if (typeof value === "string") {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value ?? "");
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");
  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

export function exportToJSON<T>(data: T, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, "application/json");
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Chart data formatter for export
export function formatChartDataForExport(
  data: Record<string, unknown>[],
  chartName: string
): Record<string, unknown>[] {
  return data.map((item, index) => ({
    index: index + 1,
    chart: chartName,
    ...item,
  }));
}

// KPI data formatter for export
export function formatKPIDataForExport(
  kpis: Array<{ title: string; value: string; change: string; trend: string }>
): Record<string, unknown>[] {
  return kpis.map((kpi) => ({
    metric: kpi.title,
    value: kpi.value,
    change: kpi.change,
    trend: kpi.trend,
  }));
}

// Campaign data formatter for export
export function formatCampaignDataForExport(
  campaigns: Array<{
    name: string;
    status: string;
    channel: string;
    budget: number;
    spent: number;
    conversions: number;
    revenue: number;
    roas: number;
    cpa: number;
  }>
): Record<string, unknown>[] {
  return campaigns.map((c) => ({
    campaign_name: c.name,
    status: c.status,
    channel: c.channel,
    budget: c.budget,
    spent: c.spent,
    conversions: c.conversions,
    revenue: c.revenue,
    roas: c.roas.toFixed(2),
    cpa: c.cpa.toFixed(2),
  }));
}

// Generate report filename with date
export function generateExportFilename(base: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `${base}_${date}`;
}
