import { ActionCard, CtaButton, SectionArticle, SectionIntro } from "@/components/ui";
import { RACE_TASKS } from "@/data/race-tasks";
import {
  WALLET_ONBOARDING,
  WALLET_PRODUCTS,
  WALLET_RULES,
  WALLET_STEPS,
} from "@/data/wallet";
import { pageMetadata } from "@/lib/metadata";

const walletTask = RACE_TASKS.find((t) => t.category === "wallet");

export const metadata = pageMetadata({
  title: "Wallet onboarding",
  description:
    "Teach real users to use Solana wallets, Jupiter, and RedotPay — Amazing Race task #15 and SVB's Solana-first ethos.",
  path: "/wallet",
});

export default function WalletPage() {
  return (
    <main className="max-w-[90rem] mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16 md:gap-24">
      <header>
        <p className="text-eyebrow mb-6">Task #15 · Solana-first</p>
        <h1 className="hero-display max-w-4xl">
          <span className="hero-display-accent">Wallet</span>
          onboarding
        </h1>
        <p className="mt-8 max-w-2xl text-[var(--color-wisp)]/75 leading-relaxed text-lg">
          {WALLET_ONBOARDING.summary}
        </p>
      </header>

      <div className="companion-banner" role="status">
        <span className="companion-banner__tag">Coming soon</span>
        Wallet connect and on-chain proofs ship with the companion dApp at the event.
      </div>

      <SectionArticle className="bg-[var(--color-byte)]/5 border border-[color:var(--color-transparent-wisp-10)] p-6 md:p-10">
        <SectionIntro eyebrow="Ethos" title="Teach — don't sell" />
        <p className="mt-6 max-w-2xl text-[var(--color-wisp)]/75 leading-relaxed">
          {WALLET_ONBOARDING.ethos}
        </p>
        {walletTask && (
          <p className="mt-4 font-[family-name:var(--font-mono)] text-sm text-[var(--color-byte)]">
            {walletTask.pointsBase} pts · highest-value single Amazing Race station
          </p>
        )}
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="Products" title="What to teach" />
        <ul className="mt-8 grid gap-6 md:grid-cols-3 list-none">
          {WALLET_PRODUCTS.map((product) => (
            <li
              key={product.name}
              className="border border-[color:var(--color-transparent-wisp-10)] p-5 flex flex-col gap-3"
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg">{product.name}</h3>
              <p className="text-sm text-[var(--color-wisp)]/70">{product.detail}</p>
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="How to" title="Four steps" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {WALLET_STEPS.map((item, i) => (
            <li
              key={item.step}
              className="grid gap-2 md:grid-cols-[2rem_10rem_1fr] border-b border-[color:var(--color-transparent-wisp-10)] pb-4"
            >
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-byte)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-[family-name:var(--font-display)]">{item.step}</span>
              <span className="text-sm text-[var(--color-wisp)]/70">{item.detail}</span>
            </li>
          ))}
        </ul>
      </SectionArticle>

      <SectionArticle>
        <SectionIntro eyebrow="Rules" title="Non-negotiables" />
        <ul className="mt-8 flex flex-col gap-4 list-none">
          {WALLET_RULES.map((rule) => (
            <li
              key={rule}
              className="border-l-2 border-[var(--color-byte)] pl-4 text-[var(--color-wisp)]/75 leading-relaxed"
            >
              {rule}
            </li>
          ))}
        </ul>
      </SectionArticle>

      <div className="grid gap-6 md:grid-cols-2">
        <ActionCard
          tone="azure"
          title="Amazing Race"
          description="Full task catalog including wallet station #15."
          cta={{ label: "Race tasks", href: "/amazing-race" }}
        />
        <ActionCard
          tone="mint"
          title="Submissions"
          description="How to log your onboarding in a team Twitter thread."
          cta={{ label: "Submission rules", href: "/submissions" }}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <CtaButton variant="byte" size="lg" disabled showArrow={false}>
          Connect wallet
        </CtaButton>
        <CtaButton href="/code-of-conduct" variant="ghost-wisp" size="lg" showArrow={false}>
          Code of conduct
        </CtaButton>
      </div>
    </main>
  );
}
