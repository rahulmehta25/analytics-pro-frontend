"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Plug,
  Lightbulb,
  FlaskConical,
  Megaphone,
  FileText,
  Settings,
  Search,
  BarChart3,
  Download,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useCommandPaletteStore } from "@/store";
import { campaignsData } from "@/lib/mock-data";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "D" },
  { label: "Query", href: "/dashboard/query", icon: MessageSquare, shortcut: "Q" },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone, shortcut: "C" },
  { label: "Reports", href: "/dashboard/reports", icon: FileText, shortcut: "R" },
  { label: "Connectors", href: "/dashboard/connectors", icon: Plug },
  { label: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, shortcut: "," },
  { label: "RAG Demo", href: "/dashboard/rag-demo", icon: FlaskConical },
];

const actionItems = [
  { label: "Export dashboard data", action: "export-dashboard", icon: Download },
  { label: "Refresh all data", action: "refresh-data", icon: RefreshCw },
  { label: "Toggle comparison mode", action: "toggle-comparison", icon: TrendingUp },
];

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, close, toggle } = useCommandPaletteStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const handleSelect = useCallback(
    (value: string) => {
      const navItem = navigationItems.find((item) => item.href === value);
      if (navItem) {
        router.push(navItem.href);
        close();
        return;
      }

      const campaign = campaignsData.find((c) => c.id === value);
      if (campaign) {
        router.push(`/dashboard/campaigns?id=${campaign.id}`);
        close();
        return;
      }

      const action = actionItems.find((item) => item.action === value);
      if (action) {
        close();
        return;
      }
    },
    [router, close]
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <Command>
        <CommandInput placeholder="Search commands, pages, campaigns..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                value={item.href}
                onSelect={handleSelect}
              >
                <item.icon className="size-4 text-zinc-500" />
                <span>{item.label}</span>
                {item.shortcut && (
                  <CommandShortcut>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 rounded">
                      {item.shortcut}
                    </kbd>
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Campaigns">
            {campaignsData.slice(0, 5).map((campaign) => (
              <CommandItem
                key={campaign.id}
                value={campaign.id}
                onSelect={handleSelect}
              >
                <Megaphone className="size-4 text-zinc-500" />
                <span>{campaign.name}</span>
                <span className="ml-auto text-xs text-zinc-400">
                  {campaign.channel}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            {actionItems.map((item) => (
              <CommandItem
                key={item.action}
                value={item.action}
                onSelect={handleSelect}
              >
                <item.icon className="size-4 text-zinc-500" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function CommandPaletteButton() {
  const { open } = useCommandPaletteStore();

  return (
    <button
      onClick={open}
      className="hidden md:flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
    >
      <Search className="size-4" />
      <span>Search...</span>
      <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
        <span className="text-xs">&#x2318;</span>K
      </kbd>
    </button>
  );
}
