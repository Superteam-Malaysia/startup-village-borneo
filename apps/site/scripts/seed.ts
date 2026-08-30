import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: [".env.local", ".env"] });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}

if (!supabaseServiceKey && !supabasePublishableKey) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env.local"
  );
  process.exit(1);
}

const key = supabaseServiceKey ?? supabasePublishableKey!;
if (!supabaseServiceKey) {
  console.warn(
    "WARNING: No SUPABASE_SERVICE_ROLE_KEY found. Using publishable key — writes may fail if RLS blocks them.\n" +
    "Add SUPABASE_SERVICE_ROLE_KEY to .env.local for full admin access (find it in Supabase Dashboard > Settings > API Keys).\n"
  );
}

const supabase = createClient(supabaseUrl, key);

const members = [
  {
    name: "Ahmad Razif",
    role: "Core Team Lead",
    company: "Superteam MY",
    bio: "Leading the Solana ecosystem growth in Malaysia. Building bridges between Web2 and Web3.",
    photo_url: "/images/members/placeholder.jpg",
    twitter_url: "https://x.com/superteammy",
    skill_tags: ["Core Team", "Growth", "Community"],
    achievements: { hackathon_wins: 3, projects_built: 5, grants_received: 2 },
    is_featured: true,
    is_core_team: true,
    display_order: 1,
  },
  {
    name: "Sarah Chen",
    role: "Frontend Engineer",
    company: "SolanaFM",
    bio: "Building beautiful DeFi interfaces. React & Solana enthusiast.",
    photo_url: "/images/members/placeholder.jpg",
    twitter_url: "https://x.com/superteammy",
    skill_tags: ["Frontend", "Design", "Rust"],
    achievements: {
      hackathon_wins: 2,
      projects_built: 8,
      bounties_completed: 15,
    },
    is_featured: true,
    is_core_team: false,
    display_order: 2,
  },
  {
    name: "Raj Kumar",
    role: "Solana Developer",
    company: "Independent",
    bio: "Full-stack Solana developer. Anchor & Rust specialist.",
    photo_url: "/images/members/placeholder.jpg",
    twitter_url: "https://x.com/superteammy",
    skill_tags: ["Rust", "Frontend", "Product"],
    achievements: {
      hackathon_wins: 5,
      projects_built: 12,
      grants_received: 3,
    },
    is_featured: true,
    is_core_team: false,
    display_order: 3,
  },
  {
    name: "Mei Ling Tan",
    role: "Content Lead",
    company: "Superteam MY",
    bio: "Crafting narratives for the Malaysian Web3 ecosystem.",
    photo_url: "/images/members/placeholder.jpg",
    twitter_url: "https://x.com/superteammy",
    skill_tags: ["Content", "Growth", "Community"],
    achievements: { bounties_completed: 20, projects_built: 3 },
    is_featured: true,
    is_core_team: true,
    display_order: 4,
  },
  {
    name: "Daniel Lim",
    role: "Product Designer",
    company: "Jupiter",
    bio: "Designing the future of DeFi. Passionate about Web3 UX.",
    photo_url: "/images/members/placeholder.jpg",
    twitter_url: "https://x.com/superteammy",
    skill_tags: ["Design", "Product", "Frontend"],
    achievements: { hackathon_wins: 1, projects_built: 6 },
    is_featured: false,
    is_core_team: false,
    display_order: 5,
  },
  {
    name: "Nurul Aina",
    role: "BizDev Manager",
    company: "Marinade Finance",
    bio: "Connecting Solana projects with Malaysian enterprises.",
    photo_url: "/images/members/placeholder.jpg",
    twitter_url: "https://x.com/superteammy",
    skill_tags: ["Growth", "Community", "Product"],
    achievements: { projects_built: 4, dao_contributions: 8 },
    is_featured: false,
    is_core_team: false,
    display_order: 6,
  },
];

