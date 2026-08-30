import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members | Superteam Malaysia",
  description:
    "Discover the talented builders, creators, and founders driving the Solana ecosystem in Malaysia. Search by skills, roles, and expertise.",
  openGraph: {
    title: "Members | Superteam Malaysia",
    description:
      "Meet the builders behind Superteam Malaysia's thriving Solana community.",
  },
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
