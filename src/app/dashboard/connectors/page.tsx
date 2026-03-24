"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart3,
  Database,
  Users,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Globe,
  Mail,
  ShoppingCart,
  Webhook,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { connectorData } from "@/lib/mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const iconMap = {
  BarChart3,
  Database,
  Users,
  FileSpreadsheet,
} as const;

const additionalConnectors = [
  { name: "HubSpot", description: "Marketing automation and CRM", icon: Globe },
  { name: "Mailchimp", description: "Email marketing campaigns", icon: Mail },
  { name: "Shopify", description: "E-commerce platform data", icon: ShoppingCart },
  { name: "Custom API", description: "Connect any REST API endpoint", icon: Webhook },
];

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState(connectorData);
  const [syncing, setSyncing] = useState<string | null>(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const { getConnectors } = await import("@/lib/api");
        const result = await getConnectors();
        setConnectors(result.data);
      } catch {
        // fallback to mock
      }
    }
    fetchData();
  }, []);

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2000);
  };

  const connectedCount = connectors.filter((c) => c.status === "connected").length;

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">Data Connectors</h1>
          <p className="text-sm text-zinc-500">
            {connectedCount} of {connectors.length} sources connected
          </p>
        </div>

        <Dialog>
          <DialogTrigger
            render={
              <Button className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800" />
            }
          >
            <Plus className="size-4" />
            Add Connector
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Add a new connector</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-zinc-500 -mt-2">
              Connect additional data sources to enrich your analytics.
            </p>
            <div className="space-y-2 pt-2">
              {additionalConnectors.map((connector) => (
                <button
                  key={connector.name}
                  className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 p-3 text-left transition-all hover:bg-zinc-50 hover:border-zinc-300 group"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors">
                    <connector.icon className="size-5 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900">
                      {connector.name}
                    </p>
                    <p className="text-xs text-zinc-500">{connector.description}</p>
                  </div>
                  <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connectors Grid */}
      <motion.div className="grid grid-cols-1 gap-4 lg:grid-cols-2" variants={containerVariants} initial="hidden" animate="show">
        {connectors.map((connector) => {
          const Icon = iconMap[connector.icon as keyof typeof iconMap];
          const isConnected = connector.status === "connected";
          const isSyncing = syncing === connector.id;

          return (
            <motion.div
              key={connector.id}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Card className="border-zinc-200 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  {/* Header section */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-lg ${isConnected ? "bg-emerald-50" : "bg-zinc-100"}`}>
                          {Icon && <Icon className={`size-5 ${isConnected ? "text-emerald-600" : "text-zinc-500"}`} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {connector.name}
                          </p>
                          <p className="text-xs text-zinc-500">{connector.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isConnected ? (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        ) : (
                          <XCircle className="size-4 text-zinc-400" />
                        )}
                        <span className={`text-xs font-medium ${isConnected ? "text-emerald-600" : "text-zinc-500"}`}>
                          {isConnected ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats section */}
                  {isConnected && (
                    <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          {/* Sync info */}
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Clock className="size-3" />
                            <span>Last sync: {connector.lastSync}</span>
                          </div>
                          {/* Health bar */}
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 rounded-full bg-zinc-200 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${connector.health}%`,
                                  backgroundColor:
                                    connector.health > 80
                                      ? "#10b981"
                                      : connector.health > 50
                                        ? "#f59e0b"
                                        : "#ef4444",
                                }}
                              />
                            </div>
                            <span className="text-xs text-zinc-500">
                              {connector.health}%
                            </span>
                          </div>
                          {/* Row count */}
                          <p className="text-xs text-zinc-500">
                            <span className="font-medium text-zinc-700 tabular-nums">
                              {connector.rowsSynced.toLocaleString()}
                            </span>{" "}
                            rows synced
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs border-zinc-200 hover:bg-white"
                          onClick={() => handleSync(connector.id)}
                          disabled={isSyncing}
                        >
                          <RefreshCw
                            className={`size-3 ${isSyncing ? "animate-spin" : ""}`}
                          />
                          {isSyncing ? "Syncing..." : "Sync"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Disconnected state */}
                  {!isConnected && (
                    <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-zinc-200"
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
