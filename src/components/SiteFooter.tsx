import Link from "next/link";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";
import { localizedPath } from "@/i18n/routing";

export function SiteFooter({ locale }: { locale: string }) {
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");
  return (
    <footer className="site-footer">
      <div>
        <h2>{tCommon("brand")}</h2>
        <p>{tFooter("description")}</p>
      </div>
      <address>
        {siteConfig.address}
        <br />
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </address>
      <nav aria-label={tFooter("complianceNav")}>
        <Link href={localizedPath(locale, "/editorial-principles")}>{tFooter("editorialPrinciples")}</Link>
        <Link href={localizedPath(locale, "/privacy")}>{tFooter("privacy")}</Link>
        <Link href={localizedPath(locale, "/terms")}>{tFooter("terms")}</Link>
        <Link href={localizedPath(locale, "/cookie-policy")}>{tFooter("cookie")}</Link>
      </nav>
    </footer>
  );
}
