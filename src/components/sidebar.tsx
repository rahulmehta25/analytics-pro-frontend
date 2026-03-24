"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Plug,
  Lightbulb,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Megaphone,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/query", label: "Query", icon: MessageSquare },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/connectors", label: "Connectors", icon: Plug },
  { href: "/dashboard/insights", label: "Insights", icon: Lightbulb },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/rag-demo", label: "RAG Demo", icon: FlaskConical },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className="hidden h-full flex-col border-r border-zinc-200 bg-white md:flex overflow-hidden"
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Logo area */}
      <div className={cn(
        "flex h-14 items-center border-b border-zinc-100 px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-zinc-900">
                <BarChart3 className="size-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">Analytics Pro</span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900">
                <BarChart3 className="size-4 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <div className={cn(
          "mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-400",
          collapsed && "sr-only"
        )}>
          Menu
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                collapsed && "justify-center px-2",
                isActive
                  ? "text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-zinc-900"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <item.icon className={cn(
                  "size-4 flex-shrink-0",
                  isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"
                )} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-zinc-100 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
