export const kpiData = [
  {
    title: "Total Spend",
    value: "$125K",
    change: "+12%",
    trend: "up" as const,
    subtitle: "MoM",
    sparkline: [65, 59, 80, 81, 56, 55, 72, 85, 90, 95, 110, 125],
  },
  {
    title: "Impressions",
    value: "2.4M",
    change: "+8%",
    trend: "up" as const,
    subtitle: "MoM",
    sparkline: [1800, 1900, 2000, 1950, 2100, 2050, 2200, 2150, 2300, 2250, 2350, 2400],
  },
  {
    title: "Clicks",
    value: "120K",
    change: "+15%",
    trend: "up" as const,
    subtitle: "MoM",
    sparkline: [70, 75, 80, 78, 85, 90, 88, 95, 100, 105, 112, 120],
  },
  {
    title: "ROI",
    value: "3.2x",
    change: "+0.4",
    trend: "up" as const,
    subtitle: "MoM",
    sparkline: [2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.8, 3.0, 3.1, 3.2],
  },
];

export const revenueData = [
  { month: "Jan", revenue: 42000, spend: 28000 },
  { month: "Feb", revenue: 48000, spend: 30000 },
  { month: "Mar", revenue: 55000, spend: 32000 },
  { month: "Apr", revenue: 51000, spend: 31000 },
  { month: "May", revenue: 58000, spend: 33000 },
  { month: "Jun", revenue: 62000, spend: 35000 },
  { month: "Jul", revenue: 68000, spend: 36000 },
  { month: "Aug", revenue: 72000, spend: 38000 },
  { month: "Sep", revenue: 78000, spend: 40000 },
  { month: "Oct", revenue: 85000, spend: 42000 },
  { month: "Nov", revenue: 92000, spend: 44000 },
  { month: "Dec", revenue: 98000, spend: 46000 },
];

export const campaignData = [
  { name: "Summer Sale 2025", conversions: 4520, spend: 12000, roi: 3.8 },
  { name: "Product Launch Q3", conversions: 3890, spend: 15000, roi: 2.6 },
  { name: "Brand Awareness", conversions: 3200, spend: 8000, roi: 4.0 },
  { name: "Holiday Promo", conversions: 2850, spend: 10000, roi: 2.9 },
  { name: "Retargeting Flow", conversions: 2400, spend: 5000, roi: 4.8 },
];

export const channelData = [
  { name: "Google Ads", value: 35, fill: "#2563eb" },
  { name: "Meta", value: 25, fill: "#7c3aed" },
  { name: "LinkedIn", value: 20, fill: "#0891b2" },
  { name: "Email", value: 12, fill: "#059669" },
  { name: "Organic", value: 8, fill: "#d97706" },
];

export type InsightSeverity = "critical" | "warning" | "info" | "positive";

export interface Insight {
  id: string;
  severity: InsightSeverity;
  title: string;
  description: string;
  timestamp: string;
  metric?: string;
  metricChange?: string;
  metricTrend?: "up" | "down";
  action?: string;
  sparkline?: number[];
}

