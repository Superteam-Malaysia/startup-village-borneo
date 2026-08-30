import { FOOTER_SOCIAL } from "@/data/footer";

function Icon({ name }: { name: (typeof FOOTER_SOCIAL)[number]["icon"] }) {
  const common = { width: 20, height: 20, fill: "currentColor", "aria-hidden": true as const };

  switch (name) {
    case "instagram":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5ZM17.8 6.2a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.7l-5.2-6.8L5.6 22H2.5l7.3-8.4L.8 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20Z" />
        </svg>
      );
    case "website":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm7.9 9h-3.1a15.4 15.4 0 0 0-1.2-4.7A8 8 0 0 1 19.9 11ZM12 4a13.6 13.6 0 0 1 1.8 6H10.2A13.6 13.6 0 0 1 12 4ZM8.4 6.3A15.4 15.4 0 0 0 7.2 11H4.1a8 8 0 0 1 4.3-4.7ZM4.1 13h3.1a15.4 15.4 0 0 0 1.2 4.7A8 8 0 0 1 4.1 13Zm3.3 4.7A15.4 15.4 0 0 0 10.2 18h3.6a13.6 13.6 0 0 1-1.8-6H7.4a15.4 15.4 0 0 0 1 1.7Zm3.6 0a13.6 13.6 0 0 0 1.8 6 8 8 0 0 0 0-6Zm3.6 0h3.1a8 8 0 0 1-4.3 4.7 15.4 15.4 0 0 0 1.2-4.7Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M22.5 2.8 1.9 10.4c-1.2.5-1.2 1.2-.2 1.5l5.2 1.6 2 6.1c.3.8.6 1.1 1.2 1.1.6 0 .9-.3 1.2-.9l2.9-4.7 5.4 4c1 .6 1.7.3 2-1.1L23.8 4.5c.4-1.4-.5-2-1.7-1.7ZM9.4 13.8l9.9-6.2c.5-.3.9-.1.5.2L11.2 15l-.4 3.8-1.4-5Z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.7 1.7 2.6 2 .4.1.8.4.8.8v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
        </svg>
      );
  }
}

export function FooterSocialIcons() {
  return (
    <ul className="bp-footer__social">
      {FOOTER_SOCIAL.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bp-footer__social-link"
            aria-label={item.label}
          >
            <Icon name={item.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
