import { FOOTER_SOCIAL } from "@/data/footer";

function Icon({ name }: { name: (typeof FOOTER_SOCIAL)[number]["icon"] }) {
  const common = { width: 20, height: 20, fill: "currentColor", "aria-hidden": true as const };

  switch (name) {
    case "youtube":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.7l-5.2-6.8L5.6 22H2.5l7.3-8.4L.8 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20Z" />
        </svg>
      );
    case "discord":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M20.3 4.4A17.4 17.4 0 0 0 15.5 3c-.2.4-.5 1-.7 1.4a16 16 0 0 0-4.6 0C9.9 4 9.6 3.4 9.4 3a17.5 17.5 0 0 0-4.8 1.4C2.2 8.2 1.4 11.9 1.8 15.5a17.6 17.6 0 0 0 5.3 2.7c.4-.6.8-1.1 1.1-1.7-.6-.2-1.2-.5-1.7-.8l.4-.3c3.3 1.5 6.9 1.5 10.1 0l.4.3c-.5.3-1.1.6-1.7.8.3.6.7 1.1 1.1 1.7a17.5 17.5 0 0 0 5.3-2.7c.5-4.2-.8-7.8-3.4-11.1ZM8.7 13.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
        </svg>
      );
    case "reddit":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0Zm5 15.6c.1.6-.4 1.1-1 1.1-.4 0-.8-.3-.9-.7-.6-2.3-2.5-4-4.8-4.2l.8-3.7 2.4.5c.1.9.9 1.6 1.8 1.6 1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8c-.7 0-1.3.4-1.6 1l-2.7-.6c-.2 0-.4.1-.5.3l-.9 4.1c-2.4.2-4.4 1.9-5 4.2-.1.5-.5.8-.9.8-.6 0-1.1-.5-1-1.1.5-2.4 2.3-4.3 4.6-5-.3-.9-.1-1.9.6-2.6.9-.9 2.3-1 3.4-.3l3.2-1.5c.5-.2 1.1 0 1.3.5l1.5 3.2c1.1-.7 2.5-.6 3.4.3.7.7.9 1.7.6 2.6 2.3.7 4.1 2.6 4.6 5Z" />
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
