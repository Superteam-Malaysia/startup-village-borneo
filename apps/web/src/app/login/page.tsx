import type { Metadata } from "next";
import { SectionArticle, SectionIntro } from "@/components/ui";
import { TelegramLoginButton } from "@/components/auth/TelegramLoginButton";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with Telegram using the account you registered for Startup Village Borneo.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_auth: "Telegram sign-in could not be verified. Try again.",
  not_registered:
    "That Telegram username is not on the guest list. Use the same @username you gave Luma.",
  missing_telegram:
    "Your Telegram account has no @username. Set one in Telegram settings, or contact the organizers.",
  bot_not_configured: "Telegram sign-in is not configured on the server yet.",
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
            lead="Sign in with Telegram — the same account you used when registering on Luma. No password or email link needed."
            accent="azure"
          />
          <div className="mt-10">
            {error ? (
              <p className="mb-4 text-sm text-[var(--color-byte)]">{error}</p>
            ) : null}
            <TelegramLoginButton />
          </div>
        </SectionArticle>
      </div>
    </main>
  );
}
