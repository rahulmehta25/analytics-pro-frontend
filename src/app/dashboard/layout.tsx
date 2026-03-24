"use client";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { CommandPalette } from "@/components/command-palette";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Plug,
  Lightbulb,
  Megaphone,
  FileText,
  Settings,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/query", label: "Query", icon: MessageSquare },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/connectors", label: "Connectors", icon: Plug },
  { href: "/dashboard/insights", label: "Insights", icon: Lightbulb },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {/* Mobile navigation */}
          <nav className="flex gap-1 overflow-x-auto border-b border-zinc-200 bg-white px-4 py-2 md:hidden">
            {mobileNavItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100"
                  )}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
