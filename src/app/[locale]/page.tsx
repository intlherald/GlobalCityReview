import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cms } from "@/cms/client";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { SearchBox } from "@/components/SearchBox";
import { buildMetadata } from "@/lib/metadata";
import { articleDescription, articleSlug, articleTitle, findCategory, findEditor, getCategoryImage, translationOf } from "@/lib/content";
import { sectionOrder } from "@/lib/config";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd, webPageJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    title: t("homeTitle"),
    description: t("homeDescription"),
    path: localizedPath(locale),
    languages: await getLanguageAlternates("/")
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tCategories = await getTranslations("common.categories");

  try {
    const [categoriesPage, editorsPage, articlesPage] = await Promise.all([
      cms.categories({ language: locale, page: 1, page_size: 20, sort: "sort_order", order: "asc" }),
      cms.editors({ language: locale, page: 1, page_size: 50 }),
      cms.articles({ language: locale, page: 1, page_size: 24, sort: "published_at", order: "desc" })
    ]);

    const categories = categoriesPage.items;
    const editors = editorsPage.items;
    const articles = articlesPage.items;
    const lead = articles[0];
    const leadCategory = lead ? findCategory(categories, lead.category_id) : categories[0];
    const leadContent = lead ? translationOf(lead) : null;

    return (
      <>
        <JsonLd data={webPageJsonLd({ title: tHome("heroTitle"), description: tHome("heroDescription"), path: localizedPath(locale) })} />
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">{tHome("eyebrow")}</p>
            <h1>{tHome("heroTitle")}</h1>
            <p>{tHome("heroDescription")}</p>
            <SearchBox locale={locale} />
          </div>
          <div className="hero-image">
            <Image src={getCategoryImage(leadCategory)} alt={tHome("heroImageAlt")} fill priority sizes="(max-width: 900px) 100vw, 46vw" />
          </div>
        </section>

        {articles.length === 0 ? (
          <EmptyState title={tHome("emptyTitle")} message={tHome("emptyMessage")} />
        ) : (
          <>
            <section className="lead-layout">
              <div className="section-label">
                <p className="eyebrow">{tHome("leadEyebrow")}</p>
                <h2>{tHome("leadTitle")}</h2>
              </div>
              {lead && (
                <article className="lead-article">
                  <p className="meta-line">
                    {leadCategory?.language === locale && leadCategory.name ? leadCategory.name : leadCategory ? tCategories(leadCategory.slug) : tHome("sections.editorial.title")}
                  </p>
                  <h2>
                    <Link href={localizedPath(locale, `/articles/${articleSlug(lead)}`)}>{articleTitle(lead, tCommon("unnamedArticle"))}</Link>
                  </h2>
                  <p>{articleDescription(lead, tCommon("untitledDescription"))}</p>
                  {leadContent?.summary && <blockquote>{leadContent.summary}</blockquote>}
                </article>
              )}
            </section>

            <section className="review-index">
              <div>
                <p className="eyebrow">{tHome("sections.editorial.kicker")}</p>
                <h2>{tHome("sections.editorial.title")}</h2>
              </div>
              {articles.slice(1, 5).map((article, index) => (
                <Link className="review-index-item" href={localizedPath(locale, `/articles/${articleSlug(article)}`)} key={article.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{articleTitle(article, tCommon("unnamedArticle"))}</strong>
                </Link>
              ))}
            </section>

            <section className="section-grid">
              {sectionOrder.map((section) => {
                const category = categories.find((item) => item.slug === section.key);
                const sectionArticles = articles.filter((article) => (category ? article.category_id === category.id : false)).slice(0, 3);
                const fallbackTitle = tHome(`sections.${section.key}.title`);
                const displayTitle = category?.language === locale && category.name ? category.name : fallbackTitle;
                return (
                  <div className="section-panel" key={section.key}>
                    <div className="panel-image">
                      <Image src={getCategoryImage(category)} alt={fallbackTitle} fill sizes="(max-width: 900px) 100vw, 33vw" />
                    </div>
                    <div className="section-heading">
                      <p className="eyebrow">{tHome(`sections.${section.key}.kicker`)}</p>
                      <h2>{displayTitle}</h2>
                    </div>
                    {sectionArticles.length === 0 ? (
                      <p className="muted">{tCommon("noChannelArticles")}</p>
                    ) : (
                      sectionArticles.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          category={findCategory(categories, article.category_id)}
                          editor={findEditor(editors, article.editor_id)}
                          locale={locale}
                        />
                      ))
                    )}
                    {category && (
                      <Link className="text-link" href={localizedPath(locale, `/categories/${category.slug}`)}>
                        {tCommon("viewChannel")}
                      </Link>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        )}

      </>
    );
  } catch (error) {
    return <ErrorState message={error instanceof Error ? error.message : undefined} />;
  }
}
