export interface Member {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  photo_url: string;
  twitter_url: string;
  skill_tags: string[];
  achievements: {
    hackathon_wins?: number;
    projects_built?: number;
    grants_received?: number;
    dao_contributions?: number;
    bounties_completed?: number;
  };
  is_featured: boolean;
  is_core_team: boolean;
  display_order: number;
  created_at: string;
}

export type UserRole = 'super_admin' | 'admin' | 'member';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  user_role: UserRole;
  approval_status?: ApprovalStatus;
  approved_at?: string | null;
  approved_by?: string | null;
  nickname: string;
  real_name: string;
  avatar_url: string;
  bio: string;
  member_number?: number | null;
  badges?: string[];
  twitter_url: string;
  github_url: string;
  linkedin_url: string;
  website_url: string;
  telegram_url: string;
  achievements: string;
  talk_to_me_about: string;
  is_featured: boolean;
  display_order: number;
  onboarding_completed: boolean;
  is_active?: boolean;
  created_at: string;
  roles?: LookupTag[];
  companies?: LookupTag[];
  skills?: LookupTag[];
  subskills?: SubskillTag[];
}

export interface LookupTag {
  id: string;
  name: string;
}

export interface SubskillTag {
  id: string;
  name: string;
  skill_id?: string;
}

export interface Invite {
  id: string;
  token: string;
  email: string | null;
  invited_role: UserRole;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  expires_at: string;
  created_by: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  link: string;
  created_at: string;
  skills?: LookupTag[];
  subskills?: SubskillTag[];
}

export interface Event {
  id: string;
  luma_event_id?: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location: string;
  luma_url: string;
  image_url: string;
  is_upcoming: boolean;
  is_archived?: boolean;
  attendee_count?: number | null;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  category: 'solana_project' | 'malaysian_partner' | 'sponsor';
  display_order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  display_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  content: string;
  tweet_url: string;
  is_featured: boolean;
}

export interface CommunityTweet {
  id: string;
  tweet_id: string;
  display_order: number;
  created_at: string;
  /** Fetched from X API for admin display */
  author_name?: string;
  author_handle?: string;
  text_excerpt?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface SiteContent {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_url: string;
  image_url: string;
  content?: Record<string, unknown>;
}

export interface MissionPillar {
  title: string;
  description: string;
  image_url: string;
}

export interface Perk {
  id: string;
  title: string;
  description: string;
  value_badge: string;
  icon_url: string | null;
  redeem_url: string | null;
  redeem_label: string;
  is_limited: boolean;
  display_order: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  is_active: boolean;
  unsubscribed_at: string | null;
  created_at: string;
}

export interface EventPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}
