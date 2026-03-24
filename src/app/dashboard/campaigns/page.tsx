"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  MoreHorizontal,
  X,
  TrendingUp,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DateRangePicker } from "@/components/date-range-picker";
import { campaignsData } from "@/lib/mock-data";
import { exportToCSV, formatCampaignDataForExport, generateExportFilename } from "@/lib/export";
import { cn } from "@/lib/utils";
import type { Campaign, CampaignStatus, CampaignChannel } from "@/types";

const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-50" },
  paused: { label: "Paused", color: "text-amber-700", bg: "bg-amber-50" },
  ended: { label: "Ended", color: "text-zinc-600", bg: "bg-zinc-100" },
  draft: { label: "Draft", color: "text-blue-700", bg: "bg-blue-50" },
};

const channelColors: Record<CampaignChannel, string> = {
  "Google Ads": "#4285f4",
  "Meta": "#1877f2",
  "LinkedIn": "#0a66c2",
  "Email": "#059669",
  "TikTok": "#000000",
  "Twitter": "#1da1f2",
};

export default function CampaignsPage() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus[]>([]);
  const [channelFilter, setChannelFilter] = useState<CampaignChannel[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    selectedId ? campaignsData.find(c => c.id === selectedId) || null : null
  );
  const [comparisonCampaign, setComparisonCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(campaign.status);
      const matchesChannel = channelFilter.length === 0 || channelFilter.includes(campaign.channel);
      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [search, statusFilter, channelFilter]);

  const handleExport = () => {
    const data = formatCampaignDataForExport(filteredCampaigns);
    exportToCSV(data, generateExportFilename("campaigns"));
  };

  const toggleStatusFilter = (status: CampaignStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleChannelFilter = (channel: CampaignChannel) => {
    setChannelFilter((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const totalSpend = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold gradient-text">Campaigns</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage and analyze all marketing campaigns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker />
          <Button variant="outline" onClick={handleExport}>
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in-up stagger-1 hover-lift">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <DollarSign className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Spend</p>
                <p className="text-xl font-semibold">${(totalSpend / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
        <div className="animate-fade-in-up stagger-2 hover-lift">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <TrendingUp className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Revenue</p>
                <p className="text-xl font-semibold">${(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
        <div className="animate-fade-in-up stagger-3 hover-lift">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Users className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Conversions</p>
                <p className="text-xl font-semibold">{(totalConversions / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
        <div className="animate-fade-in-up stagger-4 hover-lift">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Target className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Avg ROAS</p>
                <p className="text-xl font-semibold">{avgRoas.toFixed(1)}x</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Campaign Table */}
        <Card className="flex-1 border-zinc-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base font-medium">All Campaigns</CardTitle>
              <div className="flex items-center gap-2 animate-slide-in-left">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <Input
                    placeholder="Search campaigns..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-8"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                    <Filter className="size-4" />
                    Filters
                    {(statusFilter.length > 0 || channelFilter.length > 0) && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                        {statusFilter.length + channelFilter.length}
                      </Badge>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-xs font-medium text-zinc-500">Status</div>
                    {(["active", "paused", "ended", "draft"] as CampaignStatus[]).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => toggleStatusFilter(status)}
                        className={cn(statusFilter.includes(status) && "bg-blue-50")}
                      >
                        <Badge className={cn("mr-2", statusConfig[status].bg, statusConfig[status].color)}>
                          {statusConfig[status].label}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-xs font-medium text-zinc-500">Channel</div>
                    {(["Google Ads", "Meta", "LinkedIn", "Email", "TikTok"] as CampaignChannel[]).map((channel) => (
                      <DropdownMenuItem
                        key={channel}
                        onClick={() => toggleChannelFilter(channel)}
                        className={cn(channelFilter.includes(channel) && "bg-blue-50")}
                      >
                        <span
                          className="size-2 rounded-full mr-2"
                          style={{ backgroundColor: channelColors[channel] }}
                        />
                        {channel}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Conv.</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    <TableHead className="text-right">CPA</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign, index) => (
                    <TableRow
                      key={campaign.id}
                      className={cn(
                        "cursor-pointer animate-fade-in-up",
                        selectedCampaign?.id === campaign.id && "bg-blue-50"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: channelColors[campaign.channel] }}
                          />
                          <div>
                            <p className="font-medium text-zinc-900">{campaign.name}</p>
                            <p className="text-xs text-zinc-500">{campaign.channel}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(statusConfig[campaign.status].bg, statusConfig[campaign.status].color)}>
                          {statusConfig[campaign.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${campaign.spent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.conversions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          campaign.roas >= 5 ? "text-emerald-600" :
                          campaign.roas >= 3 ? "text-blue-600" :
                          "text-amber-600"
                        )}>
                          {campaign.roas.toFixed(1)}x
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        ${campaign.cpa.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setComparisonCampaign(campaign)}>
                              Compare
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {campaign.status === "active" ? "Pause" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Detail Panel */}
        {selectedCampaign && (
          <Card className="lg:w-[400px] border-zinc-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium">{selectedCampaign.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn(statusConfig[selectedCampaign.status].bg, statusConfig[selectedCampaign.status].color)}>
                      {statusConfig[selectedCampaign.status].label}
                    </Badge>
                    <span className="text-xs text-zinc-500">{selectedCampaign.channel}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSelectedCampaign(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500">Budget</p>
                  <p className="text-lg font-semibold">${selectedCampaign.budget.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">
                    {((selectedCampaign.spent / selectedCampaign.budget) * 100).toFixed(0)}% used
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-500">Revenue</p>
                  <p className="text-lg font-semibold">${selectedCampaign.revenue.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="size-3" />
                    {selectedCampaign.roas.toFixed(1)}x ROAS
                  </p>
                </div>
              </div>

              {/* Performance Chart */}
              {selectedCampaign.performance.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-3">Performance (30 days)</p>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedCampaign.performance.slice(-14)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val / 1000}k`} />
                        <Tooltip
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                          labelFormatter={(label) => new Date(label as string).toLocaleDateString()}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#2563eb"
                          fill="url(#colorRevenue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Comparison */}
              {comparisonCampaign && comparisonCampaign.id !== selectedCampaign.id && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-zinc-500">
                      vs {comparisonCampaign.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setComparisonCampaign(null)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ROAS</span>
                      <span className={cn(
                        selectedCampaign.roas > comparisonCampaign.roas ? "text-emerald-600" : "text-red-600"
                      )}>
                        {selectedCampaign.roas > comparisonCampaign.roas ? "+" : ""}
                        {(selectedCampaign.roas - comparisonCampaign.roas).toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">CPA</span>
                      <span className={cn(
                        selectedCampaign.cpa < comparisonCampaign.cpa ? "text-emerald-600" : "text-red-600"
                      )}>
                        {selectedCampaign.cpa < comparisonCampaign.cpa ? "-" : "+"}
                        ${Math.abs(selectedCampaign.cpa - comparisonCampaign.cpa).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Conversions</span>
                      <span className={cn(
                        selectedCampaign.conversions > comparisonCampaign.conversions ? "text-emerald-600" : "text-red-600"
                      )}>
                        {selectedCampaign.conversions > comparisonCampaign.conversions ? "+" : ""}
                        {(selectedCampaign.conversions - comparisonCampaign.conversions).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm">
                  {selectedCampaign.status === "active" ? (
                    <>
                      <Pause className="size-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="size-4" />
                      Activate
                    </>
                  )}
                </Button>
                <Button className="flex-1" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
