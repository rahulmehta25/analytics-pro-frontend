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
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { connectorData } from "@/lib/mock-data";

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
        const data = await getConnectors();
        setConnectors(data);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Data Connectors</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your data sources and integrations
          </p>
        </div>

        <Dialog>
          <DialogTrigger
            render={<Button variant="outline" className="gap-2" />}
          >
            <Plus className="size-4" />
            Add Connector
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add a new connector</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              {additionalConnectors.map((connector) => (
                <button
                  key={connector.name}
                  className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 p-3 text-left transition-colors hover:bg-zinc-50"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-100">
                    <connector.icon className="size-4 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {connector.name}
                    </p>
                    <p className="text-xs text-zinc-500">{connector.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {connectors.map((connector) => {
          const Icon = iconMap[connector.icon as keyof typeof iconMap];
          const isConnected = connector.status === "connected";
          const isSyncing = syncing === connector.id;

          return (
            <Card
              key={connector.id}
              className="border-zinc-200 shadow-sm rounded-xl transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100">
                      {Icon && <Icon className="size-5 text-zinc-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {connector.name}
                      </p>
                      <p className="text-xs text-zinc-500">{connector.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      isConnected
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-zinc-50 text-zinc-400 border-zinc-200"
                    }
                  >
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Last sync: {connector.lastSync}</span>
                      <span>{connector.rowsSynced.toLocaleString()} rows</span>
                    </div>
                    {/* Health bar */}
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
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
                      <span className="text-xs text-zinc-400">
                        {connector.health}% healthy
                      </span>
                    </div>
                  </div>

                  {isConnected && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => handleSync(connector.id)}
                      disabled={isSyncing}
                    >
                      <RefreshCw
                        className={`size-3 ${isSyncing ? "animate-spin" : ""}`}
                      />
                      {isSyncing ? "Syncing..." : "Sync Now"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
