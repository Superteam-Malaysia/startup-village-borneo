"use client";

import { useMemo, useState } from "react";
import { Download, Mail, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { NewsletterSubscriber } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Wraps a field so commas, quotes and newlines survive the round trip. */
function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

interface AdminSubscribersClientProps {
  initialSubscribers: NewsletterSubscriber[];
}

export function AdminSubscribersClient({
  initialSubscribers,
}: AdminSubscribersClientProps) {
  const [subscribers, setSubscribers] =
    useState<NewsletterSubscriber[]>(initialSubscribers);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (statusFilter === "active" && !s.is_active) return false;
      if (statusFilter === "unsubscribed" && s.is_active) return false;
      return !q || s.email.toLowerCase().includes(q);
    });
  }, [subscribers, query, statusFilter]);

  const activeCount = subscribers.filter((s) => s.is_active).length;

  async function toggleActive(sub: NewsletterSubscriber) {
    const nextActive = !sub.is_active;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        is_active: nextActive,
        unsubscribed_at: nextActive ? null : new Date().toISOString(),
      })
      .eq("id", sub.id);

    if (!error) {
      setSubscribers((prev) =>
        prev.map((s) =>
          s.id === sub.id
            ? {
                ...s,
                is_active: nextActive,
                unsubscribed_at: nextActive ? null : new Date().toISOString(),
              }
            : s
        )
      );
    }
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Permanently delete ${email} from the mailing list?`)) return;
    const res = await fetch(`/api/subscribe?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function exportCsv() {
    const rows = [
      ["Email", "Source", "Status", "Signed up"],
      ...filtered.map((s) => [
        s.email,
        s.source ?? "",
        s.is_active ? "Active" : "Unsubscribed",
        s.created_at,
      ]),
    ];
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Emails captured by the community updates form in the site footer.
          </p>
        </div>
        <Button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Active
          </p>
          <p className="text-2xl font-bold mt-1">{activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total
          </p>
          <p className="text-2xl font-bold mt-1">{subscribers.length}</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 cursor-text"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "active", "unsubscribed"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors cursor-pointer",
                statusFilter === f
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 flex flex-col items-center text-center gap-2">
          <Mail className="w-6 h-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {subscribers.length === 0
              ? "No signups yet. Emails from the footer form will appear here."
              : "No subscribers match this filter."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signed up</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub.id} className="group">
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {sub.source ?? "—"}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => toggleActive(sub)}
                      title={
                        sub.is_active
                          ? "Mark as unsubscribed"
                          : "Mark as active"
                      }
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-opacity hover:opacity-80",
                        sub.is_active
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {sub.is_active ? "Active" : "Unsubscribed"}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(sub.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handleDelete(sub.id, sub.email)}
                      aria-label={`Delete ${sub.email}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
