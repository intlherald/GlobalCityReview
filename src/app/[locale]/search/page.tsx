import { getTranslations, setRequestLocale } from "next-intl/server";
import { cms } from "@/cms/client";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { SearchBox } from "@/components/SearchBox";
import { buildMetadata } from "@/lib/metadata";
import { findCategory, findEditor } from "@/lib/content";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd, webPageJsonLd } from "@/lib/seo";

type SearchProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: SearchProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    title: t("searchTitle"),
    description: t("searchDescription"),
    path: localizedPath(locale, "/search"),
    languages: await getLanguageAlternates("/search")
  });
}

export default async function SearchPage({ params: routeParams, searchParams }: SearchProps) {
  const { locale } = await routeParams;
  setRequestLocale(locale);
  const t = await getTranslations("search");
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Math.max(Number(params.page ?? "1"), 1);

  try {
    const [categoriesPage, editorsPage, articlesPage] = await Promise.all([
      cms.categories({ language: locale, page: 1, page_size: 50 }),
      cms.editors({ language: locale, page: 1, page_size: 50 }),
      q
        ? cms.articles({ language: locale, q, page, page_size: 12, sort: "published_at", order: "desc" })
        : Promise.resolve({ items: [], page: 1, page_size: 12, total: 0, total_pages: 0 })
    ]);

    return (
      <section className="page-shell">
        <JsonLd data={webPageJsonLd({ title: t("title"), description: t("emptyMessage"), path: localizedPath(locale, "/search") })} />
        <p className="eyebrow">{t("title")}</p>
        <h1>{t("title")}</h1>
        <SearchBox defaultValue={q} locale={locale} />

        {!q ? (
          <EmptyState title={t("emptyTitle")} message={t("emptyMessage")} />
        ) : articlesPage.items.length === 0 ? (
          <EmptyState title={t("noResultsTitle")} message={t("noResultsMessage")} />
        ) : (
          <div className="list-layout">
            {articlesPage.items.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={findCategory(categoriesPage.items, article.category_id)}
                editor={findEditor(editorsPage.items, article.editor_id)}
                locale={locale}
              />
            ))}
          </div>
        )}
      </section>
    );
  } catch (error) {
    return <ErrorState title={t("errorTitle")} message={error instanceof Error ? error.message : undefined} />;
  }
}
