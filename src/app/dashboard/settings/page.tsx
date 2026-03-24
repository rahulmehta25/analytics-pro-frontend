"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Key,
  Plug,
  Copy,
  Eye,
  EyeOff,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Megaphone,
  MessageSquare,
  Database,
  Users,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  userSettings,
  notificationPreferences as defaultNotifPrefs,
  apiKeys,
  integrations,
} from "@/lib/mock-data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NotificationPreferences } from "@/types";

const iconMap: Record<string, typeof BarChart3> = {
  BarChart3,
  Megaphone,
  MessageSquare,
  Database,
  Users,
  Target,
  Facebook: Megaphone,
  Linkedin: Users,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(userSettings);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(defaultNotifPrefs);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyKey = (keyId: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const toggleNotifPref = (key: keyof NotificationPreferences) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div className="space-y-6 max-w-4xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your account, notifications, and integrations
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">
            <User className="size-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="size-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="size-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={settings.company}
                    onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={settings.role}
                    onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (E)</option>
                    <option value="GBP">GBP (P)</option>
                    <option value="JPY">JPY (Y)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "emailAlerts" as const, label: "Email Alerts", desc: "Receive critical alerts via email" },
                  { key: "budgetAlerts" as const, label: "Budget Alerts", desc: "Get notified when campaigns approach budget limits" },
                  { key: "performanceDigest" as const, label: "Performance Digest", desc: "Daily summary of campaign performance" },
                  { key: "weeklyReport" as const, label: "Weekly Report", desc: "Comprehensive weekly performance report" },
                  { key: "criticalOnly" as const, label: "Critical Only", desc: "Only receive notifications for critical issues" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotifPref(item.key)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        notifPrefs[item.key] ? "bg-blue-600" : "bg-zinc-200"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          notifPrefs[item.key] ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Connected Integrations</CardTitle>
              <CardDescription>Manage your data source connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => {
                  const Icon = iconMap[integration.icon] || Plug;
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          integration.connected ? "bg-blue-50" : "bg-zinc-100"
                        )}>
                          <Icon className={cn(
                            "size-5",
                            integration.connected ? "text-blue-600" : "text-zinc-400"
                          )} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{integration.name}</p>
                          {integration.connected ? (
                            <p className="text-xs text-zinc-500">
                              {integration.accountName} - Last sync: {integration.lastSync}
                            </p>
                          ) : (
                            <p className="text-xs text-zinc-400">Not connected</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integration.connected ? (
                          <>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                              Connected
                            </Badge>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="size-4" />
                              Sync
                            </Button>
                          </>
                        ) : (
                          <Button size="sm">
                            <Plus className="size-4" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">API Keys</CardTitle>
                  <CardDescription>Manage your API access credentials</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="size-4" />
                  Create Key
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-xs text-zinc-500">Created {key.createdAt}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-zinc-100 px-2 py-1 rounded font-mono">
                            {showKeys[key.id] ? key.key.replace(/\*/g, "x") : key.key}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {showKeys[key.id] ? (
                              <EyeOff className="size-3" />
                            ) : (
                              <Eye className="size-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleCopyKey(key.id, key.key)}
                          >
                            {copiedKey === key.id ? (
                              <Check className="size-3 text-emerald-600" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-zinc-500">{key.lastUsed || "Never"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-xs" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
