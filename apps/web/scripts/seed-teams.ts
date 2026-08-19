#!/usr/bin/env tsx
/**
 * Seed hackathon teams from known registrations.
 * Usage: DATABASE_URL=... npm run db:seed-teams
 */
import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { closeDb, getDb } from "../src/lib/db";
import { participants, teamMembers, teams } from "../src/lib/db/schema";
import { slugifyTeamName } from "../src/lib/teams/slug";

type SeedMember = { email: string; role: "owner" | "editor" | "member" };

type SeedTeam = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  websiteUrl?: string;
  proofUrl?: string;
  members: SeedMember[];
};

const SEED_TEAMS: SeedTeam[] = [
  {
    slug: "imperial-perps",
    name: "Imperial Perps",
    tagline: "Perpetuals trading on Solana",
    description: "imperial perps",
    category: "DeFi",
    proofUrl: "https://x.com/OnchainAditi",
    members: [
      { email: "teo.melzianne@gmail.com", role: "owner" },
      { email: "gaditi723@gmail.com", role: "owner" },
    ],
  },
  {
    slug: "float-finance",
    name: "Float Finance",
    tagline: "Payroll financing for on-chain businesses",
    description:
      "Float is payroll financing for businesses the banking system can't see. We underwrite against verified on-chain revenue instead of bank statements.",
    category: "DeFi",
    proofUrl: "https://github.com/Samisha68",
    members: [{ email: "samishaofficial68@gmail.com", role: "owner" }],
  },
  {
    slug: "petrolprice",
    name: "PetrolPrice",
    tagline: "Energy markets, intuitive and beautiful",
    description:
      "PetrolPrice.xyz scalps energy markets and makes them intuitive and beautiful for users.",
    category: "Consumer",
    websiteUrl: "https://app.petrolprice.xyz/",
    proofUrl: "https://app.petrolprice.xyz/",
    members: [{ email: "st.aaronagai@gmail.com", role: "owner" }],
  },
  {
    slug: "nextrare",
    name: "NexRare",
    tagline: "Trading card marketplace bridging local to global liquidity",
    description:
      "A trading card marketplace that connects local liquidities to global market.",
    category: "Consumer",
    proofUrl: "https://apps.apple.com/my/app/nextrare/id6756167956",
    members: [
      { email: "lihotan.1998@gmail.com", role: "owner" },
      { email: "kc@chasm.net", role: "owner" },
    ],
  },
  {
    slug: "lp-agent",
    name: "LP Agent",
    tagline: "Liquidity management made simple",
    description:
      "LP Agent is a liquidity management platform that makes providing liquidity simple and profitable.",
    category: "DeFi",
    members: [
      { email: "toanbku@gmail.com", role: "owner" },
      { email: "leqdat18@gmail.com", role: "editor" },
      { email: "mihthanh27@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "fb-deals",
    name: "F&B Deals",
    tagline: "Discover niche food & beverage promotions",
    description:
      "F&B deals and promotions discovery — finding niche and amazing deals not usually seen by most people.",
    category: "Consumer",
    members: [
      { email: "chinooo.eth@gmail.com", role: "owner" },
      { email: "hi@pew.dev", role: "editor" },
      { email: "xchase_96@hotmail.com", role: "editor" },
    ],
  },
  {
    slug: "edventures",
    name: "Edventures",
    tagline: "Infrastructure for alternative education paths",
    description:
      "Infrastructure for parents and children choosing alternative education paths, or supplementing traditional schooling.",
    category: "Consumer",
    websiteUrl: "https://www.edventures.co",
    proofUrl: "https://www.edventures.co",
    members: [
      { email: "mark@sirachventures.com", role: "owner" },
      { email: "luma@mvn.xyz", role: "editor" },
    ],
  },
];

async function participantIdByEmail(db: ReturnType<typeof getDb>, email: string) {
  const normalized = email.trim().toLowerCase();
  const [row] = await db
    .select({ id: participants.id })
    .from(participants)
    .where(eq(participants.emailNormalized, normalized))
    .limit(1);
  return row?.id ?? null;
}

async function main() {
  const db = getDb();

  for (const seed of SEED_TEAMS) {
    const ownerEmail = seed.members.find((m) => m.role === "owner")?.email;
    const createdBy = ownerEmail ? await participantIdByEmail(db, ownerEmail) : null;

    const values = {
      slug: seed.slug || slugifyTeamName(seed.name),
      name: seed.name,
      tagline: seed.tagline,
      description: seed.description,
      category: seed.category,
      websiteUrl: seed.websiteUrl ?? null,
      proofUrl: seed.proofUrl ?? null,
      createdBy,
      updatedAt: new Date(),
    };

    const [team] = await db
      .insert(teams)
      .values(values)
      .onConflictDoUpdate({
        target: teams.slug,
        set: {
          ...values,
          updatedAt: sql`now()`,
        },
      })
      .returning();

    for (const member of seed.members) {
      const participantId = await participantIdByEmail(db, member.email);
      if (!participantId) {
        console.warn(`  skip member (not in DB): ${member.email} → ${seed.name}`);
        continue;
      }

      await db
        .insert(teamMembers)
        .values({
          teamId: team.id,
          participantId,
          role: member.role,
        })
        .onConflictDoUpdate({
          target: [teamMembers.teamId, teamMembers.participantId],
          set: { role: member.role },
        });
    }

    console.log(`Seeded team: ${seed.name} (${team.slug})`);
  }

  await closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
