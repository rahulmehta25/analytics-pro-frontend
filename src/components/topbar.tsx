"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "@/components/notifications";
import { CommandPaletteButton } from "@/components/command-palette";

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Dashboard",
  query: "Query",
  connectors: "Connectors",
  insights: "Insights",
  "rag-demo": "RAG Demo",
  campaigns: "Campaigns",
  reports: "Reports",
  settings: "Settings",
};

export function Topbar() {
  const pathname = usePathname();

  // Build breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => ({
    label: breadcrumbLabels[segment] || segment,
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="size-3.5 text-zinc-300" />
              )}
              {crumb.isLast ? (
                <span className="font-medium text-zinc-900">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <Badge
          variant="secondary"
          className="ml-2 bg-zinc-100 text-zinc-600 text-[10px] font-medium hidden sm:inline-flex"
        >
          Demo
        </Badge>
      </div>

      {/* Right: Search, notifications, user */}
      <div className="flex items-center gap-2">
        {/* Command Palette Button */}
        <CommandPaletteButton />

        {/* Notifications */}
        <NotificationBell />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-zinc-100" />
            }
          >
            <Avatar className="size-7 border border-zinc-200">
              <AvatarFallback className="bg-zinc-100 text-zinc-700 text-xs font-medium">
                DU
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-zinc-900">Demo User</p>
              <p className="text-xs text-zinc-500">demo@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
