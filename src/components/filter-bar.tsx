"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  onFiltersChange?: (filters: { channel?: string; campaign?: string }) => void;
}

const channels = ["All Channels", "Google Ads", "Facebook Ads", "LinkedIn Ads", "Email", "Organic"];
const campaigns = ["All Campaigns", "Summer Sale 2024", "Brand Awareness Q1", "Product Launch", "Holiday Campaign", "Retargeting"];

export function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [channel, setChannel] = useState("All Channels");
  const [campaign, setCampaign] = useState("All Campaigns");

  const hasFilters = channel !== "All Channels" || campaign !== "All Campaigns";

  const handleChange = (newChannel: string, newCampaign: string) => {
    setChannel(newChannel);
    setCampaign(newCampaign);
    onFiltersChange?.({
      channel: newChannel === "All Channels" ? undefined : newChannel,
      campaign: newCampaign === "All Campaigns" ? undefined : newCampaign,
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={channel}
        onChange={(e) => handleChange(e.target.value, campaign)}
        className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {channels.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        value={campaign}
        onChange={(e) => handleChange(channel, e.target.value)}
        className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {campaigns.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleChange("All Channels", "All Campaigns")}
          className="h-8 px-2 text-xs text-zinc-500 hover:text-zinc-900"
        >
          <X className="size-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
