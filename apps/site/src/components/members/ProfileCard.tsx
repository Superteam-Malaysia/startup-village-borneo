"use client";

import { motion } from "framer-motion";
import { Twitter, Github, Linkedin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Profile } from "@/lib/types";

interface ProfileCardProps {
  profile: Profile;
  index: number;
}

export function ProfileCard({ profile, index }: ProfileCardProps) {
  const displayName = profile.nickname || profile.real_name || "Member";
  const isCoreTeam = profile.user_role === "admin" || profile.user_role === "super_admin";
  const primaryRole = (profile.roles || [])[0]?.name;
  const primaryCompany = (profile.companies || [])[0]?.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-solana-purple/20 transition-all duration-300 hover:bg-surface"
    >
      {isCoreTeam && (
        <div className="absolute top-4 right-4">
          <Badge variant="purple">Core Team</Badge>
        </div>
      )}

      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5 mb-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {displayName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-white mb-1">{displayName}</h3>
      {primaryRole && <p className="text-sm text-muted-dark mb-1">{primaryRole}</p>}
      {primaryCompany && <p className="text-sm text-solana-purple mb-4">{primaryCompany}</p>}

      {(profile.skills || []).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.skills!.slice(0, 4).map((skill) => (
            <Badge key={skill.id} variant="default">
              {skill.name}
            </Badge>
          ))}
        </div>
      )}

      {profile.bio && (
        <p className="text-xs text-muted-dark mb-4 line-clamp-2">{profile.bio}</p>
      )}

      <div className="flex items-center gap-2">
        {profile.twitter_url && (
          <a
            href={profile.twitter_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-solana-purple transition-colors"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>
        )}
        {profile.github_url && (
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-solana-purple transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        )}
        {profile.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-solana-purple transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}
        {profile.website_url && (
          <a
            href={profile.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-solana-purple transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