export const insightsData: Insight[] = [
  {
    id: "1",
    severity: "critical",
    title: "Campaign #7 exceeding budget by 23%",
    description: "The Holiday Promo campaign has exceeded its allocated budget of $10,000 by $2,300. Immediate action is recommended to avoid overspend.",
    timestamp: "2 hours ago",
    metric: "Budget",
    metricChange: "+23%",
    metricTrend: "up",
    action: "Pause campaign or increase budget allocation to $15,000 based on ROI performance.",
    sparkline: [100, 102, 108, 112, 115, 118, 120, 123],
  },
  {
    id: "2",
    severity: "warning",
    title: "Email open rates dropped 15% this week",
    description: "Weekly email campaigns are seeing a significant decline in open rates, dropping from 24% to 20.4%. This may indicate audience fatigue or deliverability issues.",
    timestamp: "5 hours ago",
    metric: "Open Rate",
    metricChange: "-15%",
    metricTrend: "down",
    action: "A/B test subject lines and review email frequency. Consider segmenting the audience for more targeted messaging.",
    sparkline: [28, 26, 25, 24, 23, 22, 21, 20],
  },
  {
    id: "3",
    severity: "positive",
    title: "LinkedIn ads showing 4.2x ROI improvement",
    description: "LinkedIn advertising campaigns have achieved a 4.2x return on investment, significantly outperforming the platform benchmark of 2.1x.",
    timestamp: "1 day ago",
    metric: "ROI",
    metricChange: "+4.2x",
    metricTrend: "up",
    action: "Consider reallocating 15-20% of Google Ads budget to LinkedIn for higher-value B2B leads.",
    sparkline: [1.8, 2.0, 2.3, 2.8, 3.1, 3.5, 3.9, 4.2],
  },
  {
    id: "4",
    severity: "positive",
    title: "Organic traffic up 31% after blog launch",
    description: "The new content marketing initiative has driven a 31% increase in organic traffic over the past 30 days, with significant growth in long-tail keyword rankings.",
    timestamp: "1 day ago",
    metric: "Organic Traffic",
    metricChange: "+31%",
    metricTrend: "up",
    action: "Double down on content production. Prioritize topics around 'marketing attribution' and 'campaign optimization' which show highest engagement.",
    sparkline: [1200, 1250, 1350, 1400, 1500, 1550, 1600, 1572],
  },
  {
    id: "5",
    severity: "warning",
    title: "Google Ads CPC increased 18% month-over-month",
    description: "Cost-per-click on Google Ads has risen from $2.40 to $2.83, driven by increased competition in the 'analytics software' keyword category.",
    timestamp: "2 days ago",
    metric: "CPC",
    metricChange: "+18%",
    metricTrend: "up",
    action: "Review keyword strategy. Consider shifting to long-tail keywords and improving Quality Score to reduce CPC.",
    sparkline: [2.1, 2.15, 2.2, 2.3, 2.4, 2.5, 2.65, 2.83],
  },
  {
    id: "6",
    severity: "info",
    title: "New audience segment identified: SMB decision-makers",
    description: "AI analysis has identified a high-converting audience segment of SMB decision-makers aged 35-50 with a 2.8x higher conversion rate than the average.",
    timestamp: "2 days ago",
    metric: "Conversion Rate",
    metricChange: "+2.8x",
    metricTrend: "up",
    action: "Create dedicated campaigns targeting this segment with tailored messaging around ROI and ease of use.",
    sparkline: [1.0, 1.2, 1.5, 1.8, 2.0, 2.3, 2.5, 2.8],
  },
  {
    id: "7",
    severity: "critical",
    title: "Meta Ads conversion tracking broken since Tuesday",
    description: "The Meta pixel is not firing correctly on the checkout confirmation page, resulting in 0 reported conversions since March 4th despite 340 actual sales.",
    timestamp: "3 days ago",
    metric: "Tracked Conversions",
    metricChange: "-100%",
    metricTrend: "down",
    action: "Reinstall Meta pixel on checkout confirmation page. Verify with Meta Pixel Helper Chrome extension.",
    sparkline: [45, 52, 48, 51, 0, 0, 0, 0],
  },
  {
    id: "8",
    severity: "info",
    title: "Q1 performance trending 22% above forecast",
    description: "Overall marketing performance for Q1 is tracking significantly above the forecasted targets across all key metrics, particularly in paid search and content marketing.",
    timestamp: "3 days ago",
    metric: "Revenue vs Forecast",
    metricChange: "+22%",
    metricTrend: "up",
    action: "Prepare updated forecast for Q2 board review. Consider requesting increased budget allocation based on strong performance.",
    sparkline: [88, 92, 95, 100, 105, 110, 115, 122],
  },
];

export const recentInsights = insightsData.slice(0, 5);

