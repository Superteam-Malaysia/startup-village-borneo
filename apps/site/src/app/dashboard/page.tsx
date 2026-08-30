"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, FolderOpen, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

interface DashboardChartStats {
  memberGrowth: { month: string; count: number; cumulative: number }[];
  totalMembers: number;
  membersThisMonth: number;
  eventsThisMonth: number;
  eventsOverall: number;
  totalPartners: number;
  eventsByMonth: {
    month: string;
    monthLabel: string;
    virtual: number;
    irl: number;
  }[];
  gdpByMonth: { month: string; monthLabel: string; gdp: number }[];
  totalAttendees: number;
  gdpBroughtMalaysia: { overall: number; thisMonth: number };
  grantsAwarded: { overall: number; thisMonth: number };
  bountiesRewarded: number;
  bountiesSource: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [userRole, setUserRole] = useState<UserRole>("member");
  const [chartStats, setChartStats] = useState<DashboardChartStats | null>(
    null,
  );
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartRange, setChartRange] = useState<"6m" | "1y" | "all">("6m");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (userRole === "super_admin" || userRole === "admin") {
      setChartError(null);
      fetch("/api/dashboard-stats")
        .then((r) => {
          if (!r.ok)
            throw new Error(
              r.status === 401
                ? "Unauthorized"
                : r.status === 403
                  ? "Forbidden"
                  : "Failed to load",
            );
          return r.json();
        })
        .then(setChartStats)
        .catch((err) => {
          setChartStats(null);
          setChartError(
            err instanceof Error ? err.message : "Failed to load analytics",
          );
        });
    }
  }, [userRole]);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const role: UserRole =
      (user?.app_metadata?.user_role as UserRole) || "member";
    setUserRole(role);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) setProfile(profileData as Profile);

    const { count } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id);

    setProjectCount(count ?? 0);
  }

  const isAdmin = userRole === "super_admin" || userRole === "admin";

  if (isAdmin) {
    return (
      <div>
        <div className="flex items-end justify-between mb-8">
          <div className="">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of the Superteam Malaysia Analytics & Impact
            </p>
          </div>
          <div className="flex items-center justify-between">
            {chartStats && (
              <select
                value={chartRange}
                onChange={(e) =>
                  setChartRange(e.target.value as "6m" | "1y" | "all")
                }
                className="h-8 rounded-md border border-input bg-card px-3 py-1 text-sm cursor-pointer text-foreground"
              >
                <option value="6m">6 months</option>
                <option value="1y">1 year</option>
                <option value="all">All</option>
              </select>
            )}
          </div>
        </div>
        <div className="mb-8">
          {chartError && (
            <p className="text-sm text-destructive mb-4">
              {chartError}. Run the migration if you haven&apos;t:{" "}
              <code className="text-xs bg-muted px-1 rounded">
                npx supabase db push
              </code>
            </p>
          )}
          {chartStats ? (
            <DashboardCharts stats={chartStats} range={chartRange} />
          ) : !chartError ? (
            <div className="flex items-center justify-center py-12 rounded-lg border bg-card">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {profile.nickname || "Member"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s your dashboard overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/profile">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <User className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">Edit →</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Profile</p>
              <p className="text-sm text-muted-foreground mt-1">
                {profile.bio ? "Complete" : "Add a bio"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/projects">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <FolderOpen className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Manage →</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{projectCount}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {projectCount === 1 ? "Project" : "Projects"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/perks">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">Perks</p>
              <p className="text-sm text-muted-foreground mt-1">
                Claim member perks
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Nickname</p>
              <p className="text-white font-medium">
                {profile.nickname || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Real Name</p>
              <p className="text-white font-medium">
                {profile.real_name || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Role</p>
              <p className="text-white font-medium capitalize">
                {profile.user_role.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Member Since</p>
              <p className="text-white font-medium">
                {new Date(profile.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild className="cursor-pointer">
              <Link href="/dashboard/profile">
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
