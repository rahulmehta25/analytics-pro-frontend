"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  DollarSign,
  TrendingUp,
  Filter,
  Play,
  RefreshCw,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/date-range-picker";
import { reportTemplates, generatedReports } from "@/lib/mock-data";
import { exportToCSV, generateExportFilename } from "@/lib/export";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReportTemplate, ReportFormat } from "@/types";

const iconMap: Record<string, typeof BarChart3> = {
  BarChart3,
  PieChart,
  DollarSign,
  TrendingUp,
  Filter,
};

const formatIcons: Record<ReportFormat, typeof FileText> = {
  pdf: FileText,
  csv: FileSpreadsheet,
  xlsx: File,
};

const formatColors: Record<ReportFormat, string> = {
  pdf: "text-red-600 bg-red-50",
  csv: "text-emerald-600 bg-emerald-50",
  xlsx: "text-blue-600 bg-blue-50",
};

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("pdf");

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const handleDownload = (report: typeof generatedReports[0]) => {
    // In a real app, this would download the file
    console.log("Downloading:", report.name);
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">Reports</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Generate and download marketing reports
          </p>
        </div>
        <DateRangePicker />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Templates */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-medium text-zinc-700">Report Templates</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {reportTemplates.map((template) => {
              const Icon = iconMap[template.icon] || FileText;
              return (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer border-zinc-200 shadow-sm transition-all hover:shadow-md",
                    selectedTemplate?.id === template.id && "ring-2 ring-blue-500"
                  )}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Icon className="size-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900">{template.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {template.frequency && (
                            <Badge variant="secondary" className="text-xs">
                              {template.frequency}
                            </Badge>
                          )}
                          {template.lastGenerated && (
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                              <Clock className="size-3" />
                              {template.lastGenerated}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Generate Panel */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-zinc-700">Generate Report</h2>
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="p-4 space-y-4">
              {selectedTemplate ? (
                <>
                  <div>
                    <p className="text-sm font-medium">{selectedTemplate.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{selectedTemplate.description}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-600">Format</label>
                    <div className="flex gap-2">
                      {(["pdf", "csv", "xlsx"] as ReportFormat[]).map((format) => {
                        const FormatIcon = formatIcons[format];
                        return (
                          <button
                            key={format}
                            onClick={() => setSelectedFormat(format)}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors",
                              selectedFormat === format
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-zinc-200 hover:bg-zinc-50"
                            )}
                          >
                            <FormatIcon className="size-4" />
                            <span className="text-xs font-medium uppercase">{format}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="size-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="size-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">Select a template to generate a report</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Reports History */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-700">Recent Reports</h2>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReports.map((report) => {
                  const FormatIcon = formatIcons[report.format];
                  return (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={cn("p-1.5 rounded-lg", formatColors[report.format])}>
                            <FormatIcon className="size-4" />
                          </div>
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-zinc-500 text-sm">
                          {report.dateRange.start} - {report.dateRange.end}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-zinc-500 text-sm">
                          {new Date(report.generatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="uppercase">
                          {report.format}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-zinc-500 text-sm">{report.size}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(report)}
                        >
                          <Download className="size-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
