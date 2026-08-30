import type { SVGProps } from "react";

const common = {
  width: 14,
  height: 14,
  fill: "currentColor",
  "aria-hidden": true as const,
};

export type SocialIconName = "twitter" | "linkedin" | "telegram" | "email" | "connect";

export function SocialIcon({
  name,
  ...props
}: { name: SocialIconName } & SVGProps<SVGSVGElement>) {
  switch (name) {
    case "twitter":
      return (
        <svg {...common} viewBox="0 0 24 24" {...props}>
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.7l-5.2-6.8L5.6 22H2.5l7.3-8.4L.8 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} viewBox="0 0 24 24" {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a-2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 0 1 2.063-2.063 2.062 2.062 0 0 1 2.064 2.063 2.062 2.062 0 0 1-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common} viewBox="0 0 24 24" {...props}>
          <path d="M22.5 2.8 1.9 10.4c-1.2.5-1.2 1.2-.2 1.5l5.2 1.6 2 6.1c.3.8.6 1.1 1.2 1.1.6 0 .9-.3 1.2-.9l2.9-4.7 5.4 4c1 .6 1.7.3 2-1.1L23.8 4.5c.4-1.4-.5-2-1.7-1.7ZM9.4 13.8l9.9-6.2c.5-.3.9-.1.5.2L11.2 15l-.4 3.8-1.4-5Z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common} viewBox="0 0 24 24" {...props}>
          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.01L12 13l8-6.99V6H4zm16 10V9l-7.29 6.34a1 1 0 0 1-1.42 0L4 9v7h16z" />
        </svg>
      );
    case "connect":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path
            d="M21 11.5a8.4 8.4 0 01-.9 3.8 8 8 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8 8 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function socialIconForLabel(label: string): SocialIconName {
  switch (label) {
    case "Twitter":
      return "twitter";
    case "LinkedIn":
      return "linkedin";
    case "Telegram":
      return "telegram";
    case "Email":
      return "email";
    default:
      return "connect";
  }
}
