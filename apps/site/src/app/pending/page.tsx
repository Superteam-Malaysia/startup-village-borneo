"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rejected, setRejected] = useState(searchParams.get("rejected") === "1");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("approval_status, onboarding_completed")
        .eq("id", user.id)
        .single();

      if (cancelled) return;

      // Approved while sitting on this screen -> move them along.
      if (profile?.approval_status === "approved") {
        router.replace(profile.onboarding_completed ? "/dashboard" : "/onboarding");
        return;
      }

      setRejected(profile?.approval_status === "rejected");
      setChecking(false);
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <AuthShell
      title={rejected ? "Application not approved" : "Awaiting approval"}
      description={
        rejected
          ? "Your request to join wasn't approved. Reach out to the team if you think this is a mistake."
          : "Your account is created. A super admin needs to approve it before you can access the dashboard."
      }
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
          {rejected ? (
            <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          )}
          <p className="text-sm text-muted-foreground">
            {rejected
              ? "You can still browse the public site."
              : "This usually doesn't take long. You'll get straight in once approved — just sign in again."}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => router.refresh()}
            disabled={checking}
          >
            Check again
          </Button>
          <Button variant="ghost" className="flex-1 cursor-pointer" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={<AuthShell title="Awaiting approval">{null}</AuthShell>}>
      <PendingContent />
    </Suspense>
  );
}
