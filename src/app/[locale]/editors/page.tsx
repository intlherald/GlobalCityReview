import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cms } from "@/cms/client";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { buildMetadata } from "@/lib/metadata";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd, webPageJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    title: t("editorsTitle"),
    description: t("editorsDescription"),
    path: localizedPath(locale, "/editors"),
    languages: await getLanguageAlternates("/editors")
  });
}

export default async function EditorsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("editors");
  try {
    const editors = await cms.editors({ language: locale, page: 1, page_size: 50, sort: "display_name", order: "asc" });

    return (
      <section className="page-shell">
        <JsonLd data={webPageJsonLd({ title: t("title"), description: t("intro"), path: localizedPath(locale, "/editors") })} />
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="page-intro">{t("intro")}</p>
        {editors.items.length === 0 ? (
          <EmptyState title={t("emptyTitle")} message={t("emptyMessage")} />
        ) : (
          <div className="editor-grid">
            {editors.items.map((editor) => (
              <article className="editor-card" key={editor.id}>
                <p className="eyebrow">{editor.role ?? t("defaultRole")}</p>
                <h2>
                  <Link href={localizedPath(locale, `/editors/${editor.slug}`)}>{editor.display_name ?? editor.slug}</Link>
                </h2>
                <p>{editor.bio ?? t("fallbackBio")}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  } catch (error) {
    return <ErrorState title={t("errorTitle")} message={error instanceof Error ? error.message : undefined} />;
  }
}
