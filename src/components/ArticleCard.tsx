import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Article, Category, Editor } from "@/cms/public";
import { articleDescription, articleSlug, articleTitle, categoryName, editorName, formatDate, translationOf } from "@/lib/content";
import { localizedPath } from "@/i18n/routing";

type ArticleCardProps = {
  article: Article;
  category?: Category;
  editor?: Editor;
  featured?: boolean;
  locale: string;
};

export function ArticleCard({ article, category, editor, featured = false, locale }: ArticleCardProps) {
  const t = useTranslations("common");
  const tCategories = useTranslations("common.categories");
  const content = translationOf(article);
  const displayCategory = category?.language === locale && category.name ? category.name : category ? tCategories(category.slug) : t("uncategorized");

  return (
    <article className={featured ? "article-card featured" : "article-card"}>
      <div className="meta-line">
        <span>{displayCategory}</span>
        <span>{t("minutes", { count: content?.reading_time ?? 4 })}</span>
      </div>
      <h3>
        <Link href={localizedPath(locale, `/articles/${articleSlug(article)}`)}>{articleTitle(article, t("unnamedArticle"))}</Link>
      </h3>
      <p>{articleDescription(article, t("untitledDescription"))}</p>
      <div className="byline">
        <span>{editorName(editor, t("editorialDesk"))}</span>
        <time dateTime={content?.published_at ?? undefined}>{formatDate(content?.published_at, locale) || t("pending")}</time>
      </div>
    </article>
  );
}
