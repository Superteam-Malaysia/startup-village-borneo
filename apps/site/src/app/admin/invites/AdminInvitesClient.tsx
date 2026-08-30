"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Copy, Trash2, Check, Link2, Mail, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Invite, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

function getInviteStatus(invite: Invite): { label: string; className: string } {
  if (invite.is_used) return { label: "Used", className: "bg-muted text-white" };
  if (new Date(invite.expires_at) < new Date()) return { label: "Expired", className: "bg-red-500/10 text-red-500" };
  return { label: "Pending", className: "bg-green-500/10 text-green-500" };
}

export function AdminInvitesClient() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "used" | "expired">("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [formData, setFormData] = useState({ email: "", invited_role: "member" as UserRole });

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  useEffect(() => {
    if (!toast) return;
    setToastExiting(false);
    toastTimeoutRef.current = setTimeout(() => {
      setToastExiting(true);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
        setToastExiting(false);
      }, 300);
    }, 4000);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toast]);

  async function fetchInvites() {
    const { data, error } = await supabase
      .from("invites")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setInvites(data as Invite[]);
    setIsLoading(false);
  }

  async function handleCreate() {
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email || null,
        invited_role: formData.invited_role,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setToast({ message: data.error || "Failed to create invite", type: "error" });
      return;
    }

    setInvites([data.invite, ...invites]);
    setIsModalOpen(false);
    setFormData({ email: "", invited_role: "member" });

    await navigator.clipboard.writeText(data.inviteUrl);
    setToast({ message: "Invite created and link copied to clipboard!", type: "success" });
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/invites?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setInvites(invites.filter((i) => i.id !== id));
      setToast({ message: "Invite deleted", type: "success" });
    }
  }

  async function copyLink(token: string, id: string) {
    const siteUrl = window.location.origin;
    await navigator.clipboard.writeText(`${siteUrl}/invite/${token}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredInvites = invites.filter((invite) => {
    if (statusFilter === "all") return true;
    const status = getInviteStatus(invite);
    return status.label.toLowerCase() === statusFilter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Invites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate invite links to onboard new members
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData({ email: "", invited_role: "member" });
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Generate Invite
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "used", "expired"] as const).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="cursor-pointer capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
      ) : filteredInvites.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {invites.length === 0 ? "No invites yet. Generate one to onboard members." : "No invites match this filter."}
        </p>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Invite
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvites.map((invite) => {
                  const status = getInviteStatus(invite);
                  return (
                    <tr
                      key={invite.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {invite.email ? (
                            <>
                              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span className="text-white">{invite.email}</span>
                            </>
                          ) : (
                            <>
                              <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span className="text-muted-foreground">Generic link</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted capitalize">
                          {invite.invited_role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status.className)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {formatDate(invite.created_at)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {formatDate(invite.expires_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!invite.is_used && new Date(invite.expires_at) > new Date() && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() => copyLink(invite.token, invite.id)}
                              title="Copy link"
                            >
                              {copiedId === invite.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer text-destructive hover:text-destructive"
                            onClick={() => handleDelete(invite.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#080B0E] border-white/10 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_textarea]:bg-[#171717] [&_textarea]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Generate Invite</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email (optional)</Label>
              <Input
                type="email"
                placeholder="Leave empty for a generic invite link"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="cursor-text"
              />
              <p className="text-xs text-muted-foreground">
                If set, only this email can use the invite.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-2">
                {(["member", "admin"] as const).map((role) => {
                  const isSelected = formData.invited_role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, invited_role: role })}
                      className={cn(
                        "flex flex-1 items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border-2",
                        isSelected
                          ? "bg-white/10 text-white border-white ring-2 ring-white/30"
                          : "bg-[#171717] border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white hover:border-white/20"
                      )}
                    >
                      <Shield className={cn("w-4 h-4", isSelected ? "text-white" : "text-muted-foreground")} />
                      <span className="capitalize">{role}</span>
                      {isSelected && <Check className="w-4 h-4 text-white ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer bg-background border-white/10 hover:bg-[#171717] hover:text-white hover:border-white/20"
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} className="cursor-pointer bg-background border-white/10  hover:bg-[#171717] hover:text-white hover:border-white/20">
              Generate & Copy Link  
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && (
        <div
          className={cn(
            "fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg border border-white/10 bg-background px-4 py-3 shadow-lg transition-all duration-300",
            toastExiting ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <p className={cn("text-sm font-medium", toast.type === "error" ? "text-destructive" : "text-foreground")}>
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
}
