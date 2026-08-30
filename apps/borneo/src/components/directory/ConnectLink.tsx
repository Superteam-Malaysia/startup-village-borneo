import Link from "next/link";
import { SocialIcon, socialIconForLabel } from "@/components/ui/social-icons";

type ConnectLinkProps = {
  href: string | null;
  label: string;
};

export function ConnectLink({ href, label }: ConnectLinkProps) {
  const icon = socialIconForLabel(label);

  if (!href) {
    return (
      <span className="builder-card__connect builder-card__connect--disabled">
        <SocialIcon name={icon} />
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="builder-card__connect"
      target="_blank"
      rel="noopener noreferrer"
    >
      <SocialIcon name={icon} />
      {label}
    </Link>
  );
}
