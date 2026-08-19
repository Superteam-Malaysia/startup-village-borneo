import type { Metadata } from "next";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with the email you used to register for Startup Village Borneo.",
};

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: "Sign-in link was incomplete. Request a new one.",
  invalid_token: "That sign-in link expired or was already used. Request a new one.",
  not_registered: "We could not find a registration for that account.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error ? ERROR_MESSAGES[params.error] ?? "Sign-in failed." : null;

  return (
    <main className="site-main site-main--stack">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-16 md:py-24">
        <SectionArticle>
          <SectionIntro
            title="Participant sign-in"
            lead="Use the same email address you registered with on Luma. We will email you a one-time link — no password needed."
            accent="azure"
          />
          <div className="mt-10">
            <LoginForm error={error} />
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
