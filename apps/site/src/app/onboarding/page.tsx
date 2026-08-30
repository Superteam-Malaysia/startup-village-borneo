"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { LookupTag, SubskillTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import { UnicornBackground } from "@/components/ui/UnicornBackground";
import { WelcomeMessage } from "@/components/onboarding/WelcomeMessage";
import { cn } from "@/lib/utils";

const STEPS = ["Basic Info", "Professional", "Skills", "Social Links", "About You"];

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form state
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

  // Multi-select state
  const [allRoles, setAllRoles] = useState<MultiSelectOption[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<MultiSelectOption[]>([]);
  const [allCompanies, setAllCompanies] = useState<MultiSelectOption[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<MultiSelectOption[]>([]);
  const [allSkills, setAllSkills] = useState<MultiSelectOption[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<MultiSelectOption[]>([]);
  const [allSubskills, setAllSubskills] = useState<(MultiSelectOption & { skill_id?: string })[]>([]);
  const [selectedSubskills, setSelectedSubskills] = useState<MultiSelectOption[]>([]);

  useEffect(() => {
    checkAuth();
    loadLookupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/dashboard");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profile?.onboarding_completed) {
      router.push("/dashboard");
      return;
    }

    setUserId(user.id);
    setIsLoading(false);
  }

  async function loadLookupData() {
    const [rolesRes, companiesRes, skillsRes, subskillsRes] = await Promise.all([
      supabase.from("roles").select("id, name").order("name"),
      supabase.from("companies").select("id, name").order("name"),
      supabase.from("skills").select("id, name").order("name"),
      supabase.from("subskills").select("id, name, skill_id").order("name"),
    ]);
    if (rolesRes.data) setAllRoles(rolesRes.data);
    if (companiesRes.data) setAllCompanies(companiesRes.data);
    if (skillsRes.data) setAllSkills(skillsRes.data);
    if (subskillsRes.data) setAllSubskills(subskillsRes.data);
  }

  async function createTag(table: string, name: string): Promise<MultiSelectOption | null> {
    const { data, error } = await supabase
      .from(table)
      .insert({ name })
      .select("id, name")
      .single();
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

  async function handleComplete() {
    if (!userId) return;
    if (!twitterUrl.trim()) {
      setValidationError("Twitter / X is required");
      return;
    }
    setValidationError(null);
    setIsSaving(true);

    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        nickname,
        real_name: realName,
        avatar_url: avatarUrl,
        bio,
        twitter_url: twitterUrl,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        website_url: websiteUrl,
        telegram_url: telegramUrl,
        achievements,
        talk_to_me_about: talkToMeAbout,
        onboarding_completed: true,
      })
      .eq("id", userId);

    if (profileErr) {
      console.error("Failed to update profile:", profileErr.message);
      setIsSaving(false);
      return;
    }

    // Save junction table relations
    await Promise.all([
      saveJunction("profile_roles", "role_id", selectedRoles),
      saveJunction("profile_companies", "company_id", selectedCompanies),
      saveJunction("profile_skills", "skill_id", selectedSkills),
      saveJunction("profile_subskills", "subskill_id", selectedSubskills),
    ]);

    setIsSaving(false);
    setShowWelcome(true);
  }

  async function saveJunction(table: string, foreignKey: string, items: MultiSelectOption[]) {
    if (!userId || items.length === 0) return;
    // Clear existing
    await supabase.from(table).delete().eq("profile_id", userId);
    // Insert new
    const rows = items.map((item) => ({
      profile_id: userId,
      [foreignKey]: item.id,
    }));
    await supabase.from(table).insert(rows);
  }

  function validateStep(stepIndex: number): boolean {
    setValidationError(null);
    if (stepIndex === 0) {
      if (!nickname.trim()) {
        setValidationError("Nickname is required");
        return false;
      }
      if (!realName.trim()) {
        setValidationError("Real name is required");
        return false;
      }
      if (!avatarUrl) {
        setValidationError("Profile picture is required");
        return false;
      }
    } else if (stepIndex === 1) {
      if (selectedRoles.length === 0) {
        setValidationError("Please select at least one role");
        return false;
      }
      if (selectedCompanies.length === 0) {
        setValidationError("Please select at least one company");
        return false;
      }
      if (!bio.trim()) {
        setValidationError("Bio is required");
        return false;
      }
    } else if (stepIndex === 2) {
      if (selectedSkills.length === 0) {
        setValidationError("Please select at least one skill");
        return false;
      }
    } else if (stepIndex === 3) {
      if (!twitterUrl.trim()) {
        setValidationError("Twitter / X is required");
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    setValidationError(null);
    setStep(step - 1);
  }

  if (isLoading) {
    return (
      <div className="dark min-h-screen flex items-center justify-center relative" style={{ backgroundColor: "#080B0E" }}>
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeMessage nickname={nickname} />;
  }

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <UnicornBackground />
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Image src="/superteam.svg" alt="Superteam Malaysia" width={207} height={32} className="h-8 w-auto" />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8 justify-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                  i < step
                    ? "bg-green-500/20 text-green-500"
                    : i === step
                      ? "bg-primary/20 text-primary"
                      : "bg-white/5 text-muted-foreground"
                )}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("w-6 h-px", i < step ? "bg-green-500/30" : "bg-white/10")} />
              )}
            </div>
          ))}
        </div>

        <Card className="bg-[#080B0E] border-border">
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
            <CardDescription>
              {step === 0 && "Tell us who you are"}
              {step === 1 && "What do you do?"}
              {step === 2 && "What are your technical skills?"}
              {step === 3 && "Where can people find you?"}
              {step === 4 && "Share more about yourself"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nickname</Label>
                  <Input
                    placeholder="How should we call you?"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-[#171717] border-border/50 cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Real Name</Label>
                  <Input
                    placeholder="Your full name"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    className="bg-[#171717] border-border/50 cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#171717] overflow-hidden shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Upload className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white"
                    >
                      {isUploading ? "Uploading..." : "Upload photo"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Professional */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <MultiSelect
                    options={allRoles}
                    selected={selectedRoles}
                    onChange={setSelectedRoles}
                    onCreateNew={(name) => createTag("roles", name)}
                    placeholder="Search or create roles..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Companies</Label>
                  <MultiSelect
                    options={allCompanies}
                    selected={selectedCompanies}
                    onChange={setSelectedCompanies}
                    onCreateNew={(name) => createTag("companies", name)}
                    placeholder="Search or create companies..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <MultiSelect
                    options={allSkills}
                    selected={selectedSkills}
                    onChange={setSelectedSkills}
                    onCreateNew={(name) => createTag("skills", name)}
                    placeholder="Search or create skills..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subskills</Label>
                  <MultiSelect
                    options={allSubskills}
                    selected={selectedSubskills}
                    onChange={setSelectedSubskills}
                    onCreateNew={(name) => createTag("subskills", name)}
                    placeholder="Search or create subskills..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Social Links */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Twitter / X</Label>
                  <Input placeholder="https://x.com/..." value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
                </div>
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input placeholder="https://github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
                </div>
                <div className="space-y-2">
                  <Label>Personal Website</Label>
                  <Input placeholder="https://..." value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
                </div>
                <div className="space-y-2">
                  <Label>Telegram</Label>
                  <Input placeholder="https://t.me/..." value={telegramUrl} onChange={(e) => setTelegramUrl(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
                </div>
              </div>
            )}

            {/* Step 4: About */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Achievements in Web3</Label>
                  <textarea
                    placeholder="Hackathon wins, grants, notable projects..."
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    rows={4}
                    className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Talk to me about</Label>
                  <textarea
                    placeholder="Topics you're excited to discuss..."
                    value={talkToMeAbout}
                    onChange={(e) => setTalkToMeAbout(e.target.value)}
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text"
                  />
                </div>
              </div>
            )}

            {/* Validation error */}
            {validationError && (
              <p className="mt-4 text-sm text-red-500">{validationError}</p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
                className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={handleNext} className="cursor-pointer">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isSaving} className="cursor-pointer">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      Complete <Check className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
