import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";

type SocialShareProps = {
  title: string;
  path: string;
};

export function SocialShare({ title, path }: SocialShareProps) {
  const t = useTranslations("share");
  const url = `${siteConfig.url}${path}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    [t("linkedin"), `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`],
    [t("x"), `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`],
    [t("facebook"), `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`],
    [t("email"), `mailto:?subject=${encodedTitle}&body=${encodedUrl}`]
  ];

  return (
    <nav className="share-row" aria-label={t("ariaLabel")}>
      {links.map(([label, href]) => (
        <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">
          {label}
        </a>
      ))}
    </nav>
  );
}
