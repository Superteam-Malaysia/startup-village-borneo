import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPublicTeamBySlug } from "@/lib/teams/public-teams";

export const dynamic = "force-dynamic";

type TeamEditPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TeamEditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await getPublicTeamBySlug(slug);
  if (!team) return { title: "Team not found" };
  return { title: `Edit ${team.name}` };
}

export default async function TeamEditPage({ params }: TeamEditPageProps) {
  const { slug } = await params;
  redirect(`/teams/${slug}`);
}
