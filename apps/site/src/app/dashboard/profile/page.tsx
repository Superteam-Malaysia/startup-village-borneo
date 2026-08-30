"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Save } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { LookupTag, SubskillTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import { ChangePasswordCard } from "@/components/dashboard/ChangePasswordCard";
import { BadgePicker } from "@/components/dashboard/BadgePicker";
import { cn } from "@/lib/utils";

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [achievements, setAchievements] = useState("");
  const [talkToMeAbout, setTalkToMeAbout] = useState("");
  const [badges, setBadges] = useState<string[]>([]);

  const [allRoles, setAllRoles] = useState<MultiSelectOption[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<MultiSelectOption[]>([]);
  const [allCompanies, setAllCompanies] = useState<MultiSelectOption[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<MultiSelectOption[]>([]);
  const [allSkills, setAllSkills] = useState<MultiSelectOption[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<MultiSelectOption[]>([]);
  const [allSubskills, setAllSubskills] = useState<(MultiSelectOption & { skill_id?: string })[]>([]);
  const [selectedSubskills, setSelectedSubskills] = useState<MultiSelectOption[]>([]);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRef = useRef<{
    nickname: string; realName: string; avatarUrl: string; bio: string;
    twitterUrl: string; githubUrl: string; linkedinUrl: string; websiteUrl: string; telegramUrl: string;
    achievements: string; talkToMeAbout: string; badges: string[];
    roleIds: string[]; companyIds: string[]; skillIds: string[]; subskillIds: string[];
  } | null>(null);

  function selectedIdsEqual(selected: MultiSelectOption[], initialIds: string[]) {
    if (selected.length !== initialIds.length) return false;
    const set = new Set(initialIds);
    return selected.every((x) => set.has(x.id));
  }

  // Badges are plain strings, so they need their own order-insensitive compare.
  function stringsEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    const set = new Set(b);
    return a.every((x) => set.has(x));
  }

  const hasUnsavedChanges = (() => {
    const init = initialRef.current;
    if (!init || isLoading) return false;
    return (
      nickname !== init.nickname || realName !== init.realName || avatarUrl !== init.avatarUrl ||
      bio !== init.bio || twitterUrl !== init.twitterUrl || githubUrl !== init.githubUrl ||
      linkedinUrl !== init.linkedinUrl || websiteUrl !== init.websiteUrl || telegramUrl !== init.telegramUrl ||
      achievements !== init.achievements || talkToMeAbout !== init.talkToMeAbout ||
      !stringsEqual(badges, init.badges) ||
      !selectedIdsEqual(selectedRoles, init.roleIds) ||
      !selectedIdsEqual(selectedCompanies, init.companyIds) ||
      !selectedIdsEqual(selectedSkills, init.skillIds) ||
      !selectedIdsEqual(selectedSubskills, init.subskillIds)
    );
  })();

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

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]');
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("/") && href !== "/dashboard/profile") {
          e.preventDefault();
          e.stopImmediatePropagation();
          setPendingHref(href);
          setLeaveDialogOpen(true);
        }
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [hasUnsavedChanges]);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/dashboard"); return; }
    setUserId(user.id);

    const [profileRes, rolesRes, companiesRes, skillsRes, subskillsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("roles").select("id, name").order("name"),
      supabase.from("companies").select("id, name").order("name"),
      supabase.from("skills").select("id, name").order("name"),
      supabase.from("subskills").select("id, name, skill_id").order("name"),
    ]);

    if (rolesRes.data) setAllRoles(rolesRes.data);
    if (companiesRes.data) setAllCompanies(companiesRes.data);
    if (skillsRes.data) setAllSkills(skillsRes.data);
    if (subskillsRes.data) setAllSubskills(subskillsRes.data);

    if (profileRes.data) {
      const p = profileRes.data;
      setNickname(p.nickname || "");
      setRealName(p.real_name || "");
      setAvatarUrl(p.avatar_url || "");
      setBio(p.bio || "");
      setTwitterUrl(p.twitter_url || "");
      setGithubUrl(p.github_url || "");
      setLinkedinUrl(p.linkedin_url || "");
      setWebsiteUrl(p.website_url || "");
      setTelegramUrl(p.telegram_url || "");
      setAchievements(p.achievements || "");
      setTalkToMeAbout(p.talk_to_me_about || "");
      setBadges(p.badges || []);
    }

    // Load junction data
    const [prRes, pcRes, psRes, pssRes] = await Promise.all([
      supabase.from("profile_roles").select("role_id, roles:role_id(id, name)").eq("profile_id", user.id),
      supabase.from("profile_companies").select("company_id, companies:company_id(id, name)").eq("profile_id", user.id),
      supabase.from("profile_skills").select("skill_id, skills:skill_id(id, name)").eq("profile_id", user.id),
      supabase.from("profile_subskills").select("subskill_id, subskills:subskill_id(id, name)").eq("profile_id", user.id),
    ]);

    const roles = prRes.data?.map((r: Record<string, unknown>) => r.roles as MultiSelectOption).filter(Boolean) ?? [];
    const companies = pcRes.data?.map((r: Record<string, unknown>) => r.companies as MultiSelectOption).filter(Boolean) ?? [];
    const skills = psRes.data?.map((r: Record<string, unknown>) => r.skills as MultiSelectOption).filter(Boolean) ?? [];
    const subskills = pssRes.data?.map((r: Record<string, unknown>) => r.subskills as MultiSelectOption).filter(Boolean) ?? [];

    if (prRes.data) setSelectedRoles(roles);
    if (pcRes.data) setSelectedCompanies(companies);
    if (psRes.data) setSelectedSkills(skills);
    if (pssRes.data) setSelectedSubskills(subskills);

    const p = profileRes.data ?? {};
    initialRef.current = {
      nickname: (p.nickname as string) || "",
      realName: (p.real_name as string) || "",
      avatarUrl: (p.avatar_url as string) || "",
      bio: (p.bio as string) || "",
      twitterUrl: (p.twitter_url as string) || "",
      githubUrl: (p.github_url as string) || "",
      linkedinUrl: (p.linkedin_url as string) || "",
      websiteUrl: (p.website_url as string) || "",
      telegramUrl: (p.telegram_url as string) || "",
      achievements: (p.achievements as string) || "",
      talkToMeAbout: (p.talk_to_me_about as string) || "",
      badges: (p.badges as string[]) || [],
      roleIds: roles.map((r) => r.id),
      companyIds: companies.map((c) => c.id),
      skillIds: skills.map((s) => s.id),
      subskillIds: subskills.map((s) => s.id),
    };

    setIsLoading(false);
  }

  async function createTag(table: string, name: string): Promise<MultiSelectOption | null> {
    const { data, error } = await supabase.from(table).insert({ name }).select("id, name").single();
    if (error || !data) return null;
    if (table === "roles") setAllRoles((prev) => [...prev, data]);
    else if (table === "companies") setAllCompanies((prev) => [...prev, data]);
    else if (table === "skills") setAllSkills((prev) => [...prev, data]);
    else if (table === "subskills") setAllSubskills((prev) => [...prev, data as SubskillTag]);
    return data;
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || !userId) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (!userId) return;
    setIsSaving(true);

    const { error } = await supabase.from("profiles").update({
      nickname, real_name: realName, avatar_url: avatarUrl, bio,
      twitter_url: twitterUrl, github_url: githubUrl, linkedin_url: linkedinUrl,
      website_url: websiteUrl, telegram_url: telegramUrl,
      achievements, talk_to_me_about: talkToMeAbout, badges,
    }).eq("id", userId);

    if (error) {
      setToast({ message: "Failed to save profile", type: "error" });
      setIsSaving(false);
      return;
    }

    await Promise.all([
      saveJunction("profile_roles", "role_id", selectedRoles),
      saveJunction("profile_companies", "company_id", selectedCompanies),
      saveJunction("profile_skills", "skill_id", selectedSkills),
      saveJunction("profile_subskills", "subskill_id", selectedSubskills),
    ]);

    setToast({ message: "Profile saved!", type: "success" });
    setIsSaving(false);
    initialRef.current = {
      nickname, realName, avatarUrl, bio,
      twitterUrl, githubUrl, linkedinUrl, websiteUrl, telegramUrl,
      achievements, talkToMeAbout, badges,
      roleIds: selectedRoles.map((r) => r.id),
      companyIds: selectedCompanies.map((c) => c.id),
      skillIds: selectedSkills.map((s) => s.id),
      subskillIds: selectedSubskills.map((s) => s.id),
    };
  }

  async function saveJunction(table: string, foreignKey: string, items: MultiSelectOption[]) {
    if (!userId) return;
    await supabase.from(table).delete().eq("profile_id", userId);
    if (items.length === 0) return;
    const rows = items.map((item) => ({ profile_id: userId, [foreignKey]: item.id }));
    await supabase.from(table).insert(rows);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your community profile</p>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="fixed bottom-6 right-6 z-50 cursor-pointer shadow-lg"
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>

      <div className="space-y-6">
        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
              <Label>Profile Picture</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#171717] overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Upload className="w-5 h-5" /></div>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
                  {isUploading ? "Uploading..." : "Upload photo"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label>Nickname</Label>
                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
              </div>
              <div className="space-y-2">
                <Label>Real Name</Label>
                <Input value={realName} onChange={(e) => setRealName(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Professional</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Roles</Label>
              <MultiSelect options={allRoles} selected={selectedRoles} onChange={setSelectedRoles} onCreateNew={(name) => createTag("roles", name)} placeholder="Search or create roles..." />
            </div>
            <div className="space-y-2">
              <Label>Companies</Label>
              <MultiSelect options={allCompanies} selected={selectedCompanies} onChange={setSelectedCompanies} onCreateNew={(name) => createTag("companies", name)} placeholder="Search or create companies..." />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Skills</Label>
              <MultiSelect options={allSkills} selected={selectedSkills} onChange={setSelectedSkills} onCreateNew={(name) => createTag("skills", name)} placeholder="Search or create skills..." />
            </div>
            <div className="space-y-2">
              <Label>Subskills</Label>
              <MultiSelect options={allSubskills} selected={selectedSubskills} onChange={setSelectedSubskills} onCreateNew={(name) => createTag("subskills", name)} placeholder="Search or create subskills..." />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Twitter / X</Label>
                <Input value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://x.com/..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
              <div className="space-y-2">
                <Label>Personal Website</Label>
                <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Telegram</Label>
              <Input value={telegramUrl} onChange={(e) => setTelegramUrl(e.target.value)} placeholder="https://t.me/..." className="bg-[#171717] border-border/50 cursor-text" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>About You</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <BadgePicker value={badges} onChange={setBadges} />
            <div className="space-y-2">
              <Label>Achievements in Web3</Label>
              <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} rows={4} placeholder="Hackathon wins, grants, notable projects..." className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Talk to me about</Label>
              <textarea value={talkToMeAbout} onChange={(e) => setTalkToMeAbout(e.target.value)} rows={3} placeholder="Topics you're excited to discuss..." className="flex min-h-[80px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text" />
            </div>
          </CardContent>
        </Card>

        <ChangePasswordCard
          onNotify={(message, type) => setToast({ message, type })}
        />
      </div>

      <Dialog open={leaveDialogOpen} onOpenChange={(open) => { setLeaveDialogOpen(open); if (!open) setPendingHref(null); }}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unsaved changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes may not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false} className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                if (pendingHref) router.push(pendingHref);
                setLeaveDialogOpen(false);
                setPendingHref(null);
              }}
              className="cursor-pointer mr-2"
            >
              Leave
            </Button>
            <Button
              onClick={async () => {
                await handleSave();
                setLeaveDialogOpen(false);
                if (pendingHref) router.push(pendingHref);
                setPendingHref(null);
              }}
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save changes"}
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
