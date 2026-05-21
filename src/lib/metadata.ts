import type { Metadata } from "next";
import { siteConfig } from "./config";
import { absoluteUrl } from "./content";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  languages?: Record<string, string>;
  type?: "website" | "article" | "profile";
};

const openGraphLocales: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar",
  es: "es_ES",
  zh: "zh_CN",
  it: "it_IT"
};

function localeFromPath(path: string) {
  return path.match(/^\/([^/]+)/)?.[1] ?? siteConfig.defaultLanguage;
}

export function buildMetadata({ title, description, path = "/", image = siteConfig.defaultOgImage, languages, type = "website" }: MetadataInput): Metadata {
  const fullTitle = title.includes(siteConfig.englishName) ? title : `${title} | ${siteConfig.englishName}`;
  const url = absoluteUrl(path);
  const locale = localeFromPath(path);

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.englishName,
      locale: openGraphLocales[locale] ?? "en_US",
      type,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)]
    }
  };
}
