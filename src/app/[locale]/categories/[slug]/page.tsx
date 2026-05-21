import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cms } from "@/cms/client";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { SearchBox } from "@/components/SearchBox";
import { buildMetadata } from "@/lib/metadata";
import { findEditor, getCategoryImage } from "@/lib/content";
import { localizedPath } from "@/i18n/routing";
import { breadcrumbJsonLd, getLanguageAlternates, JsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tCategories = await getTranslations({ locale, namespace: "common.categories" });
  const tCategory = await getTranslations({ locale, namespace: "category" });
  try {
    const category = await cms.category(slug, { language: locale });
    const displayTitle = category.language === locale && category.name ? category.name : tCategories(slug);
    const displayDescription = category.language === locale ? category.seo_description ?? category.description ?? tCategory("fallbackDescription") : tCategory("fallbackDescription");
    return buildMetadata({
      title: category.language === locale ? category.seo_title ?? displayTitle : displayTitle,
      description: displayDescription,
      path: localizedPath(locale, `/categories/${slug}`),
      image: getCategoryImage(category),
      languages: await getLanguageAlternates(`/categories/${slug}`)
    });
  } catch {
    return buildMetadata({
      title: t("categoryTitle"),
      description: t("categoryDescription"),
      path: localizedPath(locale, `/categories/${slug}`),
      languages: await getLanguageAlternates(`/categories/${slug}`)
    });
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tCategory = await getTranslations("category");
  const tCommon = await getTranslations("common");
  const tCategories = await getTranslations("common.categories");
  const page = Math.max(Number((await searchParams).page ?? "1"), 1);

  try {
    const [category, editorsPage, articlesPage] = await Promise.all([
      cms.category(slug, { language: locale }),
      cms.editors({ language: locale, page: 1, page_size: 50 }),
      cms.articles({ language: locale, category_slug: slug, page, page_size: 12, sort: "published_at", order: "desc" })
    ]);
    const displayName = category.language === locale && category.name ? category.name : tCategories(slug);
    const displayDescription = category.language === locale ? category.description ?? category.seo_description ?? tCategory("fallbackDescription") : tCategory("fallbackDescription");

    return (
      <>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: displayName,
              description: displayDescription,
              url: `${process.env.SITE_URL ?? "https://www.globalcityreview.com"}${localizedPath(locale, `/categories/${slug}`)}`
            },
            breadcrumbJsonLd([
              { name: "Global City Review", path: localizedPath(locale) },
              { name: displayName, path: localizedPath(locale, `/categories/${slug}`) }
            ])
          ]}
        />
        <section className="category-hero">
          <div>
            <p className="eyebrow">{tCategory("eyebrow")}</p>
            <h1>{displayName}</h1>
            <p>{displayDescription}</p>
            <SearchBox compact locale={locale} />
          </div>
          <div className="category-image">
            <Image src={getCategoryImage(category)} alt={displayName} fill sizes="(max-width: 900px) 100vw, 42vw" />
          </div>
        </section>

        {articlesPage.items.length === 0 ? (
          <EmptyState title={tCategory("emptyTitle")} message={tCategory("emptyMessage")} />
        ) : (
          <section className="list-layout">
            {articlesPage.items.map((article) => (
              <ArticleCard key={article.id} article={article} category={category} editor={findEditor(editorsPage.items, article.editor_id)} locale={locale} />
            ))}
          </section>
        )}

        <nav className="pagination" aria-label={tCommon("pagination")}>
          {page > 1 && <a href={`${localizedPath(locale, `/categories/${slug}`)}?page=${page - 1}`}>{tCommon("previousPage")}</a>}
          <span>{tCommon("pageIndicator", { page: articlesPage.page, total: Math.max(articlesPage.total_pages, 1) })}</span>
          {page < articlesPage.total_pages && <a href={`${localizedPath(locale, `/categories/${slug}`)}?page=${page + 1}`}>{tCommon("nextPage")}</a>}
        </nav>

      </>
    );
  } catch (error) {
    return <ErrorState title={tCategory("errorTitle")} message={error instanceof Error ? error.message : undefined} />;
  }
}