export const connectorData = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Web analytics and traffic data from GA4 properties",
    status: "connected" as const,
    lastSync: "5 minutes ago",
    rowsSynced: 1_240_000,
    health: 98,
    icon: "BarChart3" as const,
  },
  {
    id: "bigquery",
    name: "BigQuery",
    description: "Cloud data warehouse for campaign and revenue data",
    status: "connected" as const,
    lastSync: "12 minutes ago",
    rowsSynced: 8_500_000,
    health: 100,
    icon: "Database" as const,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "CRM data including leads, opportunities, and revenue",
    status: "disconnected" as const,
    lastSync: "3 days ago",
    rowsSynced: 450_000,
    health: 0,
    icon: "Users" as const,
  },
  {
    id: "csv-upload",
    name: "CSV Upload",
    description: "Manual data upload via CSV files for custom datasets",
    status: "connected" as const,
    lastSync: "1 hour ago",
    rowsSynced: 24_500,
    health: 100,
    icon: "FileSpreadsheet" as const,
  },
];

export const querySuggestions = [
  "Best performing campaign?",
  "ROI by channel",
  "Campaigns to pause?",
  "Q1 vs Q2 performance",
  "Predict next month",
  "Email open rates",
];

export const queryResponses: Record<string, { text: string; chartType: string; chartData: Record<string, unknown>[]; sources: { title: string; rows: number; date: string }[] }> = {
  "Best performing campaign?": {
    text: `Based on comprehensive analysis of all active campaigns, **Summer Sale 2025** is your best performing campaign with 4,520 conversions and a 3.8x ROI.\n\nThis campaign has consistently outperformed others in terms of cost efficiency, generating $45,600 in attributed revenue from a $12,000 spend. The conversion rate of 6.2% is nearly double the portfolio average of 3.4%, driven largely by strong performance in the 25-34 age demographic.\n\nNotably, the campaign's performance has been accelerating over the past 3 weeks, with a 22% increase in daily conversions. The creative refresh implemented on February 15th appears to be the primary driver of this improvement, particularly the video ad variants which show a 40% higher click-through rate.\n\nHowever, the **Retargeting Flow** campaign deserves mention with the highest ROI at 4.8x, though at a smaller scale with 2,400 conversions. If budget allows, scaling this campaign could yield strong incremental returns.`,
    chartType: "bar",
    chartData: [
      { name: "Summer Sale 2025", conversions: 4520, roi: 3.8 },
      { name: "Product Launch Q3", conversions: 3890, roi: 2.6 },
      { name: "Brand Awareness", conversions: 3200, roi: 4.0 },
      { name: "Holiday Promo", conversions: 2850, roi: 2.9 },
      { name: "Retargeting Flow", conversions: 2400, roi: 4.8 },
    ],
    sources: [
      { title: "Campaign Performance Report", rows: 1240, date: "Mar 2026" },
      { title: "Conversion Attribution Data", rows: 8500, date: "Mar 2026" },
      { title: "Revenue by Campaign", rows: 450, date: "Feb 2026" },
    ],
  },
  "ROI by channel": {
    text: `Here's a breakdown of ROI performance across all marketing channels for the current quarter:\n\n**LinkedIn** leads with the highest ROI at **4.2x**, driven by precise B2B targeting and high-value lead generation. Despite representing only 20% of total spend, LinkedIn contributes 28% of qualified pipeline value. The average deal size from LinkedIn leads is $12,400, compared to $8,200 across other channels.\n\n**Google Ads** delivers a solid **3.1x ROI** and remains the highest-volume channel at 35% of total spend. However, rising CPCs (up 18% MoM) are putting pressure on margins. The branded search campaigns maintain a 5.2x ROI, while non-branded campaigns are at 2.3x, suggesting room for keyword optimization.\n\n**Organic** shows the strongest momentum with a **5.8x ROI**, though from a smaller base. The recent blog launch has driven a 31% increase in organic traffic, and content-driven conversions have a 45% lower CAC than paid channels.\n\n**Meta Ads** at **2.4x ROI** underperforms relative to spend (25% of budget). The broken conversion tracking since Tuesday may be masking true performance. Email marketing rounds out at **3.6x ROI** with strong retention metrics.`,
    chartType: "bar",
    chartData: [
      { name: "Organic", roi: 5.8, spend: 8000 },
      { name: "LinkedIn", roi: 4.2, spend: 25000 },
      { name: "Email", roi: 3.6, spend: 15000 },
      { name: "Google Ads", roi: 3.1, spend: 44000 },
      { name: "Meta", roi: 2.4, spend: 31000 },
    ],
    sources: [
      { title: "Channel Attribution Report", rows: 3200, date: "Mar 2026" },
      { title: "Revenue by Source", rows: 1800, date: "Mar 2026" },
    ],
  },
  "Campaigns to pause?": {
    text: `After analyzing all active campaigns against performance thresholds and budget constraints, I recommend pausing or restructuring **3 campaigns**:\n\n**1. Holiday Promo (Priority: High)** - This campaign has exceeded its budget by 23% ($2,300 overspend) while delivering a below-average ROI of 2.9x. The campaign was designed for seasonal traffic that has now passed, and continuing it is burning budget that could be better allocated to higher-performing campaigns like the Retargeting Flow.\n\n**2. Meta Brand Awareness - Segment C (Priority: Medium)** - The lookalike audience in Segment C has a CPA of $48, which is 3.2x higher than the portfolio average of $15. This segment has shown no improvement over the past 14 days despite creative rotation. I recommend pausing this segment specifically while maintaining Segments A and B which perform within acceptable ranges.\n\n**3. Google Ads - Generic Keywords (Priority: Low)** - Non-branded generic keywords like "analytics tool" and "marketing software" have an ROI of only 1.4x due to aggressive competition driving CPCs up to $8.50. Consider pausing these and redirecting budget to long-tail keywords where CPCs average $2.10 with a 3.8x ROI.\n\nReallocating the combined $18,000 monthly spend from these campaigns to top performers could increase overall portfolio ROI from 3.2x to an estimated 3.8x.`,
    chartType: "bar",
    chartData: [
      { name: "Holiday Promo", roi: 2.9, cpa: 35, status: "Pause" },
      { name: "Meta Segment C", roi: 1.2, cpa: 48, status: "Pause" },
      { name: "Generic Keywords", roi: 1.4, cpa: 42, status: "Pause" },
      { name: "Retargeting Flow", roi: 4.8, cpa: 12, status: "Scale" },
      { name: "Summer Sale", roi: 3.8, cpa: 15, status: "Maintain" },
    ],
    sources: [
      { title: "Campaign Budget Analysis", rows: 890, date: "Mar 2026" },
      { title: "CPA by Campaign Segment", rows: 2100, date: "Mar 2026" },
      { title: "ROI Threshold Report", rows: 340, date: "Mar 2026" },
    ],
  },
  "Q1 vs Q2 performance": {
    text: `Comparing Q1 2026 (current) against Q2 2025 performance reveals strong growth across all key metrics:\n\n**Revenue** is up **34%**, growing from $145,000 in Q2 2025 to an annualized run-rate of $194,300 for Q1 2026. This growth is primarily driven by improved conversion rates and higher average order values, rather than increased spend alone.\n\n**Conversion Rate** improved from **3.1% to 4.8%** (+55%), the most significant operational improvement. This can be attributed to the landing page optimization project completed in January and the implementation of dynamic personalization across all paid channels.\n\n**Customer Acquisition Cost (CAC)** decreased by **18%** from $24.50 to $20.10, reflecting improved targeting efficiency and the growing contribution of organic traffic (now 18% of conversions vs 11% in Q2 2025).\n\n**Key concern**: While overall metrics are strong, **Meta Ads efficiency has declined 22%** quarter-over-quarter, and the channel's share of conversions dropped from 28% to 19%. This warrants investigation, particularly given the recent pixel tracking issues.`,
    chartType: "bar",
    chartData: [
      { name: "Revenue", q2_2025: 145000, q1_2026: 194300 },
      { name: "Conversions", q2_2025: 8200, q1_2026: 12400 },
      { name: "Avg Order Value", q2_2025: 85, q1_2026: 98 },
      { name: "CAC", q2_2025: 24.5, q1_2026: 20.1 },
    ],
    sources: [
      { title: "Quarterly Performance Summary", rows: 4500, date: "Mar 2026" },
      { title: "Year-over-Year Comparison", rows: 2800, date: "Mar 2026" },
    ],
  },
  "Predict next month": {
    text: `Based on historical trends, seasonality patterns, and current campaign trajectories, here are the predictions for **April 2026**:\n\n**Revenue Forecast: $108,000 - $115,000** (best estimate: $112,000). This represents a 14% increase over March, driven by the typical spring uptick in digital engagement and the planned launch of two new campaigns targeting the SMB segment identified by our AI analysis.\n\n**Spend Forecast: $48,000 - $52,000** (best estimate: $50,000). I recommend a modest 8% budget increase to capitalize on the favorable market conditions. Google Ads CPCs typically decrease 5-10% in April as holiday competition subsides, improving efficiency.\n\n**Key Risks**: Meta Ads performance remains unpredictable until conversion tracking is restored. If the pixel issue isn't resolved by March 15th, Meta's contribution to April revenue could be 20-30% below forecast. Additionally, a major competitor recently increased their Google Ads spend by 40%, which could impact our auction dynamics.\n\n**Key Opportunities**: The new SMB decision-maker segment shows 2.8x higher conversion rates. Launching a dedicated campaign for this segment could add an incremental $15,000-20,000 in April revenue with minimal additional spend.`,
    chartType: "area",
    chartData: [
      { month: "Nov", actual: 92000 },
      { month: "Dec", actual: 98000 },
      { month: "Jan", actual: 88000 },
      { month: "Feb", actual: 95000 },
      { month: "Mar", actual: 105000 },
      { month: "Apr", predicted: 112000 },
      { month: "May", predicted: 118000 },
      { month: "Jun", predicted: 125000 },
    ],
    sources: [
      { title: "Predictive Model Output", rows: 12000, date: "Mar 2026" },
      { title: "Seasonality Analysis", rows: 3600, date: "Mar 2026" },
      { title: "Market Competition Index", rows: 890, date: "Mar 2026" },
    ],
  },
  "Email open rates": {
    text: `Email marketing performance analysis for the past 30 days reveals a concerning downward trend in open rates:\n\n**Current Open Rate: 20.4%** (down from 24.0% four weeks ago, a **15% decline**). The industry benchmark for B2B SaaS is 21.5%, placing us slightly below average for the first time in 6 months.\n\n**Click-Through Rate: 3.2%** (stable, down only 0.3% from 3.5%). This suggests that while fewer people are opening emails, those who do are still engaging with the content. The disconnect between open and click rates typically indicates a subject line or preview text issue rather than a content quality problem.\n\n**Breakdown by campaign type**: Newsletter emails maintain a healthy 26% open rate, while promotional emails have dropped to 16.8% (from 22% last month). The promotional frequency increased from 2x to 3x per week in February, which likely triggered fatigue. Automated drip sequences remain strong at 34% open rate.\n\n**Recommendations**: Reduce promotional email frequency back to 2x/week, implement send-time optimization (our data shows Tuesday 10am and Thursday 2pm perform 28% better), and A/B test subject line personalization with recipient's company name.`,
    chartType: "line",
    chartData: [
      { week: "Week 1", openRate: 24.0, clickRate: 3.5 },
      { week: "Week 2", openRate: 23.1, clickRate: 3.4 },
      { week: "Week 3", openRate: 22.0, clickRate: 3.3 },
      { week: "Week 4", openRate: 20.4, clickRate: 3.2 },
    ],
    sources: [
      { title: "Email Campaign Analytics", rows: 45000, date: "Mar 2026" },
      { title: "Subscriber Engagement Data", rows: 12000, date: "Mar 2026" },
    ],
  },
};