const events = [
  {
    title: "Solana Builder Night KL",
    description:
      "A night of building, networking, and learning about the latest in Solana development.",
    date: "2025-03-15T18:00:00+08:00",
    location: "Kuala Lumpur, Malaysia",
    luma_url: "https://lu.ma/superteammy",
    image_url: "/images/events/placeholder.jpg",
    is_upcoming: true,
    attendee_count: 85,
  },
  {
    title: "Web3 Hackathon Malaysia",
    description: "Build the next big thing on Solana. $50K in prizes.",
    date: "2025-04-20T09:00:00+08:00",
    location: "Penang, Malaysia",
    luma_url: "https://lu.ma/superteammy",
    image_url: "/images/events/placeholder.jpg",
    is_upcoming: true,
    attendee_count: 120,
  },
  {
    title: "DeFi Deep Dive Workshop",
    description:
      "Learn how to build DeFi protocols on Solana from scratch.",
    date: "2025-05-10T14:00:00+08:00",
    location: "Virtual",
    luma_url: "https://lu.ma/superteammy",
    image_url: "/images/events/placeholder.jpg",
    is_upcoming: true,
    attendee_count: 45,
  },
  {
    title: "Superteam MY Launch Party",
    description:
      "The official launch of Superteam Malaysia with keynotes from global leaders.",
    date: "2024-12-01T19:00:00+08:00",
    location: "Kuala Lumpur, Malaysia",
    luma_url: "https://lu.ma/superteammy",
    image_url: "/images/events/placeholder.jpg",
    is_upcoming: false,
    attendee_count: 150,
  },
  {
    title: "Solana 101 Workshop",
    description: "Introduction to Solana development for beginners.",
    date: "2024-10-15T14:00:00+08:00",
    location: "Kuala Lumpur, Malaysia",
    luma_url: "https://lu.ma/superteammy",
    image_url: "/images/events/placeholder.jpg",
    is_upcoming: false,
    attendee_count: 62,
  },
  {
    title: "NFT & Creator Economy Meetup",
    description: "Exploring NFTs and the creator economy on Solana.",
    date: "2024-11-22T18:00:00+08:00",
    location: "Virtual",
    luma_url: "https://lu.ma/superteammy",
    image_url: "/images/events/placeholder.jpg",
    is_upcoming: false,
    attendee_count: 38,
  },
];

const partners = [
  {
    name: "Solana Foundation",
    logo_url: "/images/partners/solana.svg",
    website_url: "https://solana.com",
    category: "solana_project" as const,
    display_order: 1,
  },
  {
    name: "Jupiter",
    logo_url: "/images/partners/jupiter.svg",
    website_url: "https://jup.ag",
    category: "solana_project" as const,
    display_order: 2,
  },
  {
    name: "Marinade",
    logo_url: "/images/partners/marinade.svg",
    website_url: "https://marinade.finance",
    category: "solana_project" as const,
    display_order: 3,
  },
  {
    name: "Helius",
    logo_url: "/images/partners/helius.svg",
    website_url: "https://helius.dev",
    category: "solana_project" as const,
    display_order: 4,
  },
  {
    name: "Raydium",
    logo_url: "/images/partners/raydium.svg",
    website_url: "https://raydium.io",
    category: "solana_project" as const,
    display_order: 5,
  },
  {
    name: "Magic Eden",
    logo_url: "/images/partners/magiceden.svg",
    website_url: "https://magiceden.io",
    category: "solana_project" as const,
    display_order: 6,
  },
  {
    name: "MDEC",
    logo_url: "/images/partners/mdec.svg",
    website_url: "https://mdec.my",
    category: "malaysian_partner" as const,
    display_order: 7,
  },
  {
    name: "Cradle Fund",
    logo_url: "/images/partners/cradle.svg",
    website_url: "https://cradle.com.my",
    category: "malaysian_partner" as const,
    display_order: 8,
  },
];

const stats = [
  {
    label: "Members",
    value: 500,
    suffix: "+",
    icon: "users",
    display_order: 1,
  },
  {
    label: "Events Hosted",
    value: 20,
    suffix: "+",
    icon: "calendar",
    display_order: 2,
  },
  {
    label: "Projects Built",
    value: 50,
    suffix: "+",
    icon: "code",
    display_order: 3,
  },
  {
    label: "Bounties Completed",
    value: 100,
    suffix: "+",
    icon: "trophy",
    display_order: 4,
  },
];

