import type { Article, ArticleTranslation, Category, Editor } from "@/cms/public";
import { categoryImageFallbacks, siteConfig } from "./config";

export function translationOf(article: Article): ArticleTranslation | null {
  return article.translations[0] ?? null;
}

export function articleSlug(article: Article): string {
  return translationOf(article)?.slug ?? article.canonical_slug;
}

export function articleTitle(article: Article, fallback = "Untitled article"): string {
  return translationOf(article)?.title ?? fallback;
}

export function articleDescription(article: Article, fallback = "This article has no summary yet."): string {
  const translation = translationOf(article);
  return translation?.description ?? translation?.summary ?? fallback;
}

export function categoryName(category?: Category, fallback = "Uncategorized"): string {
  return category?.name ?? category?.slug ?? fallback;
}

export function editorName(editor?: Editor | null, fallback = "Editorial desk"): string {
  return editor?.display_name ?? fallback;
}

export function findCategory(categories: Category[], id: number): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function findEditor(editors: Editor[], id: number | null): Editor | undefined {
  if (!id) return undefined;
  return editors.find((editor) => editor.id === id);
}

export function formatDate(value: string | null | undefined, locale = "en"): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export function getCategoryImage(category?: Category | null): string {
  if (category?.hero_image) return category.hero_image;
  return category ? categoryImageFallbacks[category.slug] ?? "/images/gcr-editorial.svg" : "/images/gcr-editorial.svg";
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
