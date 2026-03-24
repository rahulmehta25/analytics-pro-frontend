export type CampaignStatus = "active" | "paused" | "ended" | "draft";
export type CampaignChannel = "Google Ads" | "Meta" | "LinkedIn" | "Email" | "TikTok" | "Twitter";

export interface CampaignPerformance {
  date: string;
  spend: number;
  conversions: number;
  revenue: number;
  impressions: number;
  clicks: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  channel: CampaignChannel;
  budget: number;
  spent: number;
  impressions?: number;
  clicks?: number;
  conversions: number;
  revenue: number;
  ctr?: number;
  cpc?: number;
  roas: number;
  startDate: string;
  cpa: number;
  endDate?: string;
  performance: CampaignPerformance[];
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  budgetAlerts: boolean;
  performanceDigest: boolean;
  weeklyReport: boolean;
  criticalOnly: boolean;
}

export type ReportFormat = "pdf" | "csv" | "xlsx";

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  frequency?: string;
  lastGenerated?: string;
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  generatedAt: string;
  dateRange: { start: string; end: string };
  format: ReportFormat;
  size: string;
  downloadUrl: string;
}

export interface Notification {
  id: string;
  type: "alert" | "success" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface UserSettings {
  email: string;
  name: string;
  company: string;
  role: string;
  timezone: string;
  currency: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  permissions: string[];
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  accountName?: string;
}
