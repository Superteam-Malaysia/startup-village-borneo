"use client";

import { motion } from "framer-motion";
import { Twitter, Trophy, Code2, Award, Coins, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Member } from "@/lib/types";

const achievementIcons: Record<string, { icon: React.ElementType; color: string }> = {
  hackathon_wins: { icon: Trophy, color: "text-accent-gold" },
  projects_built: { icon: Code2, color: "text-solana-green" },
  grants_received: { icon: Coins, color: "text-solana-purple" },
  bounties_completed: { icon: Award, color: "text-solana-purple" },
  dao_contributions: { icon: Users, color: "text-solana-green" },
};

const achievementLabels: Record<string, string> = {
  hackathon_wins: "hackathon wins",
  projects_built: "projects built",
  grants_received: "grants received",
  bounties_completed: "bounties completed",
  dao_contributions: "DAO contributions",
};

interface MemberCardProps {
  member: Member;
  index: number;
}

export function MemberCard({ member, index }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-solana-purple/20 transition-all duration-300 hover:bg-surface"
    >
      {/* Core Team Badge */}
      {member.is_core_team && (
        <div className="absolute top-4 right-4">
          <Badge variant="purple">Core Team</Badge>
        </div>
      )}

      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5 mb-4">
        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {member.name.charAt(0)}
          </span>
        </div>
      </div>

      {/* Info */}
      <h3 className="text-base font-semibold text-white mb-1">{member.name}</h3>
      <p className="text-sm text-muted-dark mb-1">{member.role}</p>
      <p className="text-sm text-solana-purple mb-4">{member.company}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {member.skill_tags.map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Achievements */}
      <div className="space-y-2 mb-4">
        {Object.entries(member.achievements).map(([key, value]) => {
          if (!value) return null;
          const config = achievementIcons[key];
          if (!config) return null;
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-2 text-xs text-muted-dark">
              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              <span>
                {value} {achievementLabels[key]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Twitter */}
      <a
        href={member.twitter_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-solana-purple transition-colors"
      >
        <Twitter className="w-3.5 h-3.5" />
        <span>Follow on X</span>
      </a>
    </motion.div>
  );
}