const testimonials = [
  {
    author_name: "Builder from KL",
    author_handle: "@web3builderkl",
    author_avatar: "/images/members/placeholder.jpg",
    content:
      "Superteam Malaysia helped me land my first Web3 job. The community is incredibly supportive and the events are world-class.",
    tweet_url: "https://x.com/superteammy",
    is_featured: true,
  },
  {
    author_name: "Solana Dev MY",
    author_handle: "@solanadevmy",
    author_avatar: "/images/members/placeholder.jpg",
    content:
      "Won my first hackathon through Superteam MY! The mentorship and connections are unmatched in the Malaysian Web3 scene.",
    tweet_url: "https://x.com/superteammy",
    is_featured: true,
  },
  {
    author_name: "DeFi Builder",
    author_handle: "@defibuilder_my",
    author_avatar: "/images/members/placeholder.jpg",
    content:
      "From zero Web3 experience to building on Solana in 3 months. Thank you Superteam Malaysia for making this possible!",
    tweet_url: "https://x.com/superteammy",
    is_featured: true,
  },
];

const communityTweets = [
  { tweet_id: "1668408059125702661", display_order: 1 },
  { tweet_id: "1629307668568633344", display_order: 2 },
];

const faqs = [
  {
    question: "What is Superteam Malaysia?",
    answer:
      "Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem. We support Web3 growth in Malaysia through events, education, grants, and community building.",
    display_order: 1,
  },
  {
    question: "How do I join Superteam Malaysia?",
    answer:
      "You can join our community by connecting with us on Telegram, or Twitter/X. We welcome developers, designers, content creators, business developers, and anyone passionate about Web3 and Solana.",
    display_order: 2,
  },
  {
    question: "What opportunities are available?",
    answer:
      "We offer bounties, grants, job opportunities, hackathons, workshops, and mentorship programs. Whether you're a developer, designer, or community builder, there are opportunities for you to earn and grow.",
    display_order: 3,
  },
  {
    question: "How can projects collaborate with us?",
    answer:
      "If you're a Solana project looking to expand in Malaysia, reach out to us via our social channels. We can help with community building, talent sourcing, event partnerships, and ecosystem integration.",
    display_order: 4,
  },
  {
    question: "Do I need to be a developer to join?",
    answer:
      "Absolutely not! Superteam Malaysia welcomes all skill sets — designers, content creators, marketers, business developers, community managers, and more. Web3 needs diverse talent to thrive.",
    display_order: 5,
  },
];

async function clearTable(table: string) {
  const { error } = await supabase.from(table).delete().gte("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.error(`  Failed to clear ${table}:`, error.message);
    return false;
  }
  console.log(`  Cleared ${table}`);
  return true;
}

async function seedTable(table: string, data: Record<string, unknown>[]) {
  const { data: inserted, error } = await supabase
    .from(table)
    .insert(data)
    .select();

  if (error) {
    console.error(`  Failed to seed ${table}:`, error.message);
    return false;
  }
  console.log(`  Seeded ${table} with ${inserted?.length ?? 0} rows`);
  return true;
}

async function main() {
  console.log("\nSuperteam MY - Database Seeder");
  console.log("================================\n");
  console.log(`Supabase URL: ${supabaseUrl}\n`);

  console.log("1. Clearing existing data...");
  const tables = [
    "members",
    "events",
    "partners",
    "stats",
    "testimonials",
    "community_tweets",
    "faqs",
  ];
  for (const table of tables) {
    await clearTable(table);
  }

  console.log("\n2. Seeding fresh data...");
  await seedTable("members", members);
  await seedTable("events", events);
  await seedTable("partners", partners);
  await seedTable("stats", stats);
  await seedTable("testimonials", testimonials);
  await seedTable("community_tweets", communityTweets);
  await seedTable("faqs", faqs);

  console.log("\n3. Seeding dashboard metrics (for admin charts)...");
  const dashboardMetrics = [
    { metric_key: "gdp_brought_malaysia", value: 248500, period: "overall" },
    { metric_key: "gdp_brought_malaysia", value: 8200, period: "this_month" },
    { metric_key: "grants_awarded", value: 12, period: "overall" },
    { metric_key: "grants_awarded", value: 2, period: "this_month" },
    { metric_key: "bounties_awarded", value: 136985, period: "overall" },
    { metric_key: "bounties_awarded", value: 0, period: "this_month" },
  ];
  const { error: dmError } = await supabase.from("dashboard_metrics").upsert(dashboardMetrics, {
    onConflict: "metric_key,period",
  });
  if (dmError) {
    console.warn("  Dashboard metrics upsert skipped (table may not exist yet):", dmError.message);
  } else {
    console.log("  Seeded dashboard_metrics");
  }

  console.log("\nDone! Your Supabase database is now populated.\n");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
