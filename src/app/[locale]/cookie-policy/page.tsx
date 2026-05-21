import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd, webPageJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "static.cookie" });
  return buildMetadata({
    title: t("title"),
    description: t("p1"),
    path: localizedPath(locale, "/cookie-policy"),
    languages: await getLanguageAlternates("/cookie-policy")
  });
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("static.cookie");
  return (
    <section className="prose-page">
      <JsonLd data={webPageJsonLd({ title: t("title"), description: t("p1"), path: localizedPath(locale, "/cookie-policy") })} />
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1>{t("title")}</h1>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
      <p>{t("p3")}</p>
      <p>{t("p4")}</p>
    </section>
  );
}
