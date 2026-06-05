import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublicCmsError } from "@/cms/public";
import { cms } from "@/cms/client";
import { ErrorState } from "@/components/ErrorState";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SocialShare } from "@/components/SocialShare";
import { SourceLinks } from "@/components/SourceLinks";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl, categoryName, editorName, findCategory, findEditor, formatDate, translationOf } from "@/lib/content";
import { localizedPath } from "@/i18n/routing";
import { getLanguageAlternates, JsonLd, publisherJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  try {
    const article = await cms.article(slug, { language: locale });
    const content = translationOf(article);
    return buildMetadata({
      title: content?.seo_title ?? content?.title ?? t("articleTitle"),
      description: content?.seo_description ?? content?.description ?? content?.summary ?? t("articleDescription"),
      path: localizedPath(locale, `/articles/${slug}`),
      languages: await getLanguageAlternates(`/articles/${slug}`),
      type: "article"
    });
  } catch {
    return buildMetadata({
      title: t("articleTitle"),
      description: t("articleDescription"),
      path: localizedPath(locale, `/articles/${slug}`),
      languages: await getLanguageAlternates(`/articles/${slug}`),
      type: "article"
    });
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tArticle = await getTranslations("article");
  const tCommon = await getTranslations("common");
  const tCategories = await getTranslations("common.categories");

  try {
    const article = await cms.article(slug, { language: locale });
    const content = translationOf(article);
    if (!content) notFound();

    const [categoriesPage, editorsPage] = await Promise.all([
      cms.categories({ language: locale, page: 1, page_size: 50 }).catch(() => null),
      cms.editors({ language: locale, page: 1, page_size: 50 }).catch(() => null)
    ]);
    const category = categoriesPage ? findCategory(categoriesPage.items, article.category_id) : undefined;
    const editor = editorsPage ? findEditor(editorsPage.items, article.editor_id) : undefined;
    const displayCategory = category?.language === locale && category.name ? category.name : category ? tCategories(category.slug) : tCommon("uncategorized");

    const articleUrl = absoluteUrl(localizedPath(locale, `/articles/${content.slug}`));
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "OpinionNewsArticle",
      headline: content.title,
      description: content.description ?? content.summary,
      datePublished: content.published_at,
      author: { "@type": "Person", name: editorName(editor, tCommon("editorialDesk")) },
      publisher: publisherJsonLd(),
      mainEntityOfPage: articleUrl,
      url: articleUrl,
      sameAs: content.sources.map((source) => source.source_url),
      citation: content.sources.map((source) => source.source_url)
    };

    return (
      <article className="article-page">
        <JsonLd data={jsonLd} />
        <header className="article-header">
          <p className="eyebrow">{displayCategory}</p>
          <h1>{content.title}</h1>
          {content.description && <p className="article-deck">{content.description}</p>}
          <div className="article-meta">
            <span>{editorName(editor, tCommon("editorialDesk"))}</span>
            <time dateTime={content.published_at ?? undefined}>{formatDate(content.published_at, locale) || tCommon("pending")}</time>
            <span>{tCommon("minutes", { count: content.reading_time })}</span>
          </div>
          <SocialShare title={content.social_title ?? content.title} path={localizedPath(locale, `/articles/${content.slug}`)} />
        </header>

        {content.summary && (
          <section className="argument-box">
            <p className="eyebrow">{tArticle("argument")}</p>
            <p>{content.summary}</p>
          </section>
        )}

        <MarkdownBody body={content.body} />

        <section className="disclosure">
          <p className="eyebrow">{tArticle("disclosure")}</p>
          <p>{tArticle("fallbackDisclosure")}</p>
        </section>

        <SourceLinks sources={content.sources} />
      </article>
    );
  } catch (error) {
    if (error instanceof PublicCmsError && error.status === 404) notFound();
    return <ErrorState title={tArticle("errorTitle")} message={error instanceof Error ? error.message : undefined} />;
  }
}
