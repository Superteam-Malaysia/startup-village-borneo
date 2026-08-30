interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "purple" | "green" | "gold";
}

const variants = {
  default: "bg-white/5 text-muted border-white/10",
  purple: "bg-solana-purple/10 text-solana-purple border-solana-purple/20",
  green: "bg-solana-green/10 text-solana-green border-solana-green/20",
  gold: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
