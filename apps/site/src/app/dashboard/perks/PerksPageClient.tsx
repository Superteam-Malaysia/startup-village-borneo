"use client";

import { Gift, ExternalLink, Package, Sparkles, Users } from "lucide-react";
import type { Perk } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface PerksPageClientProps {
  perks: Perk[];
}

export function PerksPageClient({ perks }: PerksPageClientProps) {
  return (
    <div>
      {/* Header - ETHGlobal style */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Member Pack</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Exclusive perks for Superteam Malaysia members — event tickets, partner benefits, and more
        </p>
      </div>

      {/* What is a Pack? - ETHGlobal-style 3-column explainer */}
      <section className="rounded-xl border border-border/50 bg-card/30 p-8 md:p-10">
        <h2 className="text-xl font-semibold mb-8">What is a Pack?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Built for you</h3>
            <p className="text-sm text-muted-foreground">
              Packs exist to guide you on your Web3 journey. Whether you&apos;re building your first
              dapp, attending your first Solana event, or an experienced builder, there&apos;s a perk
              for you.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Curated by us</h3>
            <p className="text-sm text-muted-foreground">
              Each perk is curated by the Superteam Malaysia team — guaranteed access to community
              events, credits to services you use, and special benefits only available to members.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold">Extendable by all</h3>
            <p className="text-sm text-muted-foreground">
              Our ecosystem partners can offer Pack holders additional value. Interested in
              contributing? Reach out to the team.
            </p>
          </div>
        </div>
      </section>

      {/* What's in the Pack? */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-6">What&apos;s in the Pack?</h2>

        {perks.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/50 p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white mb-1">Coming Soon</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                We&apos;re working on exclusive perks for community members including event tickets,
                merchandise, and partner benefits. Stay tuned!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
              {perks.map((perk) => (
                <PerkCard key={perk.id} perk={perk} />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              More perks coming soon…
            </p>
          </>
        )}
      </section>

      
    </div>
  );
}

function PerkCard({ perk }: { perk: Perk }) {
  const redeemLabel = perk.redeem_label || "Redeem";
  const hasRedeemUrl = !!perk.redeem_url?.trim();

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden hover:border-primary/30 transition-colors group relative">
      <div className="p-5 flex flex-col h-full">
        {/* Top row: Icon + Value badge (top right) */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="w-12 h-12 rounded-md flex items-center justify-center overflow-hidden shrink-0">
            {perk.icon_url ? (
              <img
                src={perk.icon_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Gift className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {perk.value_badge && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                {perk.value_badge}
              </span>
            )}
            {perk.is_limited && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500">
                Limited
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white mb-1">{perk.title}</h3>

        {/* Description */}
        {perk.description && (
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
            {perk.description}
          </p>
        )}

        {/* Redeem button */}
        {hasRedeemUrl ? (
          <Button
            asChild
            variant="default"
            size="sm"
            className="w-full cursor-pointer group-hover:bg-primary/90"
          >
            <a
              href={perk.redeem_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              {redeemLabel}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="w-full cursor-not-allowed opacity-60"
          >
            {redeemLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
