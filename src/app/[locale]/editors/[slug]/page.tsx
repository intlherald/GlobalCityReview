import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicCmsError } from "@/cms/public";
import { cms } from "@/cms/client";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { buildMetadata } from "@/lib/metadata";
import { findCategory } from "@/lib/content";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  try {
    const editor = await cms.editor(slug, { language: locale });
    return buildMetadata({
      title: editor.seo_title ?? editor.display_name ?? slug,
      description: editor.seo_description ?? editor.bio ?? t("editorsDescription"),
      path: localizedPath(locale, `/editors/${slug}`),
      languages: await getLanguageAlternates(`/editors/${slug}`),
      type: "profile"
    });
  } catch {
    return buildMetadata({
      title: t("editorsTitle"),
      description: t("editorsDescription"),
      path: localizedPath(locale, `/editors/${slug}`),
      languages: await getLanguageAlternates(`/editors/${slug}`),
      type: "profile"
    });
  }
}

export default async function EditorDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("editors");

  try {
    const editor = await cms.editor(slug, { language: locale });
    const [categoriesPage, articlesPage] = await Promise.all([
      cms.categories({ language: locale, page: 1, page_size: 50 }),
      cms.articles({ language: locale, editor_id: editor.id, page: 1, page_size: 20, sort: "published_at", order: "desc" })
    ]);

    return (
      <section className="page-shell">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: editor.display_name ?? editor.slug,
            description: editor.bio ?? t("fallbackBio"),
            url: `${process.env.SITE_URL ?? "https://www.globalcityreview.com"}${localizedPath(locale, `/editors/${slug}`)}`,
            mainEntity: {
              "@type": "Person",
              name: editor.display_name ?? editor.slug,
              description: editor.bio ?? t("fallbackBio"),
              email: editor.email ?? undefined,
              jobTitle: editor.role ?? t("defaultRole")
            }
          }}
        />
        <p className="eyebrow">{editor.role ?? t("defaultRole")}</p>
        <h1>{editor.display_name ?? editor.slug}</h1>
        <p className="page-intro">{editor.bio ?? t("fallbackBio")}</p>

        <div className="list-layout">
          {articlesPage.items.length === 0 ? (
            <EmptyState title={t("noArticlesTitle")} message={t("noArticlesMessage")} />
          ) : (
            articlesPage.items.map((article) => (
              <ArticleCard key={article.id} article={article} category={findCategory(categoriesPage.items, article.category_id)} editor={editor} locale={locale} />
            ))
          )}
        </div>
      </section>
    );
  } catch (error) {
    if (error instanceof PublicCmsError && error.status === 404) notFound();
    return <ErrorState title={t("detailErrorTitle")} message={error instanceof Error ? error.message : undefined} />;
  }
}
