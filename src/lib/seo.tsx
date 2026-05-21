import { cms } from "@/cms/client";
import type { SiteLanguage } from "@/cms/public";
import { defaultLocaleSegment, isLocaleSegment, localizedPath } from "@/i18n/routing";
import { languagePlan, siteConfig } from "./config";
import { absoluteUrl } from "./content";

export const staticSeoRoutes = ["/editors", "/search", "/about", "/editorial-principles", "/privacy", "/terms", "/cookie-policy"];

export function plannedLanguages(): SiteLanguage[] {
  return languagePlan.map((language, index) => ({
    id: index,
    site_id: 0,
    language: language.language,
    display_name: language.displayName,
    native_name: language.nativeName,
    sort_order: index,
    is_default: language.language === defaultLocaleSegment,
    enabled: true
  }));
}

export function normalizeLanguages(languages: SiteLanguage[]): SiteLanguage[] {
  const byLanguage = new Map(languages.filter((language) => language.enabled !== false).map((language) => [language.language, language]));
  return plannedLanguages()
    .map((fallback) => byLanguage.get(fallback.language) ?? fallback)
    .filter((language) => isLocaleSegment(language.language));
}

export async function getEnabledLanguages(): Promise<SiteLanguage[]> {
  try {
    const languages = await cms.languages({ enabled: true });
    return normalizeLanguages(languages);
  } catch {
    return plannedLanguages();
  }
}

export async function getLanguageAlternates(path = "/"): Promise<Record<string, string>> {
  const languages = await getEnabledLanguages();
  return {
    ...Object.fromEntries(languages.map((language) => [language.language, absoluteUrl(localizedPath(language.language, path))])),
    "x-default": absoluteUrl(localizedPath(defaultLocaleSegment, path))
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function webPageJsonLd({ title, description, path }: { title: string; description: string; path: string }) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    mainEntityOfPage: url,
    publisher: publisherJsonLd()
  };
}

export function publisherJsonLd() {
  return {
    "@type": "Organization",
    name: "Global Urban Policy Institute",
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    address: siteConfig.address
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
