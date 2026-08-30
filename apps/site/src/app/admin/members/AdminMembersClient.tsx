"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MoreVertical, Shield, Eye, UserX, UserCheck, ExternalLink, Mail, Pencil, Award, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { MEMBER_BADGES } from "@/lib/badges";
import type { Profile, UserRole } from "@/lib/types";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminMembersClientProps {
  initialProfiles: Profile[];
  userRole?: UserRole;
}

const roleColors: Record<UserRole, string> = {
  super_admin: "bg-red-500/10 text-red-500",
  admin: "bg-blue-500/10 text-blue-500",
  member: "bg-green-500/10 text-green-500",
};



export function AdminMembersClient({ initialProfiles, userRole = "member" }: AdminMembersClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "onboarded" | "onboarding" | "rejected" | "deactivated">("all");
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] = useState<{ id: string; nickname: string; currentRole: UserRole } | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("member");
  const [deactivateConfirm, setDeactivateConfirm] = useState<{ id: string; nickname: string } | null>(null);
  const [editMember, setEditMember] = useState<{ profile: Profile; memberNumber: string; badges: string[] } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Self-registrations waiting on a super admin. Shown in their own queue above the
  // table rather than mixed into it, so they don't get lost among existing members.
  const awaitingApproval = profiles.filter((p) => p.approval_status === "pending");

  const filteredProfiles = profiles.filter((p) => {
    if (p.approval_status === "pending") return false;

    const matchesSearch =
      !searchQuery.trim() ||
      (p.nickname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.real_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const isDeactivated = p.is_active === false;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "onboarded" && p.onboarding_completed && !isDeactivated) ||
      // "onboarding" = approved but hasn't finished their profile yet. Distinct
      // from approval-pending, which lives in the queue above.
      (statusFilter === "onboarding" && !p.onboarding_completed && !isDeactivated) ||
      (statusFilter === "rejected" && p.approval_status === "rejected") ||
      (statusFilter === "deactivated" && isDeactivated);

    return matchesSearch && matchesStatus;
  });

  async function handleRoleChange() {
    if (!roleChangeTarget) return;

    const res = await fetch("/api/admin/update-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: roleChangeTarget.id, newRole }),
    });

    if (res.ok) {
      setProfiles(profiles.map((p) =>
        p.id === roleChangeTarget.id ? { ...p, user_role: newRole } : p
      ));
      setToast({ message: `Role updated to ${newRole.replace("_", " ")}`, type: "success" });
    } else {
      const data = await res.json();
      setToast({ message: data.error || "Failed to update role", type: "error" });
    }
    setRoleChangeTarget(null);
  }

  async function handleDeactivate() {
    if (!deactivateConfirm) return;

    const res = await fetch("/api/admin/deactivate-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: deactivateConfirm.id }),
    });

    if (res.ok) {
      setProfiles(profiles.map((p) =>
        p.id === deactivateConfirm.id ? { ...p, is_active: false } : p
      ));
      setToast({ message: "Member deactivated", type: "success" });
    } else {
      const data = await res.json();
      setToast({ message: data.error || "Failed to deactivate member", type: "error" });
    }
    setDeactivateConfirm(null);
  }

  async function handleReactivate(id: string) {
    const res = await fetch("/api/admin/reactivate-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    if (res.ok) {
      setProfiles(profiles.map((p) =>
        p.id === id ? { ...p, is_active: true } : p
      ));
      setToast({ message: "Member reactivated", type: "success" });
    } else {
      const data = await res.json();
      setToast({ message: data.error || "Failed to reactivate member", type: "error" });
    }
  }

  async function handleReview(userId: string, decision: "approve" | "reject", role: UserRole = "member") {
    setReviewingId(userId);
    const res = await fetch("/api/admin/review-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, decision, role }),
    });
    setReviewingId(null);

    if (res.ok) {
      setProfiles(profiles.map((p) =>
        p.id === userId
          ? {
              ...p,
              approval_status: decision === "approve" ? ("approved" as const) : ("rejected" as const),
              user_role: decision === "approve" ? role : p.user_role,
            }
          : p
      ));
      setToast({
        message: decision === "approve" ? "Member approved" : "Registration rejected",
        type: "success",
      });
    } else {
      const data = await res.json();
      setToast({ message: data.error || "Failed to review registration", type: "error" });
    }
  }

  async function handleUpdateMember() {
    if (!editMember) return;
    const num = editMember.memberNumber.trim() ? parseInt(editMember.memberNumber, 10) : null;
    if (editMember.memberNumber.trim() && (num === null || isNaN(num) || num < 1)) {
      setToast({ message: "Member number must be a positive integer", type: "error" });
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ member_number: num, badges: editMember.badges })
      .eq("id", editMember.profile.id);

    if (error) {
      setToast({ message: error.message || "Failed to update member", type: "error" });
      return;
    }

    setProfiles(profiles.map((p) =>
      p.id === editMember.profile.id ? { ...p, member_number: num, badges: editMember.badges } : p
    ));
    setToast({ message: "Member updated", type: "success" });
    setEditMember(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage community members and their roles
          </p>
        </div>
        {userRole === "super_admin" && (
          <Button asChild className="cursor-pointer">
            <a href="/dashboard/invites">
              <Mail className="w-4 h-4 mr-2" /> Generate Invite
            </a>
          </Button>
        )}
      </div>

      {userRole === "super_admin" && awaitingApproval.length > 0 && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/[0.03]">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold">
              Pending approval
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs">
                {awaitingApproval.length}
              </span>
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {awaitingApproval.map((profile) => (
              <div
                key={profile.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">
                    {profile.nickname || profile.real_name || "New registration"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Registered{" "}
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "recently"}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="cursor-pointer"
                    disabled={reviewingId === profile.id}
                    onClick={() => handleReview(profile.id, "approve", "member")}
                  >
                    <UserCheck className="w-3 h-3 mr-1.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                    disabled={reviewingId === profile.id}
                    onClick={() => handleReview(profile.id, "approve", "admin")}
                  >
                    <Shield className="w-3 h-3 mr-1.5" /> As admin
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer text-destructive hover:text-destructive"
                    disabled={reviewingId === profile.id}
                    onClick={() => handleReview(profile.id, "reject")}
                  >
                    <UserX className="w-3 h-3 mr-1.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 cursor-text"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "onboarded", "onboarding", "rejected", "deactivated"] as const).map((status) => (
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
      </div>

      {filteredProfiles.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {profiles.length === 0 ? "No members yet." : "No members match your filters."}
        </p>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Badges</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">System Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {profile.member_number != null ? `#${String(profile.member_number).padStart(3, "0")}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5 flex-shrink-0">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {(profile.nickname || profile.real_name || "?").charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-white font-medium">{profile.nickname || profile.real_name || "—"}</span>
                          {profile.real_name && profile.nickname && (
                            <p className="text-xs text-muted-foreground">{profile.real_name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(profile.badges || []).map((b) => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs"
                          >
                            {b}
                          </span>
                        ))}
                        {(profile.badges || []).length === 0 && (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", roleColors[profile.user_role])}>
                        {profile.user_role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {profile.is_active === false ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs">
                          Deactivated
                        </span>
                      ) : profile.approval_status === "rejected" ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs">
                          Rejected
                        </span>
                      ) : profile.onboarding_completed ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs">
                          Onboarding
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#080B0E] border-white/10 text-white/60 [&_svg]:text-white/60">
                          <DropdownMenuItem
                            onClick={() => setViewProfile(profile)}
                            className="cursor-pointer text-white/60 focus:bg-[#171717] focus:text-white/60"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </DropdownMenuItem>
                          {(userRole === "super_admin" || userRole === "admin") && (
                            <DropdownMenuItem
                              onClick={() => setEditMember({
                                profile,
                                memberNumber: profile.member_number != null ? String(profile.member_number) : "",
                                badges: profile.badges || [],
                              })}
                              className="cursor-pointer text-white/60 focus:bg-[#171717] focus:text-white/60"
                            >
                              <Pencil className="w-4 h-4" /> Edit Member
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setRoleChangeTarget({ id: profile.id, nickname: profile.nickname || profile.real_name || "Member", currentRole: profile.user_role });
                              setNewRole(profile.user_role);
                            }}
                            className="cursor-pointer text-white/60 focus:bg-[#171717] focus:text-white/60"
                          >
                            <Shield className="w-4 h-4" /> Change Role
                          </DropdownMenuItem>
                          {userRole === "super_admin" &&
                            (profile.is_active === false ? (
                              <DropdownMenuItem
                                onClick={() => handleReactivate(profile.id)}
                                className="cursor-pointer text-white/60 focus:bg-[#171717] focus:text-white/60 [&_svg]:text-green-500"
                              >
                                <UserCheck className="w-4 h-4" /> Reactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => setDeactivateConfirm({ id: profile.id, nickname: profile.nickname || profile.real_name || "Member" })}
                                className="cursor-pointer text-white/60 focus:bg-[#171717] focus:text-white/60 [&_svg]:text-red-500"
                              >
                                <UserX className="w-4 h-4" /> Deactivate
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* View Profile Dialog */}
      <Dialog open={!!viewProfile} onOpenChange={(open) => !open && setViewProfile(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#080B0E] border-border/50 text-foreground">
          <DialogHeader>
            <DialogTitle>{viewProfile?.nickname || viewProfile?.real_name || "Member"}</DialogTitle>
          </DialogHeader>
          {viewProfile && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5 shrink-0">
                  {viewProfile.avatar_url ? (
                    <img src={viewProfile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {(viewProfile.nickname || viewProfile.real_name || "?").charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">{viewProfile.nickname}</p>
                  <p className="text-muted-foreground">{viewProfile.real_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {viewProfile.member_number != null && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white">
                        #{String(viewProfile.member_number).padStart(3, "0")}
                      </span>
                    )}
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", roleColors[viewProfile.user_role])}>
                      {viewProfile.user_role.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {viewProfile.bio && (
                <div>
                  <p className="text-muted-foreground mb-1">Bio</p>
                  <p className="text-white">{viewProfile.bio}</p>
                </div>
              )}

              {(viewProfile.badges || []).length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Badges</p>
                  <div className="flex flex-wrap gap-1">
                    {viewProfile.badges!.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(viewProfile.companies || []).length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Companies</p>
                  <div className="flex flex-wrap gap-1">
                    {viewProfile.companies!.map((c) => (
                      <span key={c.id} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white">{c.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {viewProfile.linkedin_url && (
                  <a href={viewProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-1.5 text-xs hover:underline">
                    <ExternalLink className="w-3 h-3" /> LinkedIn
                  </a>
                )}
                {viewProfile.telegram_url && (
                  <a href={viewProfile.telegram_url} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-1.5 text-xs hover:underline">
                    <ExternalLink className="w-3 h-3" /> Telegram
                  </a>
                )}
                {viewProfile.website_url && (
                  <a href={viewProfile.website_url} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-1.5 text-xs hover:underline">
                    <ExternalLink className="w-3 h-3" /> Portfolio
                  </a>
                )}
                {viewProfile.twitter_url && (
                  <a href={viewProfile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-1.5 text-xs hover:underline">
                    <ExternalLink className="w-3 h-3" /> Twitter
                  </a>
                )}
                {viewProfile.github_url && (
                  <a href={viewProfile.github_url} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-1.5 text-xs hover:underline">
                    <ExternalLink className="w-3 h-3" /> GitHub
                  </a>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProfile(null)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={!!roleChangeTarget} onOpenChange={(open) => !open && setRoleChangeTarget(null)}>
        <DialogContent className="max-w-md bg-[#080B0E] border-border/50 text-foreground [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Change Role for {roleChangeTarget?.nickname}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>New Role</Label>
            <div className="flex flex-col gap-2">
              {(["member", "admin", "super_admin"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setNewRole(role)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border text-left",
                    newRole === role
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-[#171717] text-muted-foreground border-border/50 hover:text-white"
                  )}
                >
                  <Shield className="w-4 h-4" />
                  <span className="capitalize">{role.replace("_", " ")}</span>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleChangeTarget(null)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleRoleChange} className="cursor-pointer">Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member (member_number + badges) */}
      <Dialog open={!!editMember} onOpenChange={(open) => !open && setEditMember(null)}>
        <DialogContent className="max-w-md bg-[#080B0E] border-border/50 text-foreground [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Edit Member: {editMember?.profile.nickname || editMember?.profile.real_name || "Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Member Number</Label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 1 for #001"
                value={editMember?.memberNumber ?? ""}
                onChange={(e) => setEditMember(editMember ? { ...editMember, memberNumber: e.target.value } : null)}
                className="bg-[#171717] border-border/50 cursor-text"
              />
              <p className="text-xs text-muted-foreground">Leave empty to remove. Displayed as #001, #002, etc.</p>
            </div>
            <div className="space-y-2">
              <Label>Badges</Label>
              <div className="flex flex-wrap gap-2">
                {MEMBER_BADGES.map((badge) => {
                  const isSelected = (editMember?.badges ?? []).includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => {
                        if (!editMember) return;
                        const next = isSelected
                          ? editMember.badges.filter((b) => b !== badge)
                          : [...editMember.badges, badge];
                        setEditMember({ ...editMember, badges: next });
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border",
                        isSelected
                          ? "bg-amber-500/20 text-amber-500 border-amber-500/10"
                          : "bg-[#171717] text-muted-foreground border-border/50 hover:text-white hover:border-white/20"
                      )}
                    >
                      <Award className="w-4 h-4" />
                      {badge}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMember(null)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} className="cursor-pointer">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation */}
      <Dialog open={!!deactivateConfirm} onOpenChange={(open) => !open && setDeactivateConfirm(null)}>
        <DialogContent className="max-w-md bg-[#080B0E] border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle>Deactivate {deactivateConfirm?.nickname}?</DialogTitle>
            <p className="text-sm text-muted-foreground">
              The member will be deactivated and cannot log in. Their profile will be hidden from the public members list. You can reactivate them later.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateConfirm(null)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleDeactivate} className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && (
        <div className={cn("fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg border border-white/10 bg-[#080B0E] px-4 py-3 shadow-lg transition-all duration-300", toastExiting ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100")}>
          <p className={cn("text-sm font-medium", toast.type === "error" ? "text-destructive" : "text-foreground")}>{toast.message}</p>
        </div>
      )}
    </div>
  );
}
