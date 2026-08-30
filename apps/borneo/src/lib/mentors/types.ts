export type PublicMentorWorkshop = {
  title: string;
  dayLabel: string;
  date: string;
  start: string;
};

export type PublicMentor = {
  id: string;
  name: string;
  organization: string | null;
  isWorkshopLeader: boolean;
  isJudge: boolean;
  judgeRole: string | null;
  workshops: PublicMentorWorkshop[];
  avatar: string | null;
  twitter: string | null;
  linkedin: string | null;
  telegram: string | null;
  email: string | null;
  initials: string;
};
