"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UnicornBackground } from "@/components/ui/UnicornBackground";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function validateToken() {
    const res = await fetch(`/api/invites/${token}/validate`);
    const data = await res.json();

    if (!res.ok || !data.valid) {
      setStatus("invalid");
      setErrorMessage(data.reason || "Invalid invite link");
      return;
    }

    if (data.email) {
      setInviteEmail(data.email);
      setEmail(data.email);
    }
    setStatus("valid");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch(`/api/invites/${token}/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || "Registration failed");
      setIsSubmitting(false);
      return;
    }

    const { error: loginErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginErr) {
      setFormError("Account created but login failed. Please go to /dashboard and log in.");
      setIsSubmitting(false);
      return;
    }

    setStatus("success");
    setTimeout(() => router.push("/onboarding"), 1500);
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center px-6 relative">
      <UnicornBackground />
      {showForm && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Image
            src="/superteam.svg"
            alt="Superteam Malaysia"
            width={207}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        {status === "loading" && (
          <Card>
            <CardContent className="py-12 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Validating invite...</p>
            </CardContent>
          </Card>
        )}

        {status === "invalid" && (
          <Card>
            <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <p className="text-base font-semibold text-white">{errorMessage}</p>
              <p className="text-sm text-muted-foreground">
                Please contact a Superteam Malaysia admin for a new invite.
              </p>
            </CardContent>
          </Card>
        )}

        {status === "success" && (
          <Card>
            <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <p className="text-base font-semibold text-white">Account created!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to complete your profile...
              </p>
            </CardContent>
          </Card>
        )}

        {status === "valid" && (
          <Card>
            <CardHeader>
              <CardTitle>Join Superteam Malaysia</CardTitle>
              <CardDescription>
                Create your account to join the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!inviteEmail}
                    required
                    className="cursor-text"
                  />
                  {inviteEmail && (
                    <p className="text-xs text-muted-foreground">
                      This invite is linked to this email address.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="cursor-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="cursor-text"
                  />
                </div>
                {formError && (
                  <p className="text-sm text-destructive">{formError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </motion.div>
      )}
    </div>
  );
}
