import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/config";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd, webPageJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "static.about" });
  return buildMetadata({
    title: t("title"),
    description: t("p1"),
    path: localizedPath(locale, "/about"),
    languages: await getLanguageAlternates("/about")
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("static.about");
  return (
    <section className="prose-page">
      <JsonLd data={webPageJsonLd({ title: t("title"), description: t("p1"), path: localizedPath(locale, "/about") })} />
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1>{t("title")}</h1>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
      <p>
        {t("contact")}<a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
        <br />
        {t("address")}{siteConfig.address}
      </p>
    </section>
  );
}
