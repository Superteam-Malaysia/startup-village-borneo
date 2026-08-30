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
      { email: "eirie.luma@mvn.xyz", role: "editor" },
    ],
  },
  {
    slug: "shoqi-io",
    name: "Shoqi.io",
    tagline: "BaZi and Feng Shui guidance for career and life decisions",
    description:
      "Modern Chinese metaphysics platform that turns BaZi and Feng Shui into practical, personalised guidance for career, business and major life decisions — making traditional metaphysics easier to understand and actionable.",
    category: "Consumer",
    websiteUrl: "https://shoqi.io",
    proofUrl: "https://shoqi.io",
    members: [
      { email: "justthur111@gmail.com", role: "owner" },
      { email: "chinbingyong@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "mypengu",
    name: "mypengu",
    tagline: "Where locals go in Sarawak",
    description:
      "A marketplace gathering Sarawak local-made shops so tourists and locals know where to go — a site where everyone knows where local goes.",
    category: "Consumer",
    websiteUrl: "https://mypengu.com",
    proofUrl: "https://mypengu.com",
    members: [
      { email: "cheryl.l@pudgypenguins.io", role: "owner" },
      { email: "huaipoh@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "contentdc",
    name: "ContentDC",
    tagline: "Creator distribution channel powered by performance prediction",
    description:
      "A new distribution channel with content creators, powered by performance prediction — turning millions of creators across socials into one allocatable channel with smart-contract micro-payments.",
    category: "Consumer",
    websiteUrl: "https://contentdc.com",
    proofUrl: "https://contentdc.com/business/",
    members: [
      { email: "chuhninaann@gmail.com", role: "owner" },
      { email: "antony.peech@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "rewardy-wallet",
    name: "Rewardy Wallet",
    tagline: "Loyalty points and rewards in one Web3 wallet",
    description:
      "An app that consolidates loyalty points, coupons, and cashback from multiple brands into a single digital wallet — converting daily activities into on-chain transparent rewards.",
    category: "Consumer",
    websiteUrl: "https://www.rewardywallet.com",
    proofUrl: "https://www.rewardywallet.com",
    members: [
      { email: "cleverlee@rewardywallet.com", role: "owner" },
      { email: "xkwh530@gmail.com", role: "owner" },
    ],
  },
  {
    slug: "oneplan",
    name: "OnePlan",
    tagline: "AI-powered group travel planning",
    description:
      "An AI-powered group travel platform to discover destinations from short-form content, plan itineraries collaboratively, and manage shared expenses — with on-chain payments and shared trip wallets.",
    category: "Consumer",
    websiteUrl: "https://www.oneplan.space",
    proofUrl: "https://www.oneplan.space",
    members: [
      { email: "namdinh252000@gmail.com", role: "owner" },
      { email: "giavy1115@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "mermail",
    name: "Mermail",
    tagline: "Identity, email, and payments for AI agents",
    description:
      "Identity, email, and payment infrastructure for AI agents — enabling agents to communicate, verify accounts, and transact on behalf of users, with Solana wallet and agentic commerce workflows.",
    category: "Consumer",
    websiteUrl: "https://mermail.app",
    proofUrl: "https://mermail.app",
    members: [
      { email: "toanbk21096@gmail.com", role: "owner" },
      { email: "nathan.nguyennhat@gmail.com", role: "owner" },
    ],
  },
  {
    slug: "foresight",
    name: "Foresight",
    tagline: "Prize-linked savings with skill-and-chance mini-games",
    description:
      "A principal-protected savings pool where weekly yield is awarded by draw, and players compete in skill-and-chance mini-games to increase their odds — never their capital.",
    category: "DeFi",
    websiteUrl: "https://foresight.now",
    proofUrl: "https://foresight.now",
    members: [
      { email: "menghong6988@gmail.com", role: "owner" },
      { email: "echai2905@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "senimatik",
    name: "Senimatik",
    tagline: "Southeast Asia's global IP art marketplace",
    description:
      "Building Southeast Asia's leading global IP art marketplace — connecting artists, collectors and brands through blockchain-powered ownership, licensing and royalties, starting in Malaysia.",
    category: "Consumer",
    websiteUrl: "https://senimatik.com",
    proofUrl: "https://senimatik.com",
    members: [
      { email: "abdazharee@gmail.com", role: "owner" },
      { email: "mudennn94@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "tuc",
    name: "TUC",
    tagline: "Verified on-chain sustainability for events",
    description:
      "Turns sustainability actions at events into verified on-chain proof on Solana — solving unverifiable ESG reporting for event organisers, sponsors and venues, beginning with Sarawak's events industry.",
    category: "Consumer",
    websiteUrl: "https://linktr.ee/tucswk",
    proofUrl: "https://upcycle-collective.vercel.app",
    members: [
      { email: "venessa@madisevents.com", role: "owner" },
      { email: "kuehtzenan1995@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "physical-ai",
    name: "Physical AI",
    tagline: "Bring AI into physical life",
    description: "Bring AI in to physical life.",
    category: "Consumer",
    members: [
      { email: "luuminhquyen610@gmail.com", role: "owner" },
      { email: "vennluuu@gmail.com", role: "editor" },
    ],
  },
  {
    slug: "anneal",
    name: "Anneal",
    tagline: "Options DEX with quotes for any contract",
    description:
      "An options DEX on Solana where you can get a price for any contract you want instead of picking from a listed menu — for traders who know the hedge they need but can't get quoted.",
    category: "DeFi",
    websiteUrl: "https://annealfi.io",
    proofUrl: "https://annealfi.io",
    members: [{ email: "zheweng001@e.ntu.edu.sg", role: "owner" }],
  },
  {
    slug: "janamat",
    name: "Janamat",
    tagline: "Verified civic participation for Nepal and its diaspora",
    description:
      "A verified civic participation platform where citizens vote on governance polls, sign petitions, and back MP campaigns — every vote recorded on-chain for tamper-proof, publicly auditable results.",
    category: "Consumer",
    websiteUrl: "https://janamat.app",
    proofUrl: "https://janamat.app",
    members: [{ email: "ronak01.raj@gmail.com", role: "owner" }],
  },
  {
    slug: "vello",
    name: "Vello",
    tagline: "AI media infrastructure for zero-employee agencies",
    description:
      "Media infrastructure for zero-employee agencies — fully automating video creation, editing, and distribution via AI agents for solo operators managing enterprise-grade brand campaigns.",
    category: "Consumer",
    websiteUrl: "https://velloagents.com",
    proofUrl: "https://velloagents.com",
    members: [{ email: "zufairyk@gmail.com", role: "owner" }],
  },
  {
    slug: "myhomecrowd",
    name: "MyHomeCrowd",
    tagline: "Tokenized mortgage crowdlending for millennials",
    description:
      "Tokenized mortgage crowdlending platform helping deserving millennials achieve home ownership — connecting borrowers to investors seeking fixed returns and impact staking rewards.",
    category: "DeFi",
    websiteUrl: "https://myhomecrowd.com",
    proofUrl: "https://myhomecrowd.com",
    members: [{ email: "dave.chew@myhomecrowd.com", role: "owner" }],
  },
  {
    slug: "aqua0",
    name: "Aqua0",
    tagline: "Cross-chain shared liquidity for stablecoin issuers",
    description:
      "Cross-chain shared liquidity infrastructure for stablecoin issuers — one deposit backs liquidity across Uniswap V4 pools and 1inch Aqua strategies on multiple chains simultaneously.",
    category: "DeFi",
    websiteUrl: "https://aqua0.xyz",
    proofUrl: "https://app.aqua0.xyz",
    members: [{ email: "yudhishthra@aqua0.xyz", role: "owner" }],
  },
  {
    slug: "fractionax",
    name: "Fractionax",
    tagline: "Agentic RWA investment infrastructure",
    description:
      "Agentic real-world asset investment infrastructure using AI agents to source, evaluate, structure, and manage tokenized opportunities across real estate, private credit, businesses, and commodities.",
    category: "DeFi",
    websiteUrl: "https://fractionax.app",
    proofUrl: "https://fractionax.app",
    members: [{ email: "nizarsyahmi37@gmail.com", role: "owner" }],
  },
  {
    slug: "dgen",
    name: "dgen",
    tagline: "Crypto card and non-custodial Solana wallet",
    description:
      "Crypto card to load with crypto and spend, plus a non-custodial crypto wallet with full Solana support — private swaps across 3,500+ assets on 320 blockchains.",
    category: "Consumer",
    websiteUrl: "https://card.dgentech.io",
    proofUrl: "https://card.dgentech.io",
    members: [{ email: "goodwin.icon@gmail.com", role: "owner" }],
  },
  {
    slug: "problemsight",
    name: "ProblemSight",
    tagline: "Discover validated real-world problems before building",
    description:
      "ProblemSight is a platform that helps founders, builders, and hackathon participants discover validated real-world problems before building solutions. Instead of launching products, users share pain points, validate demand, and uncover opportunities worth solving through community insights and AI-powered analysis. Launched at Product Hunt.",
    category: "Consumer",
    websiteUrl: "https://problemsight.com",
    proofUrl: "https://www.producthunt.com/products/problem-sight",
    members: [{ email: "53845tianbelulok@gmail.com", role: "owner" }],
  },
  {
    slug: "breeze-pocket",
    name: "Breeze Pocket",
    tagline: "Options trading as a simple prediction-market experience",
    description:
      "A consumer-friendly mobile app that turns complex options trading into a simple prediction-market experience — users predict whether an asset's price will rise or fall, earn option premiums, and can buy, sell, or reclaim committed funds.",
    category: "DeFi",
    members: [{ email: "skky5687@gmail.com", role: "owner" }],
  },
  {
    slug: "project-arbor",
    name: "Project Arbor",
    tagline: "Explainable AI for financial risk analysis",
    description:
      "A web-based Explainable AI framework that visualizes the reasoning pathways of AI models during financial risk analysis — converting unstructured inferences into interactive node-link visualizations.",
    category: "Consumer",
    websiteUrl: "https://projectarbor.com",
    proofUrl: "https://projectarbor.com",
    members: [{ email: "rafieqrafizie@gmail.com", role: "owner" }],
  },
  {
    slug: "operator-uplift",
    name: "Operator Uplift",
    tagline: "AI-verified accountability with real stakes",
    description:
      "AI-verified accountability software where users stake money, submit daily proof, and forfeit if they don't follow through — for people who've tried every habit tracker and still can't stick to commitments because badges and streaks don't create real consequences.",
    category: "Consumer",
    websiteUrl: "https://operatoruplift.com",
    proofUrl: "https://operatoruplift.com",
    members: [{ email: "operatoruplift@gmail.com", role: "owner" }],
  },
  {
    slug: "kurtosis-ratings",
    name: "Kurtosis Ratings",
    tagline: "Due diligence ratings for Solana fixed-income primitives",
    description:
      "Helps crypto funds do proper due diligence on newer fixed-income primitives in Solana — rating the risk profiles of holding positions separately even when they share the same underlying token.",
    category: "DeFi",
    proofUrl: "https://superteam.fun/earn/listing/ranger-build-a-bear-hackathon-main-track",
    members: [{ email: "kai@kurtosis-labs.com", role: "owner" }],
  },
  {
    slug: "cardsjp",
    name: "CardsJP",
    tagline: "Reselling Pokémon cards from Akihabara to the world",
    description:
      "Reselling Pokémon cards from Akihabara Tokyo — collaborating with shop owners to reach collectors worldwide.",
    category: "Consumer",
    websiteUrl: "https://cardsjp.com",
    proofUrl: "https://cardsjp.com",
    members: [{ email: "emailsolah@gmail.com", role: "owner" }],
  },
  {
    slug: "hypebiscus",
    name: "Hypebiscus",
    tagline: "Fraud detection without changing user habits",
    description:
      "A fraud detector that works without changing users' habits — executing trade or DeFi transactions on the spot with built-in protection.",
    category: "DeFi",
    proofUrl: "https://hypebiscus.xyz",
    members: [{ email: "wanaqilre@gmail.com", role: "owner" }],
  },
  {
    slug: "withmiautomation",
    name: "WithMIA Automation",
    tagline: "Web3 and AI education for everyone",
    description:
      "An education platform about Web3 and AI where everyone — even parents new to crypto — can learn on top of the Solana network.",
    category: "Consumer",
    websiteUrl: "https://www.withmiautomation.com",
    proofUrl: "https://www.withmiautomation.com",
    members: [{ email: "fahmiiireza@gmail.com", role: "owner" }],
  },
  {
    slug: "diabetes-companion",
    name: "Diabetes Companion",
    tagline: "Track sugar intake and manage diabetic-friendly meals",
    description:
      "Helps people with diabetes track sugar intake using predefined foods or AI-powered photo estimation, manage medications, monitor progress, and access past sugar levels — all in one place.",
    category: "Consumer",
    proofUrl: "https://chat.ilmu.ai/artifacts/30bcdb27",
    members: [{ email: "hpy5c8whjc@privaterelay.appleid.com", role: "owner" }],
  },
  {
    slug: "sea-digital-markets",
    name: "SEA Digital Markets",
    tagline: "Solana access to digital markets for Southeast Asia",
    description:
      "Access to digital markets for Southeast Asia using Solana — for businesses and entities that want to penetrate digital markets in the region.",
    category: "Consumer",
    proofUrl: "https://github.com/RafaTahir",
    members: [{ email: "rafaeitahir@hotmail.com", role: "owner" }],
  },
  {
    slug: "morr-platform",
    name: "Morr Platform",
    tagline: "B2B and B2C discovery for organisations and consumers",
    description:
      "A solution for B2B and B2C consumers — dedicated software for organisations to find their business or direct consumers.",
    category: "Consumer",
    members: [{ email: "nilesh@morr.my", role: "owner" }],
  },
  {
    slug: "loofta-pay",
    name: "Loofta Pay",
    tagline: "Payment app with earning options",
    description:
      "Loofta Pay — a payment app with earning options for everyday users.",
    category: "Consumer",
    websiteUrl: "https://loofta.xyz",
    proofUrl: "https://loofta.xyz",
    members: [{ email: "lisa.bechina@gmail.com", role: "owner" }],
  },
  {
    slug: "sanctum",
    name: "Sanctum",
    tagline: "Liquid staking on Solana",
    description: "Sanctum — liquid staking infrastructure on Solana.",
    category: "DeFi",
    websiteUrl: "https://sanctum.so",
    proofUrl: "https://sanctum.so",
    members: [{ email: "nicfuryyy@gmail.com", role: "owner" }],
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
