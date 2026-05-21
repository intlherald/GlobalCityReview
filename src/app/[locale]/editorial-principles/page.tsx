import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd, webPageJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "static.principles" });
  return buildMetadata({
    title: t("title"),
    description: t("p1"),
    path: localizedPath(locale, "/editorial-principles"),
    languages: await getLanguageAlternates("/editorial-principles")
  });
}

export default async function EditorialPrinciplesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("static.principles");
  return (
    <section className="prose-page">
      <JsonLd data={webPageJsonLd({ title: t("title"), description: t("p1"), path: localizedPath(locale, "/editorial-principles") })} />
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1>{t("title")}</h1>
      <h2>{t("h1")}</h2>
      <p>{t("p1")}</p>
      <h2>{t("h2")}</h2>
      <p>{t("p2")}</p>
      <h2>{t("h3")}</h2>
      <p>{t("p3")}</p>
      <h2>{t("h4")}</h2>
      <p>{t("p4")}</p>
    </section>
  );
}
