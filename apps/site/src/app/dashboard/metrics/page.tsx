"use client";

import { useState, useEffect } from "react";
import { BarChart3, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MetricRow {
  metric_key: string;
  period: string;
  value: number;
}

export default function DashboardMetricsPage() {
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard-metrics")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMetrics(data);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateLocal(key: string, period: string, value: number) {
    setMetrics((prev) =>
      prev.map((m) =>
        m.metric_key === key && m.period === period ? { ...m, value } : m
      )
    );
  }

  async function handleSave(key: string, period: string, value: number) {
    setSaving(`${key}-${period}`);
    try {
      const res = await fetch("/api/dashboard-metrics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metric_key: key, period, value }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const gdp = metrics.filter((m) => m.metric_key === "gdp_brought_malaysia");
  const grants = metrics.filter((m) => m.metric_key === "grants_awarded");
  const bounties = metrics.filter((m) => m.metric_key === "bounties_awarded");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Dashboard Metrics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit values shown in the dashboard overview. Bounties are fetched from{" "}
          <a href="https://superteam.fun/earn/s/superteammalaysia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            superteam.fun
          </a>{" "}
          when available.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>GDP Brought to Malaysia</CardTitle>
            <CardDescription>Total value Superteam MY has brought to Malaysia (USD)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gdp.map((m) => (
              <div key={`${m.metric_key}-${m.period}`} className="flex items-center gap-4">
                <Label className="w-28 capitalize">{m.period.replace("_", " ")}</Label>
                <Input
                  type="number"
                  value={m.value}
                  onChange={(e) => updateLocal(m.metric_key, m.period, Number(e.target.value) || 0)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSave(m.metric_key, m.period, metrics.find((x) => x.metric_key === m.metric_key && x.period === m.period)?.value ?? m.value)}
                  disabled={saving === `${m.metric_key}-${m.period}`}
                >
                  {saving === `${m.metric_key}-${m.period}` ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grants Awarded</CardTitle>
            <CardDescription>Number of grants awarded</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {grants.map((m) => (
              <div key={`${m.metric_key}-${m.period}`} className="flex items-center gap-4">
                <Label className="w-28 capitalize">{m.period.replace("_", " ")}</Label>
                <Input
                  type="number"
                  value={m.value}
                  onChange={(e) => updateLocal(m.metric_key, m.period, Number(e.target.value) || 0)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSave(m.metric_key, m.period, metrics.find((x) => x.metric_key === m.metric_key && x.period === m.period)?.value ?? m.value)}
                  disabled={saving === `${m.metric_key}-${m.period}`}
                >
                  {saving === `${m.metric_key}-${m.period}` ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounties (fallback)</CardTitle>
            <CardDescription>Used only when superteam.fun cannot be fetched</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bounties.map((m) => (
              <div key={`${m.metric_key}-${m.period}`} className="flex items-center gap-4">
                <Label className="w-28 capitalize">{m.period.replace("_", " ")}</Label>
                <Input
                  type="number"
                  value={m.value}
                  onChange={(e) => updateLocal(m.metric_key, m.period, Number(e.target.value) || 0)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSave(m.metric_key, m.period, metrics.find((x) => x.metric_key === m.metric_key && x.period === m.period)?.value ?? m.value)}
                  disabled={saving === `${m.metric_key}-${m.period}`}
                >
                  {saving === `${m.metric_key}-${m.period}` ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
