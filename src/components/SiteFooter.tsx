import Link from "next/link";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";
import { localizedPath } from "@/i18n/routing";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/global-city-review", icon: "linkedin" },
  { label: "Facebook", href: "https://www.facebook.com/globalcityreview", icon: "facebook" },
  { label: "RSS", href: "/feed.xml", icon: "rss" },
] as const;

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.9 8.8H3.7v10.5h3.2V8.8ZM5.3 4.2a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7Zm13.9 9.2c0-3.1-1.7-4.8-4.1-4.8-1.6 0-2.6.9-3 1.7V8.8H9v10.5h3.2v-5.8c0-1.4.7-2.3 2-2.3 1.2 0 1.8.8 1.8 2.3v5.8h3.2v-5.9Z" />
      </svg>
    );
  }

  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.4 20.4v-7.7h2.6l.4-3h-3V7.8c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.8-.1-1.6-.2-2.4-.2-2.4 0-4 1.5-4 4.1v2.2H7.5v3h2.7v7.7h3.2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.2 5.1c7.5 0 13.7 6.1 13.7 13.7h-3.1c0-5.9-4.8-10.6-10.6-10.6V5.1Zm0 5.3a8.4 8.4 0 0 1 8.4 8.4h-3.1a5.3 5.3 0 0 0-5.3-5.3v-3.1Zm2 5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Z" />
    </svg>
  );
}

export function SiteFooter({ locale }: { locale: string }) {
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");
  const resourceLinks = [
    { href: localizedPath(locale, "/categories/governance"), label: "Governance files" },
    { href: localizedPath(locale, "/categories/infrastructure"), label: "Infrastructure review" },
    { href: localizedPath(locale, "/search"), label: "Review archive" },
    { href: localizedPath(locale, "/editors"), label: "Reviewer index" },
  ];
  const deskLinks = [
    { href: localizedPath(locale, "/about"), label: "About the review" },
    { href: localizedPath(locale, "/editorial-principles"), label: tFooter("editorialPrinciples") },
    { href: localizedPath(locale, "/search"), label: "Source notes" },
  ];
  const legalLinks = [
    { href: localizedPath(locale, "/privacy"), label: tFooter("privacy") },
    { href: localizedPath(locale, "/terms"), label: tFooter("terms") },
    { href: localizedPath(locale, "/cookie-policy"), label: tFooter("cookie") },
  ];
  return (
    <footer className="site-footer">
      <section className="footer-panel" aria-label={tFooter("complianceNav")}>
        <div className="footer-column footer-statement">
          <h2>Publisher note</h2>
          <p>{tCommon("brand")}: {tFooter("description")}</p>
        </div>
        <nav className="footer-column" aria-label="Review resources">
          <h2>Review resources</h2>
          {resourceLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <nav className="footer-column" aria-label="Editorial affairs">
          <h2>Editorial affairs</h2>
          {deskLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <nav className="footer-column" aria-label="Compliance and legal">
          <h2>Compliance & legal</h2>
          {legalLinks.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <address className="footer-column footer-contact">
          <h2>Contact</h2>
          <span>{siteConfig.address}</span>
          <span>Email: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></span>
          <div className="footer-socials" aria-label="Social links">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label} title={item.label} target="_blank" rel="noreferrer">
                <SocialIcon icon={item.icon} />
              </a>
            ))}
          </div>
        </address>
      </section>
    </footer>
  );
}
