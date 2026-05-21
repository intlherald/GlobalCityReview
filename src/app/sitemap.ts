import type { MetadataRoute } from "next";
import { cms } from "@/cms/client";
import { siteConfig } from "@/lib/config";
import { articleSlug } from "@/lib/content";
import { getEnabledLanguages, staticSeoRoutes } from "@/lib/seo";
import { localizedPath } from "@/i18n/routing";

function sitemapAlternates(locales: string[], path: string) {
  return {
    languages: Object.fromEntries(locales.map((locale) => [locale, `${siteConfig.url}${localizedPath(locale, path)}`]))
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  try {
    const languages = await getEnabledLanguages();
    const locales = languages.map((language) => language.language);
    const entries: MetadataRoute.Sitemap = [];

    for (const language of languages) {
      const locale = language.language;
      const staticRoutes = ["/", ...staticSeoRoutes];
      entries.push(
        ...staticRoutes.map((route) => ({
          url: `${siteConfig.url}${localizedPath(locale, route)}`,
          lastModified: now,
          changeFrequency: route === "/" ? ("daily" as const) : ("monthly" as const),
          priority: route === "/" ? 1 : 0.6,
          alternates: sitemapAlternates(locales, route)
        }))
      );

      const [categories, articles, editors] = await Promise.all([
        cms.categories({ language: locale, page: 1, page_size: 100, sort: "sort_order", order: "asc" }).catch(() => null),
        cms.articles({ language: locale, page: 1, page_size: 100, sort: "published_at", order: "desc" }).catch(() => null),
        cms.editors({ language: locale, page: 1, page_size: 100 }).catch(() => null)
      ]);

      entries.push(
        ...(categories?.items ?? []).map((category) => ({
          url: `${siteConfig.url}${localizedPath(locale, `/categories/${category.slug}`)}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: sitemapAlternates(locales, `/categories/${category.slug}`)
        })),
        ...(articles?.items ?? []).map((article) => ({
          url: `${siteConfig.url}${localizedPath(locale, `/articles/${articleSlug(article)}`)}`,
          lastModified: new Date(article.translations[0]?.published_at ?? now),
          changeFrequency: "monthly" as const,
          priority: 0.9,
          alternates: sitemapAlternates(locales, `/articles/${articleSlug(article)}`)
        })),
        ...(editors?.items ?? []).map((editor) => ({
          url: `${siteConfig.url}${localizedPath(locale, `/editors/${editor.slug}`)}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.5,
          alternates: sitemapAlternates(locales, `/editors/${editor.slug}`)
        }))
      );
    }

    return entries;
  } catch {
    return ["/", ...staticSeoRoutes].map((route) => ({
      url: `${siteConfig.url}${localizedPath(siteConfig.defaultLanguage, route)}`,
      lastModified: now
    }));
  }
}
