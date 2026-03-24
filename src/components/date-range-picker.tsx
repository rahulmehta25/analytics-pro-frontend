"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const presets = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "Quarter", days: 90 },
] as const;

export interface DateRangePickerProps {
  onPeriodChange?: (period: string) => void;
  activePeriod?: string;
}

export function DateRangePicker({ onPeriodChange, activePeriod = "30d" }: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="flex items-center gap-2">
      <Calendar className="size-4 text-zinc-400" />
      <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowCustom(false);
              onPeriodChange?.(preset.label === "Quarter" ? "90d" : preset.label);
            }}
            className={`h-7 px-3 text-xs font-medium rounded-md transition-colors ${
              activePeriod === (preset.label === "Quarter" ? "90d" : preset.label) && !showCustom
                ? "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {preset.label}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCustom(!showCustom)}
          className={`h-7 px-3 text-xs font-medium rounded-md transition-colors ${
            showCustom
              ? "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Custom
        </Button>
      </div>
      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-7 rounded-md border border-zinc-200 px-2 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-xs text-zinc-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-7 rounded-md border border-zinc-200 px-2 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}
